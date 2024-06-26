import "./HealthcarePackage.scss";
import tempLogo from "../../asset/image/Healthcarepackage/tempLogo.webp";
import { useEffect, useState } from 'react';
import { faAngleRight, faSearch, faKitMedical, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getAllHealthcarePagination } from "../../service/healthcareService";
import _ from 'lodash';
import { getAllCity, getAllHealthcareType } from "../../service/categoryService";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EmptyList from "../../asset/image/EmptyList.webp"
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useLocation } from 'react-router-dom';

const MedicalFacility = () => {

    const location = useLocation();
    const data = location.state;

    // data
    const [healthcare, setHealthcare] = useState();
    const [city, setCity] = useState();
    const [healthcareTypeList, setHealthcareTypeList] = useState();
    // pagination
    const [totalPage, setTotalPage] = useState(1);
    // loading
    const [loading, setLoading] = useState(true);
    // search and filter
    const [queryObject, setQueryObject] = useState({
        location: "",
        queryString: "",
        page: 1,
        idType: "",
        priceOrder: ""
    });

    // first render
    useEffect(() => {
        const fetchCategory = async () => {
            let res = await getAllCity()
            setCity(res.data.city)
            let res2 = await getAllHealthcareType()
            setHealthcareTypeList(res2.data.healthcareType)
        }
        fetchCategory()

        if (data?.searchString != null || data?.type != null) {
            setQueryObject({
                ...queryObject,
                queryString: data?.searchString == null ? "" : data?.searchString,
                idType: data?.type == null ? "" : data?.type
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
        var res = await getAllHealthcarePagination(obj.page, obj.queryString, obj.location, obj.idType, obj.priceOrder);
        setHealthcare(res.data.data.result);
        setTotalPage(res.data.data.totalPages)
        let timerId = setTimeout(() => {
            setLoading(false)
        }, 500);
        return timerId
    }

    // search and filter change
    const onInputChange = e => {
        const { name, value } = e.target;
        setQueryObject(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    }
    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };
    useEffect(() => {

        if (!_.isEmpty(data?.searchString)) {
            data.searchString = "";
            return
        }

        let timerId = fetchData(queryObject)
        window.scrollTo(0, 0);
        return () => clearTimeout(timerId);
    }, [queryObject])


    return (
        <div>
            <div className="hc-section-1">
                <div className="hc-s1-p1 mt-3">
                    <Link to="/" className="hc-s1-p1-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="hc-s1-p1-doc ms-2">Healthcare Package</span>
                </div>
                <div className="hc-s1-p2 d-flex flex-column align-items-center pb-5">
                    <div className="hc-s1-p2-title">Healthcare Package</div>
                    <div className="hc-s1-p2-description">Diverse Health Check-up Packages at Reputable Medical Facilities to Meet All Public Needs.</div>
                    <div className="form-group has-search mt-4 mb-4 d-flex flex-row">
                        <span className="form-control-feedback"><FontAwesomeIcon icon={faSearch} /></span>
                        <input value={queryObject.queryString} name="queryString" onChange={onInputChange} type="text" className="form-control" placeholder="Find a Healthcare Package" />
                        <div className="search-line-icon"></div>
                        <FormControl sx={{ width: "170px", height: "50px" }}>
                            <Select
                                value={queryObject.location}
                                onChange={onInputChange}
                                displayEmpty
                                name="location"
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
            <div className="hc-category pb-1">
                <div className="hc-category-container d-flex flex-row justify-content-end gap-4">
                    <div className="hc-category-select d-flex flex-row align-items-center gap-2">
                        <div className="hc-category-title">Healthcare Type</div>
                        <FormControl size="small">
                            <Select
                                value={queryObject.idType}
                                name="idType"
                                onChange={onInputChange}
                                displayEmpty
                                defaultValue={""}
                                sx={{ width: 175, backgroundColor: "white", boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: "1px solid #D9D9D9 !important" } }}
                            >
                                <MenuItem value={""} >All Type</MenuItem>
                                {!_.isEmpty(healthcareTypeList) && healthcareTypeList.map((item, index) => {
                                    return <MenuItem key={index} value={item.ID}>{item.Name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="hc-category-select d-flex flex-row align-items-center gap-2">
                        <div className="hc-category-title">Price</div>
                        <FormControl size="small">
                            <Select
                                value={queryObject.priceOrder}
                                name="priceOrder"
                                onChange={onInputChange}
                                displayEmpty
                                defaultValue={""}
                                sx={{ width: 175, backgroundColor: "white", boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: "1px solid #D9D9D9 !important" } }}
                            >
                                <MenuItem value={""} >Default</MenuItem>
                                <MenuItem value={"ASC"} >Low to High</MenuItem>
                                <MenuItem value={"DESC"} >High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className="hc-section-2" style={!_.isEmpty(healthcare) && !loading ? { display: "block" } : { display: "none" }}>
                <div className="hc-s2-container d-flex flex-column">
                    <div className="row">
                        {healthcare?.map((item, index) => {
                            return (
                                <div className="col-6 mt-4" key={item.ID}>
                                    <div className="hc-s2-card d-flex mb-3 px-4 py-4">
                                        <img alt="" className="hc-s2-img" src={tempLogo}></img>
                                        <div className="flex-fill d-flex flex-column ms-3">
                                            <div className="hc-s2-name">{item.Name}</div>
                                            <div className="hc-s2-address"><FontAwesomeIcon icon={faLocationDot} className="me-1" /> {item.clinic.Name}</div>
                                            <div className="hc-s2-address"><FontAwesomeIcon icon={faKitMedical} className="me-1" /> {item.healthcare_type.Name}</div>
                                            <div className="hc-s2-end d-flex justify-content-between align-items-center">
                                                <div className="hc-s2-price">Price: <span>{item.Price} VND</span></div>
                                                <Link to={`/bookingHealthcare/${item.ID}`} type="button" className="hc-s2-button btn">Book now</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="hc-pagination d-flex justify-content-center pb-3">
                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                    </div>
                </div>
            </div>
            {_.isEmpty(healthcare) && !loading &&
                <>
                    <div className="hc-section-3 d-flex justify-content-center flex-column align-items-center py-5">
                        <div className="hc-s3-warning mb-4">We couldn’t find what you were looking for</div>
                        <img className="hc-s3-img" alt="" src={EmptyList}></img>
                    </div>
                </>
            }
            {loading &&
                <div className="hc-section-3 d-flex justify-content-center py-5">
                    <CircularProgress />
                </div>
            }
        </div >
    )
}

export default MedicalFacility;