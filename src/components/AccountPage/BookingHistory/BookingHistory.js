import './BookingHistory.scss'
import Table from 'react-bootstrap/Table';
import { getAllBookingByAccount } from '../../../service/bookingService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import PatientForm from '../../PatientForm/PatientForm';
import _, { set } from 'lodash';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { getMedicalResultByID } from '../../../service/bookingService';
import ReactQuill from 'react-quill';

const BookingHistory = () => {

    const [bookingList, setBookingList] = useState()
    const account = useSelector(state => state.accountSlice.account)
    const [show, setShow] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)

    const [result, setResult] = useState({})
    const [content, setContent] = useState("")
    const [selectedID, setSelectedID] = useState(null)
    const [show2, setShow2] = useState(false)

    // call api
    const fetchData = async () => {
        const res = await getAllBookingByAccount(account.ID, "history")
        console.log(res.data)
        res.data.booking.forEach(e => {
            if (_.isEmpty(e.schedule.doctor)) {
                e.bookingService = {
                    Name: e.schedule.healthcare_package.Name,
                    Type: e.schedule.healthcare_package.healthcare_type.Name,
                    Price: e.schedule.healthcare_package.Price
                }
                e.clinic = e.schedule.healthcare_package.clinic
            } else {
                e.bookingService = {
                    Name: e.schedule.doctor.Name,
                    Type: e.schedule.doctor.speciality.Name,
                    Price: e.schedule.doctor.Price
                }
                e.clinic = e.schedule.doctor.clinic
            }
        });
        setBookingList(res.data.booking)
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line
    }, [])

    const closeForm = () => {
        setShow2(false);
        setSelectedID(null)
        setResult({})
        setContent("")
    }

    useEffect(() => {

        const getData = async () => {
            let res = await getMedicalResultByID(selectedID);

            if (!_.isEmpty(res.data.result)) {
                setResult({
                    ID: res.data.result.ID,
                    Date: res.data.result.Date,
                    ID_booking: res.data.result.ID_booking
                });
                setContent(res.data.result.Result)
            }
        }
        getData()
        // eslint-disable-next-line
    }, [selectedID])

    return (
        <>
            <div className="bh-container">
                <div className="as-title">Booking History</div>
                <div className='as-table'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Medical Facility</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingList?.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.ID}</td>
                                        <td>
                                            <div className='as-name'>{item.bookingService.Name} - {item.bookingService.Type}</div>
                                            {/* <div>{item.bookingService.Type}</div> */}
                                            {
                                                !_.isEmpty(item.booking_package_services) &&
                                                <>
                                                    <div>*Optional: </div>
                                                    {
                                                        item.booking_package_services.map((e, index) => {
                                                            return <div>{e.healthcare_service.Name}</div>
                                                        })
                                                    }
                                                </>

                                            }
                                        </td>
                                        <td>
                                            <div>{item.schedule.Date}</div>
                                            <div>{item.schedule.time_type.Value}</div>
                                        </td>
                                        <td>
                                            <div>{item.Total_price} VND</div>
                                            <div>{item?.payments[0]?.Payment_method}</div>
                                            <div>{item?.payments[0]?.Status}</div>
                                            <div>{item?.payments[0]?.Payment_date}</div>
                                        </td>
                                        <td>{item.Status}</td>
                                        <td>
                                            <div>{item.clinic.Name}</div>
                                            <div className='as-address'><FontAwesomeIcon icon={faLocationDot} className='as-icon me-1' />{item.clinic.Address}</div>
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-center align-items-center flex-column gap-3'>
                                                <button className="btn btn-primary" onClick={() => { setSelectedPatient(item.patient); setShow(true) }}>Patient</button>
                                                {
                                                    item.Status === "Finished" &&
                                                    <button style={{ color: "white" }} className="btn btn-info" onClick={() => { setSelectedID(item.ID); setShow2(true) }}>Result</button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
            <PatientForm viewOnly={true} show={show} setShow={setShow} fetchData={fetchData} patient={selectedPatient} setPatient={setSelectedPatient} />

            <Modal show={show2} onHide={() => closeForm()} centered id="result-patient" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Medical Examination Result</Modal.Title>
                    <div style={{ margin: "0px auto", fontSize: "20px" }}>
                        {
                            !_.isEmpty(result) &&
                            <div>Updated: {result?.Date} </div>
                        }
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">
                        {/* <div className='py-3 px-4' >
                            <div className='content-result p-3' style={{ height: "450px", border: "1px solid #A9A9A9", borderRadius: "5px", overflowX: "auto" }} dangerouslySetInnerHTML={{ __html: content }}>

                            </div>
                        </div> */}
                        <ReactQuill
                            readOnly={true}
                            modules={{
                                toolbar: [

                                ],
                            }}
                            theme="snow" value={content} onChange={(e) => setContent(e)}
                        />;
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default BookingHistory