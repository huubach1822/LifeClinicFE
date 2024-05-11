import "./Doctor.scss";
import { useEffect, useState } from 'react';
import { getAllDoctorsPagination } from "../../service/doctorService"
import { faAngleRight, faSearch, faLocationDot, faVenusMars, faStethoscope, faGraduationCap, faHospital } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getAllCity, getAllSpeciality } from "../../service/categoryService";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import _ from "lodash"
import EmptyList from "../../asset/image/EmptyList.webp"
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useLocation } from 'react-router-dom';

const MedicalFacility = () => {

    const location = useLocation();
    const data = location.state;

    // data
    const [doctors, setDoctor] = useState()
    const [city, setCity] = useState()
    const [specialityList, setSpecialityList] = useState();
    // pagination
    const [totalPage, setTotalPage] = useState(1);
    // loading
    const [loading, setLoading] = useState(true);
    // search and filter
    const [queryObject, setQueryObject] = useState({
        location: "",
        queryString: "",
        page: 1,
        idSpeciality: '',
        priceOrder: '',
    });

    // first render
    useEffect(() => {
        const fetchCategory = async () => {
            let res1 = await getAllCity()
            setCity(res1.data.city)
            let res2 = await getAllSpeciality()
            setSpecialityList(res2.data.speciality)
        }
        fetchCategory()
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
        var res = await getAllDoctorsPagination(obj.page, obj.queryString, obj.location, obj.idSpeciality, obj.priceOrder);
        setDoctor(res.data.data.result);
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
        let timerId = fetchData(queryObject)
        window.scrollTo(0, 0);
        return () => clearTimeout(timerId);
    }, [queryObject])

    return (
        <div>
            <div className="doc-section-1">
                <div className="doc-s1-p1 mt-3">
                    <Link to="/" className="doc-s1-p1-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="doc-s1-p1-doc ms-2">Doctor</span>
                </div>
                <div className="doc-s1-p2 d-flex flex-column align-items-center pb-5">
                    <div className="doc-s1-p2-title">Book Doctors</div>
                    <div className="doc-s1-p2-description">A network of excellent specialists working at leading major hospitals, with verified information.</div>
                    <div className="form-group has-search mt-4 mb-4 d-flex flex-row">
                        <span className="form-control-feedback"><FontAwesomeIcon icon={faSearch} /></span>
                        <input value={queryObject.queryString} name="queryString" onChange={onInputChange} type="text" className="form-control" placeholder="Find a Doctor" />
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
            <div className="doc-category pb-1">
                <div className="doc-category-container d-flex flex-row justify-content-end gap-4">
                    <div className="doc-category-select d-flex flex-row align-items-center gap-2">
                        <div className="doc-category-title">Speciality</div>
                        <FormControl size="small">
                            <Select
                                value={queryObject.idSpeciality}
                                name="idSpeciality"
                                onChange={onInputChange}
                                displayEmpty
                                defaultValue={""}
                                sx={{ width: 175, backgroundColor: "white", boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: "1px solid #D9D9D9 !important" } }}
                            >
                                <MenuItem value={""} >All Speciality</MenuItem>
                                {!_.isEmpty(specialityList) && specialityList.map((item, index) => {
                                    return <MenuItem key={index} value={item.ID}>{item.Name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="doc-category-select d-flex flex-row align-items-center gap-2">
                        <div className="doc-category-title">Price</div>
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
            <div className="doc-section-2" style={!_.isEmpty(doctors) && !loading ? { display: "block" } : { display: "none" }}>
                <div className="doc-s2-container d-flex flex-column">
                    <div className="row">
                        {doctors?.map((item, index) => {
                            return (
                                <div className="col-6 mt-4" key={item.ID}>
                                    <div className="doc-s2-card d-flex mb-3 px-4 py-4">
                                        <img alt="" className="doc-s2-img" src={process.env.REACT_APP_BACKEND_URL + item?.Avatar}></img>
                                        <div className="flex-fill ms-3">
                                            <div className="doc-s2-name">{item.Name}</div>
                                            <div className="doc-s2-address"><FontAwesomeIcon icon={faHospital} className="me-1" /> {item.clinic.Name}</div>
                                            <div className="doc-s2-address"><FontAwesomeIcon icon={faVenusMars} className="me-1" /> {item.Gender}</div>
                                            <div className="doc-s2-address"><FontAwesomeIcon icon={faStethoscope} className="me-1" /> {item.speciality.Name}</div>
                                            <div className="doc-s2-address"><FontAwesomeIcon icon={faGraduationCap} className="me-1" /> {item.degree.Name}</div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="doc-s2-price">Doctor Fee: <span>{item.Price} VND</span></div>
                                                <Link to={`/bookingDoctor/${item.ID}`} type="button" className="doc-s2-button btn">Book now</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="doc-pagination d-flex justify-content-center pb-3">
                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                    </div>
                </div>
            </div>
            {_.isEmpty(doctors) && !loading &&
                <>
                    <div className="doc-section-3 d-flex justify-content-center flex-column align-items-center py-5">
                        <div className="doc-s3-warning mb-4">We couldn’t find what you were looking for</div>
                        <img className="doc-s3-img" alt="" src={EmptyList}></img>
                    </div>
                </>
            }
            {loading &&
                <div className="doc-section-3 d-flex justify-content-center py-5">
                    <CircularProgress />
                </div>
            }
        </div >
    )
}

export default MedicalFacility;