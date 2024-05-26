import './BookingHistory.scss'
import Table from 'react-bootstrap/Table';
import { getAllBookingByAccount } from '../../../service/bookingService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import PatientForm from '../../PatientForm/PatientForm';
import _ from 'lodash';

const BookingHistory = () => {

    const [bookingList, setBookingList] = useState()
    const account = useSelector(state => state.accountSlice.account)
    const [show, setShow] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)

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
                                            <button className="btn btn-primary" onClick={() => { setSelectedPatient(item.patient); setShow(true) }}>Patient</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
            <PatientForm viewOnly={true} show={show} setShow={setShow} fetchData={fetchData} patient={selectedPatient} setPatient={setSelectedPatient} />
        </>
    )
}

export default BookingHistory