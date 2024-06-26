import banner1 from '../../asset/image/HomePage/homepage-banner.webp'
import "./HomePage.scss"
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import hospitalIcon from '../../asset/image/HomePage/hospital.webp'
import doctorIcon from '../../asset/image/HomePage/doctor.webp'
import vaccinIcon from '../../asset/image/HomePage/vaccin.webp'
import medicalTestIcon from '../../asset/image/HomePage/medical-test.webp'
import inHomeCareIcon from '../../asset/image/HomePage/in-home-care.webp'
import healthCheckupIcon from '../../asset/image/HomePage/health-checkup.webp'
import Logo2 from '../../asset/image/HomePage/logo-word.png'
import ImgCard1 from '../../asset/image/HomePage/card-img-1.webp'
import ImgCard2 from '../../asset/image/HomePage/card-img-2.webp'
import ImgCard3 from '../../asset/image/HomePage/card-img-3.webp'
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import medicalExamination from '../../asset/image/HomePage/medicalExamination.webp'
import hospitalStats from '../../asset/image/HomePage/hospitalStats.webp'
import healthcareService from '../../asset/image/HomePage/healthcareService.webp'
import doctorStats from '../../asset/image/HomePage/doctorStats.webp'
import userPerMonth from '../../asset/image/HomePage/userPerMonth.webp'
import userPerDay from '../../asset/image/HomePage/userPerDay.webp'
import banner2 from '../../asset/image/HomePage/banner-2.png'
import Slider from "react-slick";
import { useEffect, useState, useRef } from 'react';
import { getAllClinics } from '../../service/clinicService'
import { searchAll } from '../../service/clinicService'
import _ from 'lodash'
import tempLogo from "../../asset/image/Healthcarepackage/tempLogo.webp";
import { useNavigate } from 'react-router-dom'

const HomePage = () => {


    const [searchString, setSearchString] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();
    const [focus, setFocus] = useState(false);
    var ignoreBlur = false;

    useEffect(() => {
        const fetchData = async () => {
            var res = await searchAll(searchString)
            setSearchResult(res.data.data)
        }
        fetchData()
    }, [searchString]);

    // slider
    function SliderArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block" }}
                onClick={onClick}
            />
        );
    };
    var settings = {
        infinite: true,
        dots: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <SliderArrow />,
        prevArrow: <SliderArrow />
    };

    // call api
    const [clinics, setClinic] = useState()
    useEffect(() => {
        const fetchData = async () => {
            var res = await getAllClinics()
            var temp = res.data.clinics
            setClinic(temp)
        }
        fetchData()
    }, []);


    const [divVisible, setDivVisible] = useState(false);
    const inputRef = useRef(null);
    const divRef = useRef(null);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchString(value);
        if (value.length > 0) {
            setDivVisible(true);
        } else {
            setDivVisible(false);
        }
    };

    const handleMouseDownOutside = (event) => {
        if (
            inputRef.current && !inputRef.current.contains(event.target) &&
            divRef.current && !divRef.current.contains(event.target)
        ) {
            setDivVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDownOutside);
        return () => {
            document.removeEventListener('mousedown', handleMouseDownOutside);
        };
    }, []);

    const handleInputFocus = () => {
        if (searchString.length > 0) {
            setDivVisible(true);
        }
    };


    return (
        <div className="home-page-container">
            <div className="section-1 d-flex flex-column" style={{ backgroundImage: `url("${banner1}")` }}>
                <div className="section-1-part-1 d-flex flex-column align-items-center">
                    <div className='s-p-tilte-1 mb-2'>Technology platform</div>
                    <div className='s-p-tilte-2 mb-3'>Connecting People with Facilities - Healthcare Services</div>
                    <div className="form-group has-search">
                        <span className="form-control-feedback"><FontAwesomeIcon icon={faSearch} /></span>
                        <input ref={inputRef} value={searchString} onChange={handleInputChange} onFocus={handleInputFocus} type="text" className="form-control" placeholder="" />
                        {
                            divVisible &&
                            <div ref={divRef} className='search-all search-all-drop'>
                                <div className="search-all-container">
                                    <div className='search-all-title d-flex justify-content-between'>
                                        <div>
                                            Medical Facility
                                        </div>
                                        <div className='search-all-view'
                                            onClick={() => navigate(`/medicalFacility`, { state: { searchString: searchString } })}
                                        >
                                            View all
                                            <FontAwesomeIcon className='ms-2' icon={faArrowRight} />
                                        </div>
                                    </div>
                                    {
                                        !_.isEmpty(searchResult?.clinics) ?
                                            searchResult?.clinics?.map((item) => {
                                                return (
                                                    <div
                                                        onClick={() => navigate(`/clinicDetail/${item.ID}`)}
                                                        style={{ borderBottom: "2px solid #DBE1E7" }} className='result-container d-flex px-3 py-2 align-items-center gap-3'>
                                                        <img style={{ width: "40px", height: "40px", borderRadius: "50%" }} src={process.env.REACT_APP_BACKEND_URL + item?.Logo}></img>
                                                        <div>
                                                            <div className='search-all-name'>{item.Name}</div>
                                                            <div className='search-all-address'>{item.Address}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className='d-flex px-3 py-3 align-items-center gap-3'>
                                                No result
                                            </div>
                                    }
                                    <div className='search-all-title d-flex justify-content-between'>
                                        <div>
                                            Doctor
                                        </div>
                                        <div className='search-all-view'
                                            onClick={() => navigate(`/doctor`, { state: { searchString: searchString } })}
                                        >
                                            View all
                                            <FontAwesomeIcon className='ms-2' icon={faArrowRight} />
                                        </div>
                                    </div>
                                    {
                                        !_.isEmpty(searchResult?.doctors) ?
                                            searchResult?.doctors?.map((item) => {
                                                return (
                                                    <div
                                                        onClick={() => navigate(`/bookingDoctor/${item.ID}`)}
                                                        style={{ borderBottom: "2px solid #DBE1E7" }} className='result-container d-flex px-3 py-2 align-items-center gap-3'>
                                                        <img style={{ width: "40px", height: "40px", borderRadius: "50%" }} src={process.env.REACT_APP_BACKEND_URL + item?.Avatar}></img>
                                                        <div>
                                                            <div className='search-all-name'>{item.Name} - {item.speciality.Name}</div>
                                                            <div className='search-all-address'>{item.clinic.Address}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className='d-flex px-3 py-3 align-items-center gap-3'>
                                                No result
                                            </div>
                                    }
                                    <div className='search-all-title d-flex justify-content-between'>
                                        <div>
                                            Healthcare Package
                                        </div>
                                        <div className='search-all-view'
                                            onClick={() => navigate(`/healthcareService`, { state: { searchString: searchString } })}
                                        >
                                            View all
                                            <FontAwesomeIcon className='ms-2' icon={faArrowRight} />
                                        </div>
                                    </div>
                                    {
                                        !_.isEmpty(searchResult?.healthcarePackages) ?
                                            searchResult?.healthcarePackages?.map((item) => {
                                                return (
                                                    <div
                                                        onClick={() => navigate(`/bookingHealthcare/${item.ID}`)}
                                                        style={{ borderBottom: "2px solid #DBE1E7" }} className='result-container d-flex px-3 py-2 align-items-center gap-3'>
                                                        <img style={{ width: "40px", height: "40px", borderRadius: "50%" }} src={tempLogo}></img>
                                                        <div>
                                                            <div className='search-all-name'>{item.Name}</div>
                                                            <div className='search-all-address'>{item.clinic.Address}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className='d-flex px-3 py-3 align-items-center gap-3'>
                                                No result
                                            </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <div className='s-p-tilte-3'>Find the Right Doctor - Easy Appointment Booking - Team of Experts</div>
                </div>
                <div className="section-1-part-2 d-flex gap-4 mt-3">
                    <div className='section-1-card' onClick={() => navigate('/doctor')}>
                        <div className='s-1-card-container d-flex flex-column align-items-center'>
                            <img alt="" src={doctorIcon}></img>
                            <div className='mt-2'>Book a doctor's appointment</div>
                        </div>
                    </div>
                    <div className='section-1-card' onClick={() => navigate('/medicalFacility')}>
                        <div className='s-1-card-container d-flex flex-column align-items-center'>
                            <img alt="" src={hospitalIcon}></img>
                            <div className='mt-2'>Schedule a hospital visit</div>
                        </div>
                    </div>
                    <div className='section-1-card' onClick={() => navigate('/healthcareService', { state: { type: 1 } })}>
                        <div className='s-1-card-container d-flex flex-column align-items-center'>
                            <img alt="" src={healthCheckupIcon}></img>
                            <div className='mt-2'>Health Checkup Package</div>
                        </div>
                    </div>
                    <div className='section-1-card' onClick={() => navigate('/healthcareService', { state: { type: 2 } })}>
                        <div className='s-1-card-container d-flex flex-column align-items-center'>
                            <img alt="" src={medicalTestIcon}></img>
                            <div className='mt-2'>Schedule a medical test</div>
                        </div>
                    </div>
                    <div className='section-1-card' onClick={() => navigate('/healthcareService', { state: { type: 3 } })}>
                        <div className='s-1-card-container d-flex flex-column align-items-center'>
                            <img alt="" src={vaccinIcon}></img>
                            <div className='mt-2'>Register for vaccination</div>
                        </div>
                    </div>
                    <div className='section-1-card' onClick={() => navigate('/healthcareService', { state: { type: 4 } })}>
                        <div className='s-1-card-container d-flex flex-column align-items-center'>
                            <img alt="" src={inHomeCareIcon}></img>
                            <div className='mt-2'>In-Home Medical Care</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section-2'>
                <div className='section-2-container d-flex flex-column'>
                    <div className='d-flex flex-row'>
                        <div className='section-2-logo me-5 d-flex flex-column justify-content-center'>
                            <img alt="" className='s-2-logo mb-2' src={Logo2}></img>
                            <div className='s-2-underlogo'>Quick Appointment</div>
                        </div>
                        <div className='section-2-info ms-5' style={{ textAlign: "justify", textJustify: "inter-word" }}>
                            <span className='fw-bold'>LifeClinic</span> provides an online appointment booking service for medical examination and healthcare at leading hospitals in Vietnam, such as University of Medicine and Pharmacy Hospital, Cho Ray Hospital and Nhi Dong Hospital, helping users to choose services and doctors according to their needs.
                        </div>
                    </div>
                    <div className="d-flex mt-5 justify-content-between">
                        <div className="section-2-card">
                            <img alt="" src={ImgCard3} ></img>
                            <div className="s-2-title">Your time is invaluable</div>
                            <div className="s-2-description">Patients actively choose appointment information (appointment date and time)</div>
                            <button type="button" className="btn btn-primary" onClick={() => navigate('/doctor')}>Book now <FontAwesomeIcon icon={faArrowRight} className="ms-2" /></button>
                        </div>
                        <div className="section-2-card">
                            <img alt="" src={ImgCard2} ></img>
                            <div className="s-2-title">Cooperative Alliance</div>
                            <div className="s-2-description">A comprehensive network of healthcare facilities covering the entire country.</div>
                            <button type="button" className="btn btn-primary" onClick={() => navigate('/medicalFacility')}>Book now <FontAwesomeIcon icon={faArrowRight} className="ms-2" /></button>
                        </div>
                        <div className="section-2-card">
                            <img alt="" src={ImgCard1} ></img>
                            <div className="s-2-title">Building health for everyone</div>
                            <div className="s-2-description">Inclusive healthcare package: preventive care, diagnostics, treatments, affordability.</div>
                            <button type="button" className="btn btn-primary" onClick={() => navigate('/healthcareService')}>Book now <FontAwesomeIcon icon={faArrowRight} className="ms-2" /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-3">
                <div className="section-3-container">
                    <div className="section-3-content">
                        <div className="s-3-title mb-5">Statistical analysis</div>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="s-3-card">
                                <img alt="" className="s-3-icon" src={medicalExamination}></img>
                                <div className="s-3-number mt-3">2.2M+</div>
                                <div className="s-3-name">Medical examination</div>
                            </div>
                            <div className="s-3-card">
                                <img alt="" className="s-3-icon" src={hospitalStats}></img>
                                <div className="s-3-number mt-3">40+</div>
                                <div className="s-3-name">Medical facility</div>
                            </div>
                            <div className="s-3-card">
                                <img alt="" className="s-3-icon" src={healthcareService}></img>
                                <div className="s-3-number mt-3">50+</div>
                                <div className="s-3-name">Healthcare service</div>
                            </div>
                            <div className="s-3-card">
                                <img alt="" className="s-3-icon" src={doctorStats}></img>
                                <div className="s-3-number mt-3">1000+</div>
                                <div className="s-3-name">Doctor</div>
                            </div>
                            <div className="s-3-card">
                                <img alt="" className="s-3-icon" src={userPerMonth}></img>
                                <div className="s-3-number mt-3">138K+</div>
                                <div className="s-3-name">User per month</div>
                            </div>
                            <div className="s-3-card">
                                <img alt="" className="s-3-icon" src={userPerDay}></img>
                                <div className="s-3-number mt-3">4600+</div>
                                <div className="s-3-name">User per day</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="section-4 pt-5">
                <div className="s-4-title-1">Well-known hospital</div>
                <div className="s-4-title-2">Book an appointment with over 50 hospitals nationwide</div>
                <div className="slider-container py-4">
                    <Slider {...settings}>
                        {clinics?.map((item, index) => {
                            return (
                                <div className="s-4-card" key={item.ID} onClick={() => navigate(`/clinicDetail/${item.ID}`)}>
                                    <img className="s-4-img" alt="" src={process.env.REACT_APP_BACKEND_URL + item?.Logo}></img>
                                    <div className="s-4-name">{item.Name}</div>
                                    <div className="s-4-address">{item.Address}</div>
                                </div>
                            )
                        })}
                    </Slider>
                </div>
            </div>
            <div className="section-5" style={{ backgroundImage: `url("${banner2}")` }}>
                <div className="s-5-container">
                    <div className="s-5-title mb-3">Many Clinics and Services Available</div>
                    <div className="s-5-description mb-3">Patients actively choose quick appointment information (date, time and medical facility). Schedule an appointment without waiting.</div>
                    <button type="button" className="s-5-button btn btn-primary" onClick={() => navigate('/medicalFacility')}>Book now</button>
                </div>
            </div>
        </div >
    )
}

export default HomePage;