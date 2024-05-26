import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import './BookingStatus.scss';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { getBookingForDoctor } from "../../../service/bookingService";
import { useSelector } from "react-redux"
import PatientForm from "../../../components/PatientForm/PatientForm";
import EditStatus from "./EditStatus";
import { getAllTimeType } from "../../../service/scheduleService";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import Pagination from '@mui/material/Pagination';

const BookingStatus = () => {

    const maxDate = dayjs().add(1, 'month').endOf('month');
    const [booking, setBooking] = useState([]);
    const account = useSelector(state => state.accountSlice.account)
    const [show, setShow] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filterDate, setFilterDate] = useState(null);
    const [timeType, setTimeType] = useState([]);
    const location = useLocation();
    const data = location.state;
    const [totalPage, setTotalPage] = useState(1);
    const [selectedID, setSelectedID] = useState(null);
    const [queryObject, setQueryObject] = useState({
        date: null,
        page: 1,
        time: "all",
        status: "all"
    });

    const fetchData = async (id, queryObject) => {
        let res = null
        if (queryObject?.date === null) {
            res = await getBookingForDoctor(id, queryObject.status, "all", queryObject.time, queryObject.page);
        } else {
            res = await getBookingForDoctor(id, queryObject.status, dayjs(queryObject.date).format('MM-DD-YYYY'), queryObject.time, queryObject.page);
        }
        setBooking(res.data.result.booking.result)
        setFilterDate(res.data.result.scheduleDate)
        setTotalPage(res.data.result.booking.totalPages)
    }

    useEffect(() => {
        const getData = async () => {
            const res2 = await getAllTimeType();
            setTimeType(res2.data.timeType);
        };
        getData();

        setSelectedID(data?.id)

        if (!_.isEmpty(data)) {
            if (_.isEmpty(data?.status)) {
                data.status = "all"
            }
            setQueryObject({
                ...queryObject,
                date: data.date,
                time: data.time,
                status: data.status
            })
        } else {
            fetchData(account.doctors[0].ID, queryObject);
        }

    }, [])

    useEffect(() => {
        fetchData(account.doctors[0].ID, queryObject);
    }, [queryObject])

    const isAvailableDate = (date) => {
        return filterDate?.includes(dayjs(date).format('MM-DD-YYYY'))
    };

    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };

    return (
        <div className="doc-booking">

            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Booking Status</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Booking Status</span>
                    </div>
                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column justify-content-center align-items-center gap-3">
                                    <DatePicker
                                        dateFormat="MM-DD-YYYY"
                                        selected={queryObject.date}
                                        onChange={(date) => { setQueryObject({ ...queryObject, date: date, page: 1 }); setSelectedID(null) }}
                                        monthsShown={2}
                                        inline
                                        maxDate={maxDate.format('MM-DD-YYYY')}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        filterDate={isAvailableDate}
                                        dayClassName={(date) => {
                                            if (queryObject.status === "all") {
                                                return isAvailableDate(date) ? "availableDateAll" : ""
                                            }
                                            if (queryObject.status === "Pending") {
                                                return isAvailableDate(date) ? "availableDatePending" : ""
                                            }
                                            if (queryObject.status === "Approved") {
                                                return isAvailableDate(date) ? "availableDateApproved" : ""
                                            }
                                            if (queryObject.status === "Finished") {
                                                return isAvailableDate(date) ? "availableDateFinished" : ""
                                            }
                                            if (queryObject.status === "Cancelled") {
                                                return isAvailableDate(date) ? "availableDateCancelled" : ""
                                            }
                                            return ""
                                        }
                                        }
                                    />
                                    <div className="d-flex gap-3 align-items-center">
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ fontSize: '20px', width: '165px' }}>Date: {queryObject.date !== null ? dayjs(queryObject.date).format('MM-DD-YYYY') : 'All'}</div>
                                            {queryObject.date !== null
                                                ?
                                                <div className="close"
                                                    onClick={() => { setQueryObject({ ...queryObject, date: null, page: 1 }); setSelectedID(null) }}
                                                ></div>
                                                :
                                                <>
                                                </>
                                            }
                                        </div>
                                        <div style={{ fontSize: '20px', marginLeft: '10px' }}>Time: </div>
                                        <Form.Select style={{ width: '200px' }} value={queryObject.time}
                                            onChange={(e) => { setQueryObject({ ...queryObject, time: e.target.value, page: 1 }); setSelectedID(null) }}
                                            aria-label="Default select example">
                                            {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                                            <option value="all">All</option>
                                            {timeType?.map((item, index) => {
                                                return <option key={`timeType${index}`} value={item.ID}>{item.Value}</option>
                                            })}
                                        </Form.Select>
                                        <div style={{ fontSize: '20px' }}>Status: </div>
                                        <Form.Select value={queryObject.status} onChange={(e) => { setQueryObject({ ...queryObject, status: e.target.value, page: 1 }); setSelectedID(null) }} aria-label="Default select example">
                                            {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                                            <option value="all">All</option>
                                            <option value="Pending">Pending</option>
                                            {/* <option value="Approved">Approved</option> */}
                                            <option value="Finished">Finished</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="as-table" style={{ minHeight: '500px' }}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Booking Date</th>
                                                    <th>Appointment Infomation</th>
                                                    <th>Payment</th>
                                                    <th>Patient Infomation</th>
                                                    <th style={{ textAlign: 'center' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booking?.map((item, index) => {
                                                    return (
                                                        <tr key={`booking${item.ID}`} className={selectedID === item.ID ? "border-booking" : ""}>
                                                            <td>
                                                                {item?.ID}
                                                            </td>
                                                            <td>
                                                                {item?.Booking_date}
                                                            </td>
                                                            <td>
                                                                <div>ID: {item?.schedule.ID}</div>
                                                                <div>Date: {item?.schedule.Date}</div>
                                                                <div>Time: {item?.schedule.time_type.Value}</div>
                                                            </td>
                                                            <td>
                                                                <div>{item?.payments[0]?.Payment_method}</div>
                                                                <div>{item?.payments[0]?.Status}</div>
                                                                <div>{item?.payments[0]?.Payment_date}</div>
                                                            </td>
                                                            <td>
                                                                <div>Name: {item?.patient.Name}</div>
                                                                <div>Phone: {item?.patient.Phone}</div>
                                                                <button className="btn btn-primary mt-1" onClick={() => { setSelectedPatient(item.patient); setShow(true) }}>Patient Info</button>
                                                            </td>
                                                            <td>
                                                                <EditStatus item={item} queryObject={queryObject} docID={account.doctors[0]?.ID} fetchData={fetchData} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-center p-2">
                                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PatientForm viewOnly={true} show={show} setShow={setShow} fetchData={fetchData} patient={selectedPatient} setPatient={setSelectedPatient} />
            </section >
        </div >
    )
}

export default BookingStatus