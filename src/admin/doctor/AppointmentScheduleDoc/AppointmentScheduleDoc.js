import "./AppointmentScheduleDoc.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from "react";
import AnAppointment from "./AnAppointment/AnAppointment";
import MultiAppointment from "./MultiAppointment/MultiAppointment";
import EditMaxPatient from "./EditMaxPatient"
import { Table } from "react-bootstrap";
import { getScheduleForDoctor } from "../../../service/scheduleService";
import { useSelector } from "react-redux"
import Pagination from '@mui/material/Pagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers';
import { getDoctorDetail } from "../../../service/doctorService";
import _ from 'lodash'
import dayjs from 'dayjs';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import { deleteSchedule } from "../../../service/scheduleService";
import { useNavigate } from 'react-router-dom';

const AppointmentScheduleDoc = () => {

    const [value, setValue] = useState('1');
    const [schedule, setSchedule] = useState([]);
    const account = useSelector(state => state.accountSlice.account)
    console.log(account)
    // pagination
    const [totalPage, setTotalPage] = useState(1);
    const [queryObject, setQueryObject] = useState({
        date: null,
        page: 1,
    });
    const [doctorDetail, setDoctor] = useState()
    const maxDate = dayjs().add(2, 'month').endOf('month');
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let fetchData = async (obj) => {
        let res = await getScheduleForDoctor(account.doctors[0].ID, _.isEmpty(obj.date) ? "" : obj.date.format('MM-DD-YYYY'), obj.page);
        let res2 = await getDoctorDetail(account.doctors[0].ID);
        setDoctor(res2.data.doctorDetail);
        setSchedule(res.data.data.result);
        setTotalPage(res.data.data.totalPages)
    }

    useEffect(() => {
        fetchData(queryObject);
        // eslint-disable-next-line
    }, [])

    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };

    useEffect(() => {
        fetchData(queryObject)
        // eslint-disable-next-line
    }, [queryObject])

    const CustomDay = (props) => {
        let matchedStyles = {}
        if (doctorDetail.doctorSchedule.includes(props.day.format('MM-DD-YYYY'))) {
            matchedStyles = { border: "1px solid #1976d2", backgroundColor: "#E0FFFF" }
        }
        return <PickersDay {...props} sx={{ ...matchedStyles }} />;
    };
    const isAvailableDate = (date) => {
        return !doctorDetail.doctorSchedule.includes(date.format('MM-DD-YYYY'))
    };

    const onChangeDTP = async (newValue) => {
        setQueryObject({
            ...queryObject,
            date: newValue
        })
    }

    const deleteBtn = async (id) => {
        Swal.fire({
            title: "Are you sure you want to delete?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSchedule(id).then((result) => {
                    fetchData(queryObject);
                    if (result.data.code === 0) {
                        toast.success(result.data.message)
                    } else {
                        toast.error(result.data.message)
                    }
                })
            } else if (result.isDenied) {

            }
        });
    }

    return (
        <div className="doc-appointment">

            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Appointment Schedule</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Appointment Schedule</span>
                    </div>

                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <TabContext value={value} >
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                                                <Tab label="Create an appointment" value="1" />
                                                <Tab label="Create multiple appointments " value="2" />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <AnAppointment fetchData={fetchData} queryObject={queryObject} />
                                        </TabPanel>
                                        <TabPanel value="2">
                                            <MultiAppointment fetchData={fetchData} queryObject={queryObject} />
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="da-container p-2 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="as-title">Appointment List</div>
                                            <div className="d-flex gap-4 align-items-center">
                                                <div>Select Date</div>
                                                <DatePicker
                                                    value={queryObject.date}
                                                    onChange={onChangeDTP}
                                                    slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
                                                    slots={{ day: CustomDay }}
                                                    format="MM-DD-YYYY"
                                                    shouldDisableDate={isAvailableDate}
                                                    disableHighlightToday={true}
                                                    maxDate={maxDate}
                                                />
                                            </div>
                                        </div>
                                        <div className='as-table'>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Current Patient</th>
                                                        <th>Maximum Patient </th>
                                                        <th>Booking Information</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {schedule?.map((item, index) => {
                                                        return (
                                                            <tr key={`schedule${item.ID}`}>
                                                                <td>
                                                                    {item.ID}
                                                                </td>
                                                                <td>
                                                                    {item.Date}
                                                                </td>
                                                                <td>
                                                                    {item.time_type.Value}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {item.Current_number}
                                                                </td>
                                                                <td className="edit-input">
                                                                    <EditMaxPatient obj={queryObject} fetchData={fetchData} item={item} />
                                                                </td>
                                                                <td>
                                                                    {item.bookings.map((booking, index) => {
                                                                        return (
                                                                            <div key={`booking${booking.ID}`}>
                                                                                <div>Patient: {booking.patient?.Name} - Status: {booking.Status}</div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {!_.isEmpty(item.bookings) &&
                                                                        <button className="btn btn-primary mt-1" onClick={() => { navigate(`/admin/bookingStatus`, { state: { date: item.Date, time: item.time_type.ID } }) }}>Detail</button>
                                                                    }

                                                                </td>
                                                                <td>
                                                                    <div className="d-flex flex-column gap-3">
                                                                        <button onClick={() => deleteBtn(item.ID)} disabled={item.Current_number > 0} className="btn btn-danger">Delete</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center p-2">
                                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default AppointmentScheduleDoc