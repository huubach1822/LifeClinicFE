import { faAngleRight, faCircleUser, faPhone, faVenusMars, faLocationDot, faPeopleGroup, faCakeCandles, faTrashCan, faCircleInfo, faArrowRight, faArrowLeft, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash';
import EmptyList from '../../asset/image/EmptyList.webp'
import Swal from 'sweetalert2'
import { getAllPatientByAccount, deletePatient } from '../../service/patientService'
import { toast } from 'react-toastify';
import PatientForm from '../PatientForm/PatientForm'
import "./SelectPatient.scss";

const SelectPatient = () => {

    const { state } = useLocation();
    const [show, setShow] = useState(false)
    const account = useSelector(state => state.accountSlice.account)
    const [patients, setPatient] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const navigate = useNavigate()

    //call api
    const fetchData = async () => {
        let data = await getAllPatientByAccount(account.ID)
        setPatient(data.data.patients)
    }

    // first render
    useEffect(() => {
        if (_.isEmpty(account) || _.isEmpty(state)) {
            navigate("/")
        }
        fetchData()
        // eslint-disable-next-line
    }, [])

    const deleteBtn = async (id) => {
        Swal.fire({
            title: "Are you sure you want to delete?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                deletePatient(id).then((result) => {
                    fetchData()
                    if (result.data.code === 0) {
                        toast.success(result.data.message)
                    } else {
                        toast.error(result.data.message)
                    }
                })
            } else if (result.isDenied) {

            }
        });
    }

    const detailBtn = (item) => {
        setSelectedPatient(item)
        setShow(true)
    }

    const addBtn = () => {
        setSelectedPatient(null)
        setShow(true)
    }

    const continueBtn = () => {
        let flag = selectedPatient.bookings.some((e) => e.schedule.Date === state.selectedSchedule.Date && e.Status !== "Cancelled")
        if (flag) {
            toast.error(<div>This patient already has an appointment on {state.selectedSchedule.Date} </div>)
        } else {
            navigate(`/confirm`, { state: { selectedServices: state.selectedServices, selectedSchedule: state.selectedSchedule, selectedPatient: selectedPatient, selectedDoctor: state.selectedDoctor, selectedHealthcare: state.selectedHealthcare } })
        }
    }

    return (
        <>
            <div className="select-patient-page pt-3 pb-4">
                <div className="sp-link mb-3">
                    <Link to="/" className="sp-hp me-2">Home Page</Link>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <span className="sp-title ms-2">Select patient record</span>
                </div>
                <div className="sp-container d-flex flex-column align-items-center">
                    <div className="sp-title">Select Patient Record</div>
                    {!_.isEmpty(patients) ? (
                        <div className='sp-content mt-3'>
                            {patients?.map((item, index) => {
                                return (
                                    <>
                                        {item.ID !== selectedPatient?.ID ? (
                                            <div className='sp-card' key={item.ID} onClick={() => setSelectedPatient(item)}>
                                                <div className='sp-info sp-border'>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faCircleUser} /></span>Full name: <span className='sp-name'>{item.Name}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faCakeCandles} /></span>Date of birth: <span className='fw-bold'>{item.DateOfBirth}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faPhone} /></span>Phone number: <span className='fw-bold'>{item.Phone}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faVenusMars} /></span>Gender: <span className='fw-bold'>{item.Gender}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faLocationDot} /></span>Address: <span className='fw-bold'>{item.Address}</span></div>
                                                    <div><span className='sp-icon'><FontAwesomeIcon icon={faPeopleGroup} /></span>Ethnicity: <span className='fw-bold'>{item.Ethnicity}</span></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='sp-card' key={item.ID} onClick={() => setSelectedPatient(item)}>
                                                <div className='sp-info'>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faCircleUser} /></span>Full name: <span className='sp-name'>{item.Name}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faCakeCandles} /></span>Date of birth: <span className='fw-bold'>{item.DateOfBirth}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faPhone} /></span>Phone number: <span className='fw-bold'>{item.Phone}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faVenusMars} /></span>Gender: <span className='fw-bold'>{item.Gender}</span></div>
                                                    <div className='mb-1'><span className='sp-icon'><FontAwesomeIcon icon={faLocationDot} /></span>Address: <span className='fw-bold'>{item.Address}</span></div>
                                                    <div><span className='sp-icon'><FontAwesomeIcon icon={faPeopleGroup} /></span>Ethnicity: <span className='fw-bold'>{item.Ethnicity}</span></div>
                                                </div>
                                                <div className='sp-btn d-flex justify-content-between'>
                                                    <div className="d-flex gap-3">
                                                        <button onClick={() => deleteBtn(item.ID)} type="button" className="btn btn-primary sp-btn-delete"><FontAwesomeIcon icon={faTrashCan} className='me-2' />Delete</button>
                                                        <button onClick={() => detailBtn(item)} type="button" className="btn btn-primary sp-btn-detail"><FontAwesomeIcon icon={faCircleInfo} className='me-2' />Detail</button>
                                                    </div>
                                                    <button onClick={() => continueBtn(item.ID)} type="button" className="btn btn-primary sp-btn-continue">Continue <FontAwesomeIcon icon={faArrowRight} className="ms-2" /></button>
                                                </div>
                                            </div>
                                        )
                                        }
                                    </>
                                )
                            })}
                        </div>
                    ) : (
                        <div className='sp-no-data my-4 d-flex justify-content-center flex-column align-items-center'>
                            <div className="sp-no-data-title">Please create a new patient record to book an appointment.</div>
                            <img className="sp-no-data-img" alt="" src={EmptyList}></img>
                        </div>
                    )
                    }
                    <div className="btn-group2 d-flex justify-content-between align-items-center ">
                        <button type="button" className="btn btn-primary sp-btn-goback" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back</button>
                        <button type="button" className="btn btn-primary sp-btn-add" onClick={() => addBtn()}><FontAwesomeIcon icon={faUserPlus} className='me-2' />Add Patient</button>
                    </div>
                </div>
            </div>
            <PatientForm show={show} setShow={setShow} fetchData={fetchData} patient={selectedPatient} setPatient={setSelectedPatient} />
        </>
    )
}

export default SelectPatient