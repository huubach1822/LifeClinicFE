import "./BookingHealthcare.scss";
import { faHospital, faCalendarDays, faStethoscope, faKitMedical, faDollarSign, faMapLocationDot, faAngleRight, faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import _ from 'lodash';
import { getHealthcareDetail } from "../../service/healthcareService";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers';
import { getAllTimeType, getHealthcareScheduleByDate } from "../../service/scheduleService";
import mapboxgl from 'mapbox-gl';
import dayjs from "dayjs";
import { toast } from "react-toastify";
import tempLogo from "../../asset/image/Healthcarepackage/tempLogo.webp";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';

const BookingHealthcare = () => {

    // react route
    const navigate = useNavigate();
    // param from url
    let { id } = useParams();
    // data
    const account = useSelector(state => state.accountSlice.account);
    const [healthcareDetail, setHealthcare] = useState()
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

    const [show, setShow] = useState(false);

    const [selectedServices, setSelectedServices] = useState([]);

    // Hàm xử lý sự kiện khi checkbox thay đổi
    const handleCheckboxChange = (service) => {
        // Check if the service is already selected
        const isSelected = selectedServices.some((selectedService) => selectedService.ID === service.ID);
        if (!isSelected) {
            // If not selected, add it to the array of selected services
            setSelectedServices([...selectedServices, service]);
        } else {
            // If already selected, remove it from the array of selected services
            const updatedServices = selectedServices.filter((selectedService) => selectedService.ID !== service.ID);
            setSelectedServices(updatedServices);
        }
    };

    // first render
    useEffect(() => {
        // call api
        const getData = async () => {
            const res = await getHealthcareDetail(id);
            // res.data.doctorDetail.Avatar = Buffer.from(res.data.doctorDetail.Avatar.data, 'binary').toString('base64');
            setHealthcare(res.data.healthcareDetail);
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
        if (!_.isEmpty(healthcareDetail)) {
            let cor = [healthcareDetail.clinic.Longitude, healthcareDetail.clinic.Latitude];
            // eslint-disable-next-line
            let marker = new mapboxgl.Marker({ color: "#EA4335" }).setLngLat(cor).addTo(mapObject);
            let nav = new mapboxgl.NavigationControl();
            mapObject.addControl(nav, 'top-right');
            mapObject.setCenter(cor)
            mapObject.once('load', () => {
                mapObject.resize();
            });
        }
    }, [mapObject, healthcareDetail]);
    const openToMap = () => {
        let lat = healthcareDetail.clinic.Latitude;
        let lng = healthcareDetail.clinic.Longitude;
        window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`);
    }

    // date time picker
    const isAvailableDate = (date) => {
        return !healthcareDetail.healthcareSchedule.includes(date.format('MM-DD-YYYY'))
    };
    const CustomDay = (props) => {
        let matchedStyles = {}
        if (healthcareDetail.healthcareSchedule.includes(props.day.format('MM-DD-YYYY'))) {
            matchedStyles = { border: "1px solid #1976d2" }
        }
        return <PickersDay {...props} sx={{ ...matchedStyles }} />;
    };
    const onChangeDTP = async (newValue) => {
        setSelectedDate(newValue)
        let res = await getHealthcareScheduleByDate(healthcareDetail.ID, newValue.format('MM-DD-YYYY'))
        setTimeSchedule(res.data.timeSchedule)
    }

    const [selectedSchedule, setSelectedSchedule] = useState({});
    // handle btn time
    const btnTime = (timeID) => {
        if (_.isEmpty(account)) {
            toast.error("Please login to book an appointment!");
        } else {
            // let selectedSchedule = timeSchedule.find((e) => e.time_type.ID === timeID)
            // navigate(`/selectPatient`, { state: { selectedSchedule: selectedSchedule, selectedHealthcare: healthcareDetail } })
            setSelectedSchedule(timeSchedule.find((e) => e.time_type.ID === timeID))
            setShow(true)
        }
    }

    const handleContinue = () => {
        setShow(false)
        navigate(`/selectPatient`, { state: { selectedSchedule: selectedSchedule, selectedHealthcare: healthcareDetail, selectedServices: selectedServices } })
    }

    const totalPrice = () => {
        let total = 0;
        total += healthcareDetail?.Price

        for (let i = 0; i < selectedServices.length; i++) {
            total += selectedServices[i]?.Price
        }

        return total
    }

    return (
        <div className="d-flex justify-content-center booking-healthcare-page">
            <div className="row bd-container my-3">
                <div className="bd-s0 mb-3">
                    <Link to="/" className="bd-s0-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="bd-s0-title ms-2">Book Healthcare Package</span>
                </div>
                <div className="col-4 bd-s1 pe-4">
                    <div className="bd-s1-container">
                        <div className="bd-s1-title">Healthcare Package Information</div>
                        <div className="bd-s1-info d-flex flex-column">
                            {!_.isEmpty(healthcareDetail) && (
                                <>
                                    <img alt="" className="mb-3" src={tempLogo}></img>
                                    <div className="bd-s1-name mb-3">{healthcareDetail.Name}</div>
                                    <div className="bd-s1-detail d-flex flex-column flex-fill">
                                        <div className="mb-1">
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faStethoscope} /></span>
                                            Type:
                                            <span > {healthcareDetail.healthcare_type.Name}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faDollarSign} /></span>
                                            Price:
                                            <span > {healthcareDetail.Price} VND</span>
                                            {
                                                healthcareDetail.Price !== healthcareDetail.MaxPrice &&
                                                <span > - {healthcareDetail.MaxPrice} VND</span>
                                            }
                                        </div>
                                        <div>
                                            <span className="bd-s1-icon"><FontAwesomeIcon icon={faHospital} /></span>
                                            <span>{healthcareDetail.clinic.Name}</span>
                                        </div>
                                        <div className="address-detail">
                                            {healthcareDetail.clinic.Address}
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
                                <FontAwesomeIcon className="fa-lg" icon={faHeartPulse} />
                            </div>
                            <div className="pe-2">
                                <div className="fw-bold mb-1 bd-s2-title">Description</div>
                                <div>{healthcareDetail?.Description}</div>
                            </div>
                        </div>

                        <div className="bd-s2-p0 d-flex flex-row mt-3">
                            <div className="me-3 bd-s2-icon">
                                <FontAwesomeIcon className="fa-lg" icon={faKitMedical} />
                            </div>
                            <div className="pe-2">
                                <div className="fw-bold mb-1 bd-s2-title">Healthcare Service</div>
                                <div className="bhc-service-list">
                                    <div className="sc-28344409-8 iUjGNd sc-35fb9387-2 gOQkbA snipcss0-2-2-3" style={{ marginBottom: "10px" }}>Package Includes</div>
                                    <ul class="sc-f32db17d-0 sc-f93c7f36-1 sc-35fb9387-0 cXEndW hVbvOn cBbpgv snipcss0-0-0-1 snipcss-6b61B">
                                        {
                                            healthcareDetail?.healthcare_services?.map((service, index) => {
                                                if (service.IsRequired === true || service.IsRequired === 1) {
                                                    return <li class="sc-35fb9387-1 iKxEJi snipcss0-1-1-2"><span font-size="regular" class="sc-28344409-8 iUjGNd sc-35fb9387-2 gOQkbA snipcss0-2-2-3">{service.Name}</span></li>
                                                }
                                                return <></>
                                            })
                                        }
                                    </ul>
                                    {
                                        healthcareDetail?.healthcare_services?.some((e) => {
                                            return e.IsRequired === false || e.IsRequired === 0
                                        }) &&
                                        <>
                                            <div className="sc-28344409-8 iUjGNd sc-35fb9387-2 gOQkbA snipcss0-2-2-3" style={{ marginBottom: "10px" }}>Optional</div>
                                            <ul class="sc-f32db17d-0 sc-f93c7f36-1 sc-35fb9387-0 cXEndW hVbvOn cBbpgv snipcss0-0-0-1 snipcss-6b61B">
                                                {
                                                    healthcareDetail?.healthcare_services?.map((service, index) => {
                                                        if (service.IsRequired === false || service.IsRequired === 0) {
                                                            return <li class="sc-35fb9387-1 iKxEJi snipcss0-1-1-2"><span font-size="regular" class="sc-28344409-8 iUjGNd sc-35fb9387-2 gOQkbA snipcss0-2-2-3">{service.Name} ({service.Price} VND)</span></li>
                                                        }
                                                        return <></>
                                                    })
                                                }
                                            </ul>
                                        </>
                                    }
                                </div>
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
                                            return <button onClick={() => btnTime(item.ID)} disabled={!timeSchedule?.some((e) => e.time_type.ID === item.ID)} key={index} type="button" className="btn btn-primary">{item.Value}</button>
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
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Book Healthcare Package
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Date: {selectedSchedule?.Date}</div>
                    <div>Time: {selectedSchedule?.time_type?.Value}</div>
                    <div>
                        <div className="sc-28344409-8 iUjGNd sc-35fb9387-2 gOQkbA snipcss0-2-2-3" style={{ marginBottom: "10px" }}>{healthcareDetail?.Name} includes</div>
                        <ul class="sc-f32db17d-0 sc-f93c7f36-1 sc-35fb9387-0 cXEndW hVbvOn cBbpgv snipcss0-0-0-1 snipcss-6b61B">
                            {
                                healthcareDetail?.healthcare_services?.map((service, index) => {
                                    if (service.IsRequired === true || service.IsRequired === 1) {
                                        return <li class="sc-35fb9387-1 iKxEJi snipcss0-1-1-2"><span font-size="regular" class="sc-28344409-8 iUjGNd sc-35fb9387-2 gOQkbA snipcss0-2-2-3">{service.Name}</span></li>
                                    }
                                    return <></>
                                })
                            }
                        </ul>
                    </div>
                    {
                        healthcareDetail?.healthcare_services?.some((e) => {
                            return e.IsRequired === false || e.IsRequired === 0
                        }) &&
                        <>
                            <div>
                                <div style={{ marginBottom: "10px" }} >
                                    Select optional services
                                </div>
                                <div style={{ marginLeft: "10px" }}>
                                    {healthcareDetail?.healthcare_services?.map((service, index) => {
                                        if (service.IsRequired === false || service.IsRequired === 0) {
                                            return <Form.Check
                                                key={index}
                                                type="checkbox"
                                                label={service.Name + " (" + service.Price + " VND)"} // Thay thế "label" bằng trường dữ liệu chứa nhãn của dịch vụ
                                                id={`service-checkbox-${index}`} // Đảm bảo ID là duy nhất
                                                onChange={() => handleCheckboxChange(service)} // Gọi hàm handleCheckboxChange khi checkbox thay đổi
                                            />
                                        }
                                    })}
                                </div>
                            </div>
                        </>
                    }
                    <div>Total: {
                        totalPrice()
                    } VND</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShow(false)}>Cancel</Button>
                    <Button onClick={() => handleContinue()}>Continue</Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default BookingHealthcare