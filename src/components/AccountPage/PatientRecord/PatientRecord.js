import './PatientRecord.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser, faCakeCandles, faPhone, faVenusMars, faLocationDot, faPeopleGroup, faTrashCan, faCircleInfo, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import PatientForm from '../../PatientForm/PatientForm'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllPatientByAccount, deletePatient } from '../../../service/patientService'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import _ from 'lodash';
import EmptyList from '../../../asset/image/EmptyList.webp'

const PatientRecord = () => {

    const [show, setShow] = useState(false)
    const account = useSelector(state => state.accountSlice.account)
    const [patients, setPatient] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)

    //call api
    const fetchData = async () => {
        let data = await getAllPatientByAccount(account.ID)
        setPatient(data.data.patients)
    }

    // first render
    useEffect(() => {
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

    return (
        <>
            <div className='pr-container'>
                <div className='pr-title d-flex justify-content-between'>
                    <div>Patient Record</div>
                    <button type="button" className="btn btn-primary pr-btn-add me-4" onClick={() => setShow(true)}><FontAwesomeIcon icon={faUserPlus} className='me-2' />Add Patient</button>
                </div>
                {!_.isEmpty(patients) ? (
                    <div className='row pr-content'>
                        {patients?.map((item, index) => {
                            return (
                                <div className='col-12 pr-card' key={item.ID}>
                                    <div className='pr-info'>
                                        <div className='mb-1'><span className='pr-icon'><FontAwesomeIcon icon={faCircleUser} /></span>Full name: <span className='pr-name'>{item.Name}</span></div>
                                        <div className='mb-1'><span className='pr-icon'><FontAwesomeIcon icon={faCakeCandles} /></span>Date of birth: <span className='fw-bold'>{item.DateOfBirth}</span></div>
                                        <div className='mb-1'><span className='pr-icon'><FontAwesomeIcon icon={faPhone} /></span>Phone number: <span className='fw-bold'>{item.Phone}</span></div>
                                        <div className='mb-1'><span className='pr-icon'><FontAwesomeIcon icon={faVenusMars} /></span>Gender: <span className='fw-bold'>{item.Gender}</span></div>
                                        <div className='mb-1'><span className='pr-icon'><FontAwesomeIcon icon={faLocationDot} /></span>Address: <span className='fw-bold'>{item.Address}</span></div>
                                        <div className='mb-1'><span className='pr-icon'><FontAwesomeIcon icon={faPeopleGroup} /></span>Ethnicity: <span className='fw-bold'>{item.Ethnicity}</span></div>
                                    </div>
                                    <div className='pr-btn d-flex justify-content-end'>
                                        <button onClick={() => deleteBtn(item.ID)} type="button" className="btn btn-primary pr-btn-delete"><FontAwesomeIcon icon={faTrashCan} className='me-2' />Delete</button>
                                        <button onClick={() => detailBtn(item)} type="button" className="btn btn-primary pr-btn-detail"><FontAwesomeIcon icon={faCircleInfo} className='me-2' />Detail</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className='pr-no-data mt-5 d-flex justify-content-center flex-column align-items-center'>
                        <div className="pr-no-data-title">Please create a new patient record to book an appointment.</div>
                        <img className="pr-no-data-img" alt="" src={EmptyList}></img>
                    </div>
                )
                }
            </div>
            <PatientForm show={show} setShow={setShow} fetchData={fetchData} patient={selectedPatient} setPatient={setSelectedPatient} />
        </>
    )
}

export default PatientRecord