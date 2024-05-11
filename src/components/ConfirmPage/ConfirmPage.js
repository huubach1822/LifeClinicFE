import "./ConfirmPage.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital, faTrashCan, faArrowLeft, faUser, faCalendarDays, faAt, faCreditCard, faVenusMars, faAddressCard, faPeopleGroup, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'
import _ from 'lodash';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { createBooking } from "../../service/bookingService";
import dayjs from "dayjs";
import { toast } from "react-toastify";

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
        const res = await createBooking({
            ID_patient: state.selectedPatient.ID,
            ID_schedule: state.selectedSchedule.ID,
            Booking_date: now.format('MM-DD-YYYY'),
            Status: "Pending",
            IsDeleted: 0,
            Total_price: totalPrice(),
            dataServices: dataServices
        })
        if (res.data.code === 0) {
            toast.success(res.data.message)
        } else {
            toast.error(res.data.message)
        }
        navigate("/")
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
                        <button type="button" className="btn btn-primary btn-add" onClick={confirmBtn}>Confirm</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ConfirmPage

