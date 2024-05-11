import "./DoctorInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import DoctorForm from "../../form/DoctorForm/DoctorForm";
import { getAllSpeciality, getAllDegree } from "../../../service/categoryService";
import { getAllClinics } from "../../../service/clinicService";
import { doctorDetailRedux } from "../../../redux/slices/doctorSlice";

const DoctorInfo = () => {

    const account = useSelector(state => state.accountSlice.account)
    const doctor = useSelector(state => state.doctorSlice.doctor)
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    const [speciality, setSpeciality] = useState([]);
    const [degree, setDegree] = useState([]);
    const [clinic, setClinic] = useState([]);

    const fetchData = async () => {
        await dispatch(doctorDetailRedux(account.ID))
        let res1 = await getAllSpeciality();
        setSpeciality(res1.data.speciality);
        let res2 = await getAllDegree();
        setDegree(res2.data.degree);
        let res3 = await getAllClinics();
        setClinic(res3.data.clinics);
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="docpage-info">

            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Personal Information</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Personal Information</span>
                    </div>

                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body p-5">
                                <div className="row">
                                    <div className="col-4">
                                        <div><img alt="" className="img-doc" src={process.env.REACT_APP_BACKEND_URL + doctor?.Avatar} /></div>
                                        <div className="mt-4">
                                            <div className="fw-bold">Doctor Fee</div>
                                            <div>{doctor?.Price} VND</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Speciality</div>
                                            <div>{doctor?.speciality?.Name}</div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div>
                                            <div className="fw-bold">ID</div>
                                            <div>{doctor?.ID}</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Name</div>
                                            <div>{doctor?.Name}</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Phone</div>
                                            <div>{doctor?.Phone}</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Date of Birth</div>
                                            <div>{doctor?.DateOfBirth}</div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div>
                                            <div className="fw-bold">Degree</div>
                                            <div>{doctor?.degree?.Name}</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Gender</div>
                                            <div>{doctor?.Gender}</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Clinic</div>
                                            <div>{doctor?.clinic?.Name}</div>
                                        </div>
                                        <div className="mt-5 pt-2">
                                            <div className="fw-bold">Email</div>
                                            <div>{doctor?.Email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 fw-bold">Description</div>
                                <div className="mt-2" style={{ textAlign: 'justify' }}>{doctor?.Description}</div>
                                <div className="d-flex align-items-center justify-content-center mt-4 pt-2">
                                    <div className="btn btn-primary" onClick={() => setShow(true)}>Update Information</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <DoctorForm doctor={doctor} setDoctor={() => { }} show={show} setShow={setShow} fetchData={fetchData} speciality={speciality} degree={degree} clinic={clinic} />
        </div>
    )
}

export default DoctorInfo