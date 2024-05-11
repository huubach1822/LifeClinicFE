import "./MedicalFacility.scss";
import React, { useRef, useEffect, useState } from 'react';
import { faAngleRight, faSearch, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getAllClinicsPagination } from "../../service/clinicService";
import mapboxgl from 'mapbox-gl';
import ReactReadMoreReadLess from "react-read-more-read-less";
import 'mapbox-gl/dist/mapbox-gl.css';
import _ from "lodash"
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from '@mui/material/Pagination';
import { getAllCity } from "../../service/categoryService";
import EmptyList from "../../asset/image/EmptyList.webp"
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';

const MedicalFacility = () => {

    const location = useLocation();
    const data = location.state;

    // map
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9uc3Rlcnh5ejAyIiwiYSI6ImNsZnFtMWpyeTAwbjIzcm81OHZsam14NTYifQ.wL-EZFvgPDOvrF-JFVlWsA';
    const mapContainer = useRef(null);
    const [mapObject, setMap] = useState();
    const [marker, setMarker] = useState();
    // data
    const [selectedClinic, setSelectedClinic] = useState();
    const [clinics, setClinic] = useState([])
    const [city, setCity] = useState()
    // pagination
    const [totalPage, setTotalPage] = useState(1);
    // loading
    const [loading, setLoading] = useState(true);
    // search and filter
    const [queryObject, setQueryObject] = useState({
        location: "",
        queryString: "",
        page: 1
    });

    // map
    const openToMap = () => {
        let lat = selectedClinic.Latitude;
        let lng = selectedClinic.Longitude;
        window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`);
    }
    useEffect(() => {
        if (!_.isEmpty(selectedClinic)) {
            let cor = [selectedClinic.Longitude, selectedClinic.Latitude]
            if (!_.isEmpty(marker)) {
                marker.remove();
            }
            setMarker(new mapboxgl.Marker({ color: "#EA4335" }).setLngLat(cor).addTo(mapObject));
            mapObject.setCenter(cor)
            mapObject.once('load', () => {
                mapObject.resize();
            });
        }
        // eslint-disable-next-line
    }, [selectedClinic])

    // first render
    useEffect(() => {
        const fetchCity = async () => {
            let res = await getAllCity()
            setCity(res.data.city)
        }
        fetchCity()
        setMap(new mapboxgl.Map({
            container: mapContainer.current,
            // style: 'mapbox://styles/mapbox/streets-v12',
            zoom: 16,
            dragPan: false,
            scrollZoom: false,
            boxZoom: false,
            doubleClickZoom: false
        }));
        if (!_.isEmpty(data?.searchString)) {
            setQueryObject({
                ...queryObject,
                queryString: data.searchString
            })
        } else {
            let timerId = fetchData(queryObject)
            return () => clearTimeout(timerId);
        }
        // eslint-disable-next-line
    }, []);

    // call api
    const fetchData = async (obj) => {
        setLoading(true);
        let res = await getAllClinicsPagination(obj.page, obj.queryString, obj.location)
        let temp = res.data.data.result
        setTotalPage(res.data.data.totalPages)
        setClinic(temp)
        setSelectedClinic(temp[0])
        let timerId = setTimeout(() => {
            setLoading(false)
        }, 500);
        return timerId
    }

    // search and filter change
    const selectChange = (event) => {
        setQueryObject({
            ...queryObject,
            location: event.target.value,
            page: 1
        })
    };
    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };
    const inputChange = (event) => {
        setQueryObject({
            ...queryObject,
            queryString: event.target.value,
            page: 1
        })
    }
    useEffect(() => {
        let timerId = fetchData(queryObject)
        window.scrollTo(0, 0);
        return () => clearTimeout(timerId);
    }, [queryObject])

    return (
        <div>
            <div className="mf-section-1">
                <div className="mf-s1-p1 mt-3">
                    <Link to="/" className="mf-s1-p1-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="mf-s1-p1-mf ms-2">Medical Facility</span>
                </div>
                <div className="mf-s1-p2 d-flex flex-column align-items-center pb-5">
                    <div className="mf-s1-p2-title">Medical Facility</div>
                    <div className="mf-s1-p2-description">Access to leading healthcare facilities will enhance your medical examination and treatment experience.</div>
                    <div className="form-group has-search mt-4 mb-4 d-flex flex-row">
                        <span className="form-control-feedback"><FontAwesomeIcon icon={faSearch} /></span>
                        <input value={queryObject.queryString} onChange={inputChange} type="text" className="form-control" placeholder="Find a Medical Facility" />
                        <div className="search-line-icon"></div>
                        <FormControl sx={{ width: "170px", height: "50px" }}>
                            <Select
                                value={queryObject.location}
                                onChange={selectChange}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                renderValue={queryObject.location !== "" ? undefined : () => <span className="placeholder-text"><FontAwesomeIcon icon={faLocationDot} className="me-2" />Location</span>}
                            >
                                <MenuItem value={""}>All Location</MenuItem>
                                {city?.map((item, index) => {
                                    return (
                                        <MenuItem key={item.ID} value={item.ID}>{item.Name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className="mf-section-2" style={!_.isEmpty(clinics) && !loading ? { display: "block" } : { display: "none" }}>
                <div className="mf-s2-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-7 mt-4">
                                {clinics?.map((item, index) => {
                                    return (
                                        <div className="mf-s2-card d-flex mb-4 px-4 py-4" key={item.ID} onClick={() => setSelectedClinic(item)} >
                                            <img alt="" className="mf-s2-img" src={process.env.REACT_APP_BACKEND_URL + item?.Logo}></img>
                                            <div className="flex-fill ms-3">
                                                <div className="mf-s2-name">{item.Name}</div>
                                                <div className="mf-s2-address"><FontAwesomeIcon icon={faLocationDot} className="me-1" /> {item.Address}</div>
                                                <Link to={`/bookPage/${item.Name}/${item.ID}`} type="button" className="mf-s2-button btn">Book now</Link>
                                                <Link to={`/clinicDetail/${item.ID}`} type="button" className="ms-2 mf-s2-button btn-detail btn">Detail Info</Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="col-5 mt-4 position-relative pb-4">
                                <div className="mf-s2-sidecontent py-3">
                                    {!_.isEmpty(selectedClinic) &&
                                        <>
                                            <img alt="" className="mf-s2-sc-img mb-3" src={process.env.REACT_APP_BACKEND_URL + selectedClinic?.Logo}></img>
                                            <div className="mf-s2-sc-name">{selectedClinic.Name}</div>
                                            <div className="mf-s2-sc-address mb-3">{selectedClinic.Address}</div>
                                            <div className="mf-s2-sc-address temp-description pt-2 mb-3">
                                                <ReactReadMoreReadLess
                                                    charLimit={209}
                                                    readMoreText={"View more ▼"}
                                                    readLessText={"View less ▲"}
                                                    readMoreClassName={"more-less-btn"}
                                                    readLessClassName={"more-less-btn"}
                                                >
                                                    {selectedClinic.Short_Description}
                                                </ReactReadMoreReadLess>
                                            </div>
                                        </>
                                    }
                                    <div ref={mapContainer} className="map-container">
                                        <div className="container-open-map py-1 px-2">
                                            <div className="a-open-map" onClick={() => openToMap()}>View large map</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mf-pagination d-flex justify-content-center pb-3">
                            <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                        </div>
                    </div>
                </div>
            </div>
            {_.isEmpty(clinics) && !loading &&
                <>
                    <div className="mf-section-3 d-flex justify-content-center flex-column align-items-center py-5">
                        <div className="mf-s3-warning mb-4">We couldn’t find what you were looking for</div>
                        <img className="mf-s3-img" alt="" src={EmptyList}></img>
                    </div>
                </>
            }
            {loading &&
                <div className="mf-section-3 d-flex justify-content-center py-5">
                    <CircularProgress />
                </div>
            }
        </div >
    )
}

export default MedicalFacility;