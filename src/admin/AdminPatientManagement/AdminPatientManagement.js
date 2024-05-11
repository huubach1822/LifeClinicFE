import "./AdminPatientManagement.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import { getAllPatientForDoctor, getAllPatientByHealthCare } from "../../service/patientService";
import PatientForm from "../../components/PatientForm/PatientForm";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { getAllDoctors } from "../../service/doctorService";
import tempLogo from "../../asset/image/Healthcarepackage/tempLogo.webp";
import { getAllHealthcare } from "../../service/healthcareService";

const AdminPatientManagement = () => {

    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState({
        ID: "all",
        Name: "All",
    })
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useState(1);
    const [queryObject, setQueryObject] = useState({
        page: 1,
        queryString: "",
        flag: "doctor"
    });
    const [patient, setPatient] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [healthcare, setHealthCare] = useState([]);
    const [selectedHealthcare, setSelectedHealthcare] = useState({
        ID: "all",
        Name: "All",
    });

    const fetchData = async () => {

        let res = null;

        if (queryObject.flag === "doctor") {
            res = await getAllPatientForDoctor(selectedDoctor.ID, queryObject.page, queryObject.queryString);
        } else {
            res = await getAllPatientByHealthCare(selectedHealthcare.ID, queryObject.page, queryObject.queryString);
        }

        setPatient(res.data.data.result);
        setTotalPage(res.data.data.totalPages)
    }

    useEffect(() => {
        const getData = async () => {
            let res3 = await getAllDoctors();
            res3.data.doctors.unshift({ ID: "all", Name: "All" })
            setDoctors(res3.data.doctors)
            let res4 = await getAllHealthcare();
            res4.data.healthcarePackage.unshift({ ID: "all", Name: "All" })
            setHealthCare(res4.data.healthcarePackage)
        }
        getData();
        fetchData();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [queryObject, selectedDoctor, selectedHealthcare])

    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };

    return (
        <div className="admin-patient-management">

            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Patient Management</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Patient Management</span>
                    </div>
                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="mt-3">
                                    <div className="d-flex flex-row justify-content-end align-items-center gap-3">
                                        {
                                            queryObject.flag === "doctor" ?
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    sx={{ width: 300 }}
                                                    options={doctors}
                                                    autoHighlight
                                                    disableClearable
                                                    value={selectedDoctor}
                                                    onChange={(e, value) => { setSelectedDoctor(value); setQueryObject({ ...queryObject, page: 1 }) }}
                                                    getOptionLabel={(option) => option.Name}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            <img
                                                                loading="lazy"
                                                                width="20"
                                                                srcSet={process.env.REACT_APP_BACKEND_URL + option.Avatar}
                                                                src={process.env.REACT_APP_BACKEND_URL + option.Avatar}
                                                                alt=""
                                                            />
                                                            {option.Name}
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Choose a doctor"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                :
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    sx={{ width: 300 }}
                                                    options={healthcare}
                                                    autoHighlight
                                                    disableClearable
                                                    value={selectedHealthcare}
                                                    onChange={(e, value) => { setSelectedHealthcare(value); setQueryObject({ ...queryObject, page: 1 }) }}
                                                    getOptionLabel={(option) => option.Name}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            <img
                                                                loading="lazy"
                                                                width="20"
                                                                srcSet={tempLogo}
                                                                src={tempLogo}
                                                                alt=""
                                                            />
                                                            {option.Name}
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Choose a healthcare package"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                        }
                                        <div className="d-flex flex-row gap-3 align-items-center">
                                            <span>Filter: </span>
                                            <Form.Select
                                                id="flagSelect"
                                                value={queryObject.flag}
                                                onChange={(e) => {
                                                    setQueryObject({
                                                        page: 1,
                                                        queryString: "",
                                                        flag: e.target.value
                                                    });
                                                }}
                                                aria-label="Default select example"
                                            >
                                                {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                                                <option value="doctor">Doctor</option>
                                                <option value="healthcare">HealthCare Package</option>
                                            </Form.Select>
                                        </div>
                                        <div>Search: </div>
                                        <Form.Control value={queryObject.queryString} onChange={(e) => setQueryObject({ ...queryObject, queryString: e.target.value, page: 1 })} style={{ width: '250px' }} type="text" placeholder="Enter patient name" />
                                    </div>
                                    <div className="as-table mt-3" style={{ minHeight: '500px' }}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Gender</th>
                                                    <th>Phone</th>
                                                    <th>Is Deleted</th>
                                                    <th>Patient Information</th>
                                                    <th>Booking Information</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patient?.map((item, index) => {
                                                    return (
                                                        <tr key={`patient${item.ID}`}>
                                                            <td>
                                                                {item?.ID}
                                                            </td>
                                                            <td>
                                                                {item?.Name}
                                                            </td>
                                                            <td>
                                                                {item?.Gender}
                                                            </td>
                                                            <td>
                                                                {item?.Phone}
                                                            </td>
                                                            <td>
                                                                {item?.IsDeleted ? "Yes" : "No"}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-primary mt-1" onClick={() => { setSelectedPatient(item); setShow(true) }}>Patient Detail</button>
                                                            </td>
                                                            <td>
                                                                <div style={{ maxHeight: '250px', overflow: 'auto', paddingRight: '10px' }}>
                                                                    {item.booking?.map((booking, index) => {
                                                                        return (
                                                                            <>
                                                                                {
                                                                                    index === 0 ?
                                                                                        <div className="gap-2 d-flex flex-column justify-content-between align-items-center" key={`booking${index}`}>
                                                                                            <div style={{ width: '100%' }} className="d-flex flex-row justify-content-between">
                                                                                                <div>Date: {booking?.schedule.Date}</div>
                                                                                                {
                                                                                                    queryObject.flag === "doctor" ?
                                                                                                        <div>Doctor: {booking?.schedule.doctor?.Name}</div>
                                                                                                        :
                                                                                                        <div>{booking?.schedule.healthcare_package?.Name}</div>
                                                                                                }

                                                                                            </div>
                                                                                            <div style={{ width: '100%' }} className="d-flex flex-row justify-content-between">
                                                                                                <div>Status: {booking?.Status}</div>
                                                                                                {
                                                                                                    queryObject.flag === "doctor" ?
                                                                                                        <button className="btn btn-info"
                                                                                                            onClick={() => { navigate(`/admin/adminBookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status, doctor: booking?.schedule.doctor, flag: queryObject.flag } }) }}
                                                                                                        >Booking Detail</button>
                                                                                                        :
                                                                                                        <button className="btn btn-info"
                                                                                                            onClick={() => { navigate(`/admin/adminBookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status, healthCare: booking?.schedule.healthcare_package, flag: queryObject.flag } }) }}
                                                                                                        >Booking Detail</button>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        // <div style={{ borderTop: '1px solid #BEBEBE' }} className="gap-2 mt-2 pt-2 d-flex flex-column justify-content-between align-items-center" key={`booking${index}`}>
                                                                                        //     <div style={{ width: '100%' }} className="d-flex flex-row justify-content-between">
                                                                                        //         <div>Date: {booking?.schedule.Date}</div>
                                                                                        //         <div>Doctor: {booking?.schedule.doctor?.Name}</div>
                                                                                        //     </div>
                                                                                        //     <div style={{ width: '100%' }} className="d-flex flex-row justify-content-between">
                                                                                        //         <div>Status: {booking?.Status}</div>
                                                                                        //         <button className="btn btn-info"
                                                                                        //             onClick={() => { navigate(`/admin/adminBookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status, doctor: booking?.schedule.doctor } }) }}
                                                                                        //         >Booking Detail</button>
                                                                                        //     </div>
                                                                                        // </div>
                                                                                        <div style={{ borderTop: '1px solid #BEBEBE' }} className="gap-2 mt-2 d-flex flex-column justify-content-between align-items-center" key={`booking${index}`}>
                                                                                            <div style={{ width: '100%' }} className="d-flex flex-row justify-content-between">
                                                                                                <div>Date: {booking?.schedule.Date}</div>
                                                                                                {
                                                                                                    queryObject.flag === "doctor" ?
                                                                                                        <div>Doctor: {booking?.schedule.doctor?.Name}</div>
                                                                                                        :
                                                                                                        <div>{booking?.schedule.healthcare_package?.Name}</div>
                                                                                                }

                                                                                            </div>
                                                                                            <div style={{ width: '100%' }} className="d-flex flex-row justify-content-between">
                                                                                                <div>Status: {booking?.Status}</div>
                                                                                                {
                                                                                                    queryObject.flag === "doctor" ?
                                                                                                        <button className="btn btn-info"
                                                                                                            onClick={() => { navigate(`/admin/adminBookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status, doctor: booking?.schedule.doctor, flag: queryObject.flag } }) }}
                                                                                                        >Booking Detail</button>
                                                                                                        :
                                                                                                        <button className="btn btn-info"
                                                                                                            onClick={() => { navigate(`/admin/adminBookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status, healthCare: booking?.schedule.healthcare_package, flag: queryObject.flag } }) }}
                                                                                                        >Booking Detail</button>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                }
                                                                            </>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-center p-2">
                                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PatientForm viewOnly={true} show={show} setShow={setShow} fetchData={fetchData} patient={selectedPatient} setPatient={setSelectedPatient} />
            </section>
        </div>
    )
}

export default AdminPatientManagement