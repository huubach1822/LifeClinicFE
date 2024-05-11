import "./BookingClinic.scss"
import { useEffect } from 'react';
import { faStethoscope, faMagnifyingGlass, faKitMedical, faHospital, faDollarSign, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getHealthcareByClinic } from "../../service/healthcareService";
import { getAllHealthcareType } from "../../service/categoryService";
import Form from 'react-bootstrap/Form';
import _ from 'lodash';

const BookingClinicHc = () => {

    // param from url
    let { id } = useParams();
    // react router
    const navigate = useNavigate();
    // data
    const [clinicDetail, setClinicDetail] = useState();
    const [typeList, setTypeList] = useState();
    const [healthcareFilter, setHealthcareFilter] = useState();

    const [queryObject, setQueryObject] = useState({
        name: "",
        type: "",
    })

    // call api
    useEffect(() => {
        const getData = async () => {
            let response = await getHealthcareByClinic(id)
            setClinicDetail(response.data.result)
            setHealthcareFilter(response.data.result.healthcare_packages)

            let res = await getAllHealthcareType()
            setTypeList(res.data.healthcareType)

        };
        getData();
        // eslint-disable-next-line
    }, []);

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setQueryObject(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        let tempArray = clinicDetail?.healthcare_packages?.filter((item) => {
            return item.Name.toLowerCase().includes(queryObject.name.toLowerCase())
                && (_.isEmpty(queryObject.type) ? true : item.healthcare_type.ID == queryObject.type)
        })
        setHealthcareFilter(tempArray)
        // eslint-disable-next-line 
    }, [queryObject])

    return (
        <div className="d-flex justify-content-center booking-clinic-page">
            <div className="row bc-container my-3">
                <div className="bc-s0 mb-3">
                    <Link to="/" className="bc-s0-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="bc-s0-title ms-2">Find Healthcare Package</span>
                </div>
                <div className="col-4 bc-s1 pe-4">
                    <div className="bc-s1-title">Medical Facility Information</div>
                    <div className="bc-s1-info d-flex flex-column">
                        {!_.isEmpty(clinicDetail) && (
                            <>
                                <img alt="" className="my-3" src={process.env.REACT_APP_BACKEND_URL + clinicDetail?.Logo}></img>
                                <div className="bc-s1-name mt-3"><FontAwesomeIcon icon={faHospital} className="me-2 icon" />{clinicDetail.Name}</div>
                                <div className="mb-2 bc-s1-address">{clinicDetail.Address}</div>
                                <div className="bc-s1-des pt-1">{clinicDetail.Short_Description}</div>
                            </>
                        )
                        }
                    </div>
                </div>
                <div className="col-8 bc-s2-container">
                    <div className="bc-s2 ms-3 pb-4">
                        <div className="bc-s2-title">Select a Healthcare Package</div>
                        <div className="input-group mt-4 mx-4 bc-s2-search-container">
                            <input name="name" onChange={onInputChange} type="text" className="form-control shadow-none" placeholder="Find a Healthcare Package" />
                            <div className="input-group-append">
                                <button className="btn shadow-none" type="button">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                            </div>
                        </div>
                        <div className="d-flex bc-s2-select mt-3 mx-4 gap-2">
                            <Form.Select aria-label="Default select example" name="type" value={queryObject.type} onChange={onInputChange}>
                                <option value="">Select Type</option>
                                {!_.isEmpty(typeList) && typeList.map((item, index) => {
                                    return <option key={index} value={item.ID}>{item.Name}</option>
                                })}
                            </Form.Select>
                        </div>
                        <div className="bc-doctors-container ps-3 ms-2 mt-3 pe-3 me-4 pb-4">
                            <div className="bc-doctors d-flex flex-column gap-3">
                                {!_.isEmpty(healthcareFilter) && healthcareFilter.map((item, index) => {
                                    return (
                                        <div style={{ minHeight: "150px" }} key={item.ID} className="bc-s2-card d-flex px-2 py-2" onClick={() => navigate(`/bookingHealthcare/${item.ID}`)}>
                                            <div className="flex-fill ms-2 gap-1 d-flex flex-column justify-content-around">

                                                <div className="bc-s2-name">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faKitMedical} /> </div>
                                                    {item.Name}
                                                </div>
                                                <div className="bc-s2-doc-info">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faStethoscope} /></div>
                                                    Type: {item.healthcare_type.Name}
                                                </div>
                                                <div className="bc-s2-doc-info">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faDollarSign} /></div>
                                                    Price: {item.Price} VND
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {_.isEmpty(healthcareFilter) &&
                                <div className="bc-nodata">No healthcare package available</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingClinicHc