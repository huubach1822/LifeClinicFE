import "./ClinicDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faLocationDot, faCheck, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getDoctorByClinic } from "../../service/doctorService";
import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import _ from "lodash";
import React from "react";
import Slider from "react-slick";


const ClinicDetail = () => {

    // param from url
    let { id } = useParams();
    const navigate = useNavigate();
    // map
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9uc3Rlcnh5ejAyIiwiYSI6ImNsZnFtMWpyeTAwbjIzcm81OHZsam14NTYifQ.wL-EZFvgPDOvrF-JFVlWsA';
    const mapContainer = useRef(null);
    const [mapObject, setMap] = useState();

    const [clinicDetail, setClinic] = useState();

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 5000, // Set the interval for autoplay in milliseconds
    };

    useEffect(() => {
        const getData = async () => {
            let res = await getDoctorByClinic(id);
            setClinic(res.data.result);
        };
        getData();
        //map
        setMap(new mapboxgl.Map({
            container: mapContainer.current,
            zoom: 16,
        }));
    }, []);

    // map
    useEffect(() => {
        if (!_.isEmpty(clinicDetail)) {
            let cor = [clinicDetail.Longitude, clinicDetail.Latitude];
            // eslint-disable-next-line
            let marker = new mapboxgl.Marker({ color: "#EA4335" }).setLngLat(cor).addTo(mapObject);
            let nav = new mapboxgl.NavigationControl();
            mapObject.addControl(nav, 'top-right');
            mapObject.setCenter(cor)
            mapObject.once('load', () => {
                mapObject.resize();
            });
        }
    }, [mapObject, clinicDetail]);
    const openToMap = () => {
        let lat = clinicDetail.Latitude;
        let lng = clinicDetail.Longitude;
        window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`);
    }

    return (
        <div className="clinic-detail-container">
            <div class="styles_body__Z1vMj snipcss-BoMgp" style={{ marginTop: "0px" }}>
                <div class="styles_breadcrumb__aTA0J">
                    <div class="styles_container__pVb9x styles_containerPartner__pJy0t">
                        <ul class="styles_breadcrumbs__Lvmdm">
                            <div id="first"></div>
                            <li><Link to="/">Home Page</Link>&nbsp;</li>
                            <li class="undefined undefined styles_last__rM2K0"><span class="styles_text__KPG_r">&nbsp;
                                <FontAwesomeIcon icon={faAngleRight} />
                                &nbsp;<a>{clinicDetail?.Name}</a></span></li>
                            <div id="last"></div>
                        </ul>
                    </div>
                </div>
                <div class="styles_container__pVb9x styles_containerPartner__pJy0t">
                    <div class="styles_detailBooking__IKhXW">
                        <div class="styles_InfoWrapper__08ibK">
                            <div class="ant-row style-Hin1C" id="style-Hin1C">
                                <div class="ant-col styles_firstWraps__yz69B styles_item1__6gFAH ant-col-xs-24 ant-col-sm-24 ant-col-xl-8 style-PLg7s" id="style-PLg7s">
                                    <div class="styles_logo__CVabq"><span class="styles_imageLogo__bgDaA"><span id="style-J62PE" class="style-J62PE"><span id="style-tO5eP" class="style-tO5eP"></span><img alt="Trung tâm Y khoa Pasteur Đà Lạt" src={process.env.REACT_APP_BACKEND_URL + clinicDetail?.Logo} decoding="async" data-nimg="responsive" id="style-mWqFE" class="style-mWqFE" /></span></span>
                                        <h1 class="styles_name__Sfm52">{clinicDetail?.Name}</h1>
                                    </div>
                                    <hr class="styles_line__MSvA5" />
                                    <div class="styles_info__bPgwA">
                                        <div class="styles_infoItem__pzoQk">
                                            <div class="ant-space ant-space-horizontal ant-space-align-start style-9SNlC" id="style-9SNlC">
                                                <div class="ant-space-item">
                                                    <FontAwesomeIcon className="yellow-icon me-2" icon={faLocationDot} />
                                                </div>
                                                <div class="ant-space-item">
                                                    <h5>{clinicDetail?.Address}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="styles_infoItem__pzoQk">
                                            <div class="ant-space ant-space-horizontal ant-space-align-start style-T1sVv" id="style-T1sVv">
                                                <div class="ant-space-item">
                                                    <FontAwesomeIcon className="yellow-icon me-2" icon={faCheck} />
                                                </div>
                                                <div class="ant-space-item">
                                                    <h5>Certificate</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="styles_infoItem__pzoQk">
                                            <div class="ant-space ant-space-horizontal ant-space-align-start style-NRlpT" id="style-NRlpT">
                                                <div class="ant-space-item"><span class="styles_icon__4gn5u">
                                                    <FontAwesomeIcon className="yellow-icon" icon={faPhone} />
                                                </span></div>
                                                <div class="ant-space-item">
                                                    <h5>Contact Support: 1900 2024</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="styles_booking__OXHzc"><button onClick={() => navigate(`/bookPage/${clinicDetail.Name}/${clinicDetail.ID}`)} type="button" class="ant-btn ant-btn-default styles_btnAntd__zap7d styles_button__VIXVR"><span>Booking now</span></button></div>
                                    </div>
                                </div>
                                <div class="ant-col ant-col-order-1 styles_slider__vxxS1 styles_item2__a0jmf ant-col-xs-24 ant-col-sm-24 ant-col-xl-16 style-A37dK" id="style-A37dK">
                                    <div class="ant-carousel">
                                        <Slider {...settings}>
                                            {
                                                clinicDetail?.clinic_images?.map((item, index) => {
                                                    return (
                                                        <div style={{ width: '100%', height: '100%' }} key={index}>
                                                            <img style={{ width: '100%', height: '100%', objectFit: 'fill', maxHeight: '568px' }} src={process.env.REACT_APP_BACKEND_URL + item.Image} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Slider>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div class="ant-col styles_leftWrap__8ux_q styles_item6__tDIFt ant-col-xs-24 ant-col-sm-24 ant-col-xl-8 style-9kC6P" id="style-9kC6P">
                                        <div id="style-6m6QS" class="style-6m6QS">
                                            <div class="ant-row style-dOoCR" id="style-dOoCR">
                                                <div class="ant-col ant-col-24 styles_description__ODxNq style-d5oyQ" id="style-d5oyQ">
                                                    <h3>Description</h3>
                                                    <p>{clinicDetail?.Short_Description}</p>
                                                </div>
                                                <div class="ant-col ant-col-24 styles_map__esJi2 style-DIEgv" id="style-DIEgv">
                                                    <div ref={mapContainer} className="map-container mt-1">
                                                        <div className="container-open-map py-1 px-2">
                                                            <div>{clinicDetail?.Address}</div>
                                                            <div className="a-open-map" onClick={() => openToMap()}>View large map</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ant-col styles_secondWraps__Itq6y styles_item5__CDS5a ant-col-xs-24 ant-col-sm-24 ant-col-xl-16 style-17nxZ" id="style-17nxZ">
                                        <div class="styles_introduce__zng57 style-2di4W" id="style-2di4W">
                                            <div class="styles_paragraph__EDN_K" dangerouslySetInnerHTML={{ __html: clinicDetail?.Description }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="styles_booking__6i79z"> <button type="button" class="ant-btn ant-btn-default styles_btnAntd__zap7d"><span>Đặt khám ngay</span></button></div>
                </div>
            </div>
        </div>
    )
};

export default ClinicDetail;