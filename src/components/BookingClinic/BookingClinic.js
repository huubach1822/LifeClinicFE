import "./BookingClinic.scss"
import { useEffect } from 'react';
import { faUserDoctor, faStethoscope, faMagnifyingGlass, faVenusMars, faHospital, faDollarSign, faGraduationCap, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getDoctorByClinic } from "../../service/doctorService";
import { getAllDegree, getAllSpeciality } from "../../service/categoryService";
import Form from 'react-bootstrap/Form';
import _ from 'lodash';

const BookingClinic = () => {

    // param from url
    let { id } = useParams();
    // react router
    const navigate = useNavigate();
    // data
    const [clinicDetail, setClinicDetail] = useState();
    const [degreeList, setDegreeList] = useState();
    const [specialityList, setSpecialityList] = useState();
    const [doctorFilter, setDoctorFilter] = useState();

    const [queryObject, setQueryObject] = useState({
        name: "",
        degree: "",
        speciality: "",
        gender: ""
    })

    // call api
    useEffect(() => {
        const getData = async () => {
            let response = await getDoctorByClinic(id)
            setClinicDetail(response.data.result)
            setDoctorFilter(response.data.result.doctors)

            let res = await getAllDegree()
            setDegreeList(res.data.degree)

            let res2 = await getAllSpeciality()
            setSpecialityList(res2.data.speciality)
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
        let tempArray = clinicDetail?.doctors.filter((item) => {
            return item.Name.toLowerCase().includes(queryObject.name.toLowerCase())
                && (_.isEmpty(queryObject.gender) ? true : item.Gender === queryObject.gender)
                && (_.isEmpty(queryObject.degree) ? true : item.degree.ID === +queryObject.degree)
                && (_.isEmpty(queryObject.speciality) ? true : item.speciality.ID === +queryObject.speciality)
        })
        setDoctorFilter(tempArray)
        // eslint-disable-next-line 
    }, [queryObject])

    return (
        <div className="d-flex justify-content-center booking-clinic-page">
            <div className="row bc-container my-3">
                <div className="bc-s0 mb-3">
                    <Link to="/" className="bc-s0-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="bc-s0-title ms-2">Find Doctor</span>
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
                        <div className="bc-s2-title">Select a Doctor</div>
                        <div className="input-group mt-4 mx-4 bc-s2-search-container">
                            <input name="name" onChange={onInputChange} type="text" className="form-control shadow-none" placeholder="Find a Doctor" />
                            <div className="input-group-append">
                                <button className="btn shadow-none" type="button">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                            </div>
                        </div>
                        <div className="d-flex bc-s2-select mt-3 mx-4 gap-2">
                            <Form.Select aria-label="Default select example" name="degree" value={queryObject.degree} onChange={onInputChange}>
                                <option value="">Select Degree</option>
                                {!_.isEmpty(degreeList) && degreeList.map((item, index) => {
                                    return <option key={index} value={item.ID}>{item.Name}</option>
                                })}
                            </Form.Select>
                            <Form.Select aria-label="Default select example" name="speciality" value={queryObject.speciality} onChange={onInputChange}>
                                <option value="" >Select Speciality</option>
                                {!_.isEmpty(specialityList) && specialityList.map((item, index) => {
                                    return <option key={index} value={item.ID}>{item.Name}</option>
                                })}
                            </Form.Select>
                            <Form.Select aria-label="Default select example" name="gender" value={queryObject.gender} onChange={onInputChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </div>
                        <div className="bc-doctors-container ps-3 ms-2 mt-3 pe-3 me-4 pb-4">
                            <div className="bc-doctors d-flex flex-column gap-3">
                                {!_.isEmpty(doctorFilter) && doctorFilter.map((item, index) => {
                                    return (
                                        <div key={item.ID} className="bc-s2-card d-flex px-2 py-2" onClick={() => navigate(`/bookingDoctor/${item.ID}`)}>
                                            <div className="flex-fill ms-2 gap-1 d-flex flex-column">

                                                <div className="bc-s2-name">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faUserDoctor} /> </div>
                                                    {item.Name}
                                                </div>
                                                <div className="bc-s2-doc-info">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faVenusMars} /></div>
                                                    Gender: {item.Gender}
                                                </div>
                                                <div className="bc-s2-doc-info">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faStethoscope} /></div>
                                                    Speciality: {item.speciality?.Name}
                                                </div>
                                                <div className="bc-s2-doc-info">
                                                    <div className="bc-s2-icon"><FontAwesomeIcon icon={faGraduationCap} /></div>
                                                    Degree: {item.degree?.Name}
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
                            {_.isEmpty(doctorFilter) &&
                                <div className="bc-nodata">No doctor available</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingClinic