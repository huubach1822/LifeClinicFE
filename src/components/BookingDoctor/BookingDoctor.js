import "./BookingDoctor.scss";
import { faVenusMars, faHospital, faCalendarDays, faGraduationCap, faStethoscope, faUserDoctor, faDollarSign, faMapLocationDot, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import _ from 'lodash';
import { getDoctorDetail } from "../../service/doctorService";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers';
import { getAllTimeType, getDoctorScheduleByDate } from "../../service/scheduleService";
import mapboxgl from 'mapbox-gl';
import dayjs from "dayjs";
import { toast } from "react-toastify";

const BookingDoctor = () => {

    // react route
    const navigate = useNavigate();
    // param from url
    let { id } = useParams();
    // data
    const account = useSelector(state => state.accountSlice.account);
    const [doctorDetail, setDoctor] = useState()
    const [timeSchedule, setTimeSchedule] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeType, setTimeType] = useState([]);
    // map
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9uc3Rlcnh5ejAyIiwiYSI6ImNsZnFtMWpyeTAwbjIzcm81OHZsam14NTYifQ.wL-EZFvgPDOvrF-JFVlWsA';
    const mapContainer = useRef(null);
    const [mapObject, setMap] = useState();
    // datetime picker
    const minDate = dayjs().add(1, 'day');
    const maxDate = dayjs().add(1, 'month').endOf('month');

    // first render
    useEffect(() => {
        // call api
        const getData = async () => {
            const res = await getDoctorDetail(id);
            setDoctor(res.data.doctorDetail);
            const res2 = await getAllTimeType();
            setTimeType(res2.data.timeType);
        };
        getData();
        //map
        setMap(new mapboxgl.Map({
            container: mapContainer.current,
            zoom: 16,
        }));
        // eslint-disable-next-line
    }, []);

    // map
    useEffect(() => {
        if (!_.isEmpty(doctorDetail)) {
            let cor = [doctorDetail.clinic.Longitude, doctorDetail.clinic.Latitude];
            // eslint-disable-next-line
            let marker = new mapboxgl.Marker({ color: "#EA4335" }).setLngLat(cor).addTo(mapObject);
            let nav = new mapboxgl.NavigationControl();
            mapObject.addControl(nav, 'top-right');
            mapObject.setCenter(cor)
            mapObject.once('load', () => {
                mapObject.resize();
            });
        }
    }, [mapObject, doctorDetail]);
    const openToMap = () => {
        let lat = doctorDetail.clinic.Latitude;
        let lng = doctorDetail.clinic.Longitude;
        window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`);
    }

    // date time picker
    const isAvailableDate = (date) => {
        return !doctorDetail.doctorSchedule.includes(date.format('MM-DD-YYYY'))
    };
    const CustomDay = (props) => {
        let matchedStyles = {}
        if (doctorDetail.doctorSchedule.includes(props.day.format('MM-DD-YYYY'))) {
            if (props.day.isAfter(dayjs())) {
                matchedStyles = { border: "1px solid #1976d2", backgroundColor: "#E0FFFF" }
            }
        }
        return <PickersDay {...props} sx={{ ...matchedStyles }} />;
    };
    const onChangeDTP = async (newValue) => {
        setSelectedDate(newValue)
        let res = await getDoctorScheduleByDate(doctorDetail.ID, newValue.format('MM-DD-YYYY'))
        setTimeSchedule(res.data.timeSchedule)
    }

    // handle btn time
    const btnTime = (timeID) => {
        if (_.isEmpty(account)) {
            toast.error("Please login to book an appointment!");
        } else {
            let selectedSchedule = timeSchedule.find((e) => e.time_type.ID === timeID)
            navigate(`/selectPatient`, { state: { selectedSchedule: selectedSchedule, selectedDoctor: doctorDetail } })
        }
    }

    return (
        <div className="d-flex justify-content-center booking-doctor-page">
            <div className="row bd-container my-3">
                <div className="bd-s0 mb-3">
                    <Link to="/" className="bd-s0-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="bd-s0-title ms-2">Book Doctor</span>
                </div>
                <div className="col-4 bd-s1 pe-4">
                    <div className="bd-s1-container">
                        <div className="bd-s1-title">Doctor Information</div>
                        <div className="bd-s1-info d-flex flex-column">
                            {!_.isEmpty(doctorDetail) && (
                                <>
                                    <img alt="" className="mb-3" src={process.env.REACT_APP_BACKEND_URL + doctorDetail?.Avatar}></img>
                                    <div className="bd-s1-name mb-3">{doctorDetail.Name}</div>
                                    <div className="bd-s1-detail d-flex flex-column flex-fill">
                                        <div className="mb-1">
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faVenusMars} /></span>
                                            Gender:
                                            <span> {doctorDetail.Gender}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faStethoscope} /></span>
                                            Speciality:
                                            <span > {doctorDetail.speciality.Name}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faGraduationCap} /></span>
                                            Degree:
                                            <span > {doctorDetail.degree.Name}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faDollarSign} /></span>
                                            Doctor Fee:
                                            <span > {doctorDetail.Price} VND</span>
                                        </div>
                                        <div>
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faHospital} /></span>
                                            <span>{doctorDetail.clinic.Name}</span>
                                        </div>
                                        <div className="address-detail">
                                            {doctorDetail.clinic.Address}
                                        </div>
                                    </div>
                                </>
                            )
                            }
                        </div>
                    </div>
                </div>
                <div className="col-8 bd-s2-container">
                    <div className="bd-s2 ms-3">

                        <div className="bd-s2-p0 d-flex flex-row">
                            <div className="me-3 bd-s2-icon">
                                <FontAwesomeIcon className="fa-lg" icon={faUserDoctor} />
                            </div>
                            <div className="pe-2">
                                <div className="fw-bold mb-1 bd-s2-title">Description</div>
                                <div>{doctorDetail?.Description}</div>
                            </div>
                        </div>

                        <div className="bd-s2-p1 d-flex mt-3">
                            <div className="me-3 bd-s2-icon">
                                <FontAwesomeIcon className="fa-lg" icon={faCalendarDays} />
                            </div>
                            <div className="flex-fill pe-2">
                                <div className="bd-s2-title fw-bold"> Appointment Schedule</div>
                                <div className="mt-3">
                                    <div className="d-flex align-items-center gap-3">
                                        Select Date:
                                        <DatePicker
                                            value={selectedDate}
                                            onChange={onChangeDTP}
                                            slotProps={{ textField: { size: 'small' } }}
                                            slots={{ day: CustomDay }}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            format="MM-DD-YYYY"
                                            shouldDisableDate={isAvailableDate}
                                            disableHighlightToday={true}
                                        />
                                    </div>
                                    <div className="time-btn-container mt-4">
                                        {timeType?.map((item, index) => {
                                            return <button onClick={() => btnTime(item.ID)} disabled={!timeSchedule?.some((e) => e.time_type.ID === item.ID)} key={index} type="button" className={"btn " + (!timeSchedule?.some((e) => e.time_type.ID === item.ID) ? "btn-secondary" : "btn-primary")}>{item.Value}</button>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bd-s2-p2 d-flex flex-column mt-3">
                            <div className="mb-2">
                                <span className="me-3 bd-s2-icon">
                                    <FontAwesomeIcon className="fa-lg" icon={faMapLocationDot} />
                                </span>
                                <span className="bd-s2-title fw-bold">Location</span>
                            </div>
                            <div ref={mapContainer} className="map-container mt-1">
                                <div className="container-open-map py-1 px-2">
                                    <div className="a-open-map" onClick={() => openToMap()}>View large map</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default BookingDoctor