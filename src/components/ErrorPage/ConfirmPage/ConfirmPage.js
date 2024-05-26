import "./ConfirmPage.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faDollarSign, faHospital, faTrashCan, faArrowLeft, faUser, faCalendarDays, faAt, faCreditCard, faVenusMars, faAddressCard, faPeopleGroup, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'
import _ from 'lodash';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { createBooking } from "../../service/bookingService";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import sha256 from 'js-sha256';

const ConfirmPage = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const account = useSelector(state => state.accountSlice.account)
    const [selectedService, setSelectedService] = useState(null)
    var now = dayjs()
    const [dataServices, setDataServices] = useState([])

    useEffect(() => {
        if (_.isEmpty(account) || _.isEmpty(state)) {
            navigate("/")
        } else {
            if (_.isEmpty(state.selectedDoctor)) {
                setSelectedService({
                    Name: state.selectedHealthcare.Name,
                    Type: state.selectedHealthcare.healthcare_type.Name,
                    Clinic: state.selectedHealthcare.clinic,
                    Price: state.selectedHealthcare.Price
                })
                setDataServices(state.selectedServices)
            } else {
                setSelectedService({
                    Name: state.selectedDoctor.Name,
                    Type: state.selectedDoctor.speciality.Name,
                    Clinic: state.selectedDoctor.clinic,
                    Price: state.selectedDoctor.Price
                })
            }
        }
        // eslint-disable-next-line
    }, [])

    const totalPrice = () => {
        let total = 0
        total += selectedService?.Price
        if (!_.isEmpty(dataServices)) {
            for (let i = 0; i < dataServices.length; i++) {
                total += dataServices[i]?.Price
            }
        }
        return total
    }

    const cancelBtn = () => {
        Swal.fire({
            title: "Do you want to delete your booking information?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/")
            } else if (result.isDenied) {

            }
        });
    }

    const goBackBtn = () => {
        navigate(-1, { state: { selectedServices: state.selectedServices, selectedSchedule: state.selectedSchedule, selectedDoctor: state.selectedDoctor, selectedHealthcare: state.selectedHealthcare } })
    }

    const confirmBtn = async () => {
        setModalShow(true)
    }

    const cancelServiceBtn = (id) => {
        Swal.fire({
            title: "Do you want to cancel this service?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                setDataServices(dataServices.filter((e) => e.ID !== id))
            } else if (result.isDenied) {

            }
        });
    }

    const [modalShow, setModalShow] = useState(false);
    // State để lưu trữ giá trị được chọn của radio button
    const [selectedOption, setSelectedOption] = useState('');

    // Hàm xử lý sự kiện khi radio button thay đổi
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const paymentBtn = async () => {
        if (selectedOption === '') {
            toast.error("Please choose a payment method")
        } else if (selectedOption === 'option1') {
            const res = await createBooking({
                ID_patient: state.selectedPatient.ID,
                ID_schedule: state.selectedSchedule.ID,
                Booking_date: now.format('MM-DD-YYYY'),
                Status: "Pending",
                IsDeleted: 0,
                Total_price: totalPrice(),
                dataServices: dataServices,
                PaymentInfo: {
                    ID: Date.now(),
                    Payment_method: "Cash",
                }
            })
            if (res.data.code === 0) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
            navigate("/")
        } else if (selectedOption === 'option2') {

            let booking = {
                ID_patient: state.selectedPatient.ID,
                ID_schedule: state.selectedSchedule.ID,
                Booking_date: now.format('MM-DD-YYYY'),
                Status: "Pending",
                IsDeleted: 0,
                Total_price: totalPrice(),
                dataServices: dataServices
            }

            localStorage.setItem("booking", JSON.stringify(booking));

            let data = {
                "orderCode": Date.now(),
                "amount": 2000,
                "description": "LifeClinicService",
                // "buyerName": "Nguyen Van A",
                // "buyerEmail": "buyer-email@gmail.com",
                // "buyerPhone": "090xxxxxxx",
                // "buyerAddress": "số nhà, đường, phường, tỉnh hoặc thành phố",
                // "items": [],
                "cancelUrl": "http://localhost:3000",
                "returnUrl": "http://localhost:3000/success",
                // "expiredAt": 1696559798,
                // "signature": "string"
            }

            data.signature = generateSignature(data, 'a253d67d11081f0a1787907db2925bd836e6db81f9dff41761dc2ecd5b4ed5ff');

            let axiosInstance = axios.create({
                baseURL: 'https://api-merchant.payos.vn',
                headers: {
                    'x-client-id': '82a3ff1a-775b-4aa0-804c-850f60d2c043',
                    'x-api-key': '869f2a5c-6ba3-4bfa-9d8a-ce456a23d8ac'
                }
            });
            let res = await axiosInstance.post("/v2/payment-requests", data)
            window.location.href = res.data.data.checkoutUrl
        }

        // Function to generate signature
        function generateSignature(data, checksumKey) {
            // Sort data alphabetically by keys
            const sortedData = Object.keys(data)
                .sort()
                .map(key => `${key}=${data[key]}`)
                .join('&');

            // Calculate SHA-256 HMAC hash
            const signature = sha256.hmac(checksumKey, sortedData);

            return signature;
        }
    }

    return (
        <div className="fluid-container confirm-page py-4">
            <div className="row con-container">
                <div className="col-3">
                    <div className="confirm-title">Medical Facility Information</div>
                    <div className="con-left-content">
                        <div>
                            <span className="con-s1-icon"><FontAwesomeIcon icon={faHospital} /></span>
                            <span>{selectedService?.Clinic?.Name}</span>
                        </div>
                        <div className="address-detail">
                            {selectedService?.Clinic?.Address}
                        </div>
                    </div>

                </div>
                <div className="col-9">
                    <div>
                        <div className="confirm-title">Appointment Information</div>
                        <div className="con-up-content">
                            <Table borderless>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Service</th>
                                        <th>Category</th>
                                        <th>Time schedule</th>
                                        <th>Price</th>
                                        <th> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>{selectedService?.Name}</td>
                                        <td>{selectedService?.Type}</td>
                                        <td>
                                            <div>{state?.selectedSchedule.time_type.Value}</div>
                                            <div>{state?.selectedSchedule.Date}</div>
                                        </td>
                                        <td>{selectedService?.Price} VND</td>
                                        <td >
                                            <div className="trash-icon" onClick={cancelBtn}>
                                                <FontAwesomeIcon icon={faTrashCan} className="fa-sm" />
                                            </div>
                                        </td>
                                    </tr>
                                    {
                                        !_.isEmpty(dataServices) ? (
                                            <>
                                                {
                                                    dataServices.map((item, index) => (
                                                        <tr>
                                                            <td>{index + 2}</td>
                                                            <td>{item?.Name}</td>
                                                            <td></td>
                                                            <td>
                                                            </td>
                                                            <td>{item?.Price} VND</td>
                                                            <td >
                                                                <div className="trash-icon" onClick={() => cancelServiceBtn(item.ID)}>
                                                                    <FontAwesomeIcon icon={faTrashCan} className="fa-sm" />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </tbody>
                            </Table>
                            <div className="py-3 d-flex justify-content-end pe-5 align-items-center gap-2" >
                                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                                    Total Price:
                                </div>
                                <div style={{ fontSize: "18px" }}>
                                    {
                                        totalPrice()
                                    }
                                    <span> VND</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mt-4">
                        <div className="confirm-title">Patient information</div>
                        <div className="con-down-content d-flex">
                            <div className="con-down-content-left ps-1">
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faUser} /></span>
                                    Patient Name:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.Name}</span>
                                </div>
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faCalendarDays} /></span>
                                    Date of birth:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.DateOfBirth}</span>
                                </div>
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faAt} /></span>
                                    Email address:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.Email}</span>
                                </div>
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faCreditCard} /></span>
                                    Health Insurance Code:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.Health_insurance_code}</span>
                                </div>
                            </div>
                            <div className="con-down-content-right ps-3">
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faVenusMars} /></span>
                                    Gender:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.Gender}</span>
                                </div>
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faAddressCard} /></span>
                                    Citizen ID Number:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.Citizen_id_number}</span>
                                </div>
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faPeopleGroup} /></span>
                                    Ethnicity:
                                    <span className="ms-2 fw-bold">{state?.selectedPatient.Ethnicity}</span>
                                </div>
                                <div className="mb-1 d-flex">
                                    <span className="con-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                    <div className="d-flex">
                                        Address:
                                        <span className="ms-2 fw-bold">{state?.selectedPatient.Address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-group2 d-flex justify-content-between align-items-center mt-4">
                        <button type="button" className="btn btn-primary btn-goback" onClick={goBackBtn}><FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back</button>
                        <button type="button" className="btn btn-primary btn-add" onClick={confirmBtn}>Book Now</button>
                    </div>
                </div>
            </div>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Payment Method
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Please choose a payment method</h4>
                    <div id="payment-modal" class="mt-4">
                        <section class="section questions">
                            <div class="section__inner">
                                <form id="loanTypesForm" class="form questions__form">
                                    <div class="form__tab active">
                                        <fieldset class="form__group">
                                            <label class="form__label" for="purchase">
                                                <input
                                                    value="option1"
                                                    checked={selectedOption === 'option1'}
                                                    onChange={handleOptionChange}
                                                    class="form__input" required type="radio" name="loanType" id="purchase" />
                                                <svg class="benefits__car form__label-img" viewBox="0 0 512 512" title="car">
                                                    <FontAwesomeIcon icon={faDollarSign} />
                                                </svg>
                                                <span class="form__label-name">Cash</span>
                                                <span class="form__label-text">Pay after the examination is complete.</span>
                                                <svg class="form__label-check" viewBox="0 0 512 512" title="check-circle">
                                                    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                                                </svg>
                                            </label>

                                            <label class="form__label" for="refinance">
                                                <input
                                                    value="option2"
                                                    checked={selectedOption === 'option2'}
                                                    onChange={handleOptionChange}
                                                    class="form__input" required type="radio" name="loanType" id="refinance" />
                                                <svg class="benefits__dollar form__label-img" viewBox="0 0 640 512" title="biking">
                                                    <FontAwesomeIcon icon={faBuildingColumns} />
                                                </svg>
                                                <span class="form__label-name">Bank Transfer</span>
                                                <span class="form__label-text">Pay from your local bank account</span>
                                                <svg class="form__label-check" viewBox="0 0 512 512" width="100" title="check-circle">
                                                    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                                                </svg>
                                            </label>
                                        </fieldset>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setModalShow(false)}>Close</Button>
                    <Button onClick={() => paymentBtn()}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default ConfirmPage

