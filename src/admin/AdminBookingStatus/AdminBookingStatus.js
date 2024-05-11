import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import './AdminBookingStatus.scss';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { getBookingForAdmin } from "../../service/bookingService";
import PatientForm from "../../components/PatientForm/PatientForm";
import EditStatus from "./EditStatus";
import { getAllTimeType } from "../../service/scheduleService";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { getAllDoctors } from "../../service/doctorService";
import { getAllHealthcare } from "../../service/healthcareService";
import tempLogo from "../../asset/image/Healthcarepackage/tempLogo.webp";

const AdminBookingStatus = () => {

    const maxDate = dayjs().add(1, 'month').endOf('month');
    const [booking, setBooking] = useState([]);
    const [healthCare, setHealthCare] = useState([]);
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
        status: "all",
        selectedDoctor: {
            ID: "all",
            Name: "All",
        },
        selectedHealthCare: {
            ID: "all",
            Name: "All",
        },
        flag: "doctor"
    });
    const [doctors, setDoctors] = useState([])

    const fetchData = async () => {
        let res = null
        let date = null
        let id = null
        if (queryObject?.date === null) {
            date = "all"
        } else {
            date = dayjs(queryObject.date).format('MM-DD-YYYY')
        }
        if (queryObject?.flag === "doctor") {
            id = queryObject.selectedDoctor.ID
        } else {
            id = queryObject.selectedHealthCare.ID
        }

        res = await getBookingForAdmin(id, queryObject.status, date, queryObject.time, queryObject.page, queryObject.flag);
        console.log(res.data.result.booking.result)
        setBooking(res.data.result.booking.result)
        setFilterDate(res.data.result.scheduleDate)
        setTotalPage(res.data.result.booking.totalPages)
    }

    useEffect(() => {
        const getData = async () => {
            const res2 = await getAllTimeType();
            setTimeType(res2.data.timeType);
            let res3 = await getAllDoctors();
            res3.data.doctors.unshift({ ID: "all", Name: "All" })
            setDoctors(res3.data.doctors)
            let res4 = await getAllHealthcare();
            res4.data.healthcarePackage.unshift({ ID: "all", Name: "All" })
            setHealthCare(res4.data.healthcarePackage)
        };
        getData();

        setSelectedID(data?.id)

        if (!_.isEmpty(data)) {
            if (_.isEmpty(data?.status)) {
                data.status = "all"
            }
            if (_.isEmpty(data?.doctor)) {
                data.doctor = {
                    ID: "all",
                    Name: "All",
                }
            }
            if (_.isEmpty(data?.healthCare)) {
                data.healthCare = {
                    ID: "all",
                    Name: "All",
                }
            }
            setQueryObject({
                ...queryObject,
                date: data.date,
                time: data.time,
                status: data.status,
                selectedDoctor: data.doctor,
                selectedHealthCare: data.healthCare,
                flag: data.flag
            })
        } else {
            fetchData();
        }

    }, [])

    useEffect(() => {
        fetchData();
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
        <div className="admin-doc-booking">

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
                                    <div className="d-flex gap-3 align-items-end">
                                        {
                                            queryObject.flag == "doctor" ?
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    sx={{ width: 300 }}
                                                    options={doctors}
                                                    autoHighlight
                                                    disableClearable
                                                    value={queryObject.selectedDoctor}
                                                    onChange={(e, value) => { setQueryObject({ ...queryObject, page: 1, selectedDoctor: value, selectedHealthCare: null }); setSelectedID(null) }}
                                                    getOptionLabel={(option) => option.Name}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            <img
                                                                loading="lazy"
                                                                width="20"
                                                                srcSet={process.env.REACT_APP_BACKEND_URL + option.Avatar}
                                                                src={process.env.REACT_APP_BACKEND_URL + option.Avatar}
                                                                alt=""
                                                            />
                                                            {option.Name}
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Choose a doctor"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                :
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    sx={{ width: 300 }}
                                                    options={healthCare}
                                                    autoHighlight
                                                    disableClearable
                                                    value={queryObject.selectedHealthCare}
                                                    onChange={(e, value) => { setQueryObject({ ...queryObject, page: 1, selectedHealthCare: value, selectedDoctor: null }); setSelectedID(null) }}
                                                    getOptionLabel={(option) => option.Name}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            <img
                                                                loading="lazy"
                                                                width="20"
                                                                srcSet={tempLogo}
                                                                src={tempLogo}
                                                                alt=""
                                                            />
                                                            {option.Name}
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Choose a healthcare package"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                        }
                                        <Form.Group controlId="flagSelect">
                                            <Form.Label>Filter</Form.Label>
                                            <Form.Select
                                                id="flagSelect"
                                                value={queryObject.flag}
                                                onChange={(e) => {
                                                    setQueryObject({
                                                        date: null,
                                                        page: 1,
                                                        time: "all",
                                                        status: "all",
                                                        selectedDoctor: {
                                                            ID: "all",
                                                            Name: "All",
                                                        },
                                                        selectedHealthCare: {
                                                            ID: "all",
                                                            Name: "All",
                                                        },
                                                        flag: e.target.value
                                                    });
                                                    setSelectedID(null);
                                                }}
                                                aria-label="Default select example"
                                            >
                                                {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                                                <option value="doctor">Doctor</option>
                                                <option value="healthcare">HealthCare Package</option>
                                            </Form.Select>
                                        </Form.Group>
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
                                        <Form.Group controlId="timeSelect">
                                            <Form.Label>Booking Time</Form.Label>
                                            <Form.Select
                                                id="timeSelect"
                                                style={{ width: '200px' }}
                                                value={queryObject.time}
                                                onChange={(e) => {
                                                    setQueryObject({ ...queryObject, time: e.target.value, page: 1 });
                                                    setSelectedID(null);
                                                }}
                                                aria-label="Default select example"
                                            >
                                                {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                                                <option value="all">All</option>
                                                {timeType?.map((item, index) => {
                                                    return <option key={`timeType${index}`} value={item.ID}>{item.Value}</option>
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group controlId="statusSelect">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select
                                                style={{ width: '200px' }}
                                                id="statusSelect"
                                                value={queryObject.status}
                                                onChange={(e) => {
                                                    setQueryObject({ ...queryObject, status: e.target.value, page: 1 });
                                                    setSelectedID(null);
                                                }}
                                                aria-label="Default select example"
                                            >
                                                {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                                                <option value="all">All</option>
                                                <option value="Pending">Pending</option>
                                                {/* <option value="Approved">Approved</option> */}
                                                <option value="Finished">Finished</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </Form.Select>
                                        </Form.Group>
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
                                                                {
                                                                    queryObject.flag === "doctor" ?
                                                                        <div>Doctor: {item?.schedule?.doctor?.Name}</div>
                                                                        :
                                                                        <>
                                                                            <div>Package: {item?.schedule?.healthcare_package?.Name}</div>
                                                                            {
                                                                                !_.isEmpty(item.booking_package_services) &&
                                                                                <>
                                                                                    <div>Optional: </div>
                                                                                    {
                                                                                        item.booking_package_services.map((e, index) => {
                                                                                            return <div>{e.healthcare_service.Name}</div>
                                                                                        })
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </>
                                                                }
                                                                <div>ID Appointment: {item?.schedule.ID}</div>
                                                                <div>Date: {item?.schedule.Date}</div>
                                                                <div>Time: {item?.schedule.time_type.Value}</div>
                                                            </td>
                                                            <td>
                                                                <div>Name: {item?.patient.Name}</div>
                                                                <div>Phone: {item?.patient.Phone}</div>
                                                                <button className="btn btn-primary mt-1" onClick={() => { setSelectedPatient(item.patient); setShow(true) }}>Patient Info</button>
                                                            </td>
                                                            <td>
                                                                <EditStatus item={item} fetchData={fetchData} />
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

export default AdminBookingStatus