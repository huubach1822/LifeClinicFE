import "./PatientManagement.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import { getAllPatientForDoctor } from "../../../service/patientService";
import { useSelector } from "react-redux"
import PatientForm from "../../../components/PatientForm/PatientForm";
import { useNavigate } from 'react-router-dom';

const PatientManagement = () => {

    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useState(1);
    const [queryObject, setQueryObject] = useState({
        page: 1,
        queryString: ""
    });
    const [patient, setPatient] = useState([]);
    const account = useSelector(state => state.accountSlice.account);
    const [show, setShow] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const fetchData = async () => {
        let res = await getAllPatientForDoctor(account.doctors[0].ID, queryObject.page, queryObject.queryString);
        setPatient(res.data.data.result);
        setTotalPage(res.data.data.totalPages)
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [queryObject])

    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };

    return (
        <div className="patient-management">

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
                                                    <th>DateOfBirth</th>
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
                                                                {item?.DateOfBirth}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-primary mt-1" onClick={() => { setSelectedPatient(item); setShow(true) }}>Patient Detail</button>
                                                            </td>
                                                            <td>
                                                                {item.booking?.map((booking, index) => {
                                                                    return (
                                                                        <>
                                                                            {
                                                                                index === 0 ?
                                                                                    <div className="d-flex justify-content-between align-items-center" key={`booking${index}`}>
                                                                                        <div>Date: {booking?.schedule.Date}</div>
                                                                                        <div>Status: {booking?.Status}</div>
                                                                                        <button className="btn btn-info"
                                                                                            onClick={() => { navigate(`/admin/bookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status } }) }}
                                                                                        >Booking Detail</button>
                                                                                    </div>
                                                                                    :
                                                                                    <div style={{ borderTop: '1px solid #BEBEBE' }} className="mt-2 pt-2 d-flex justify-content-between align-items-center" key={`booking${index}`}>
                                                                                        <div>Date: {booking?.schedule.Date}</div>
                                                                                        <div>Status: {booking?.Status}</div>
                                                                                        <button className="btn btn-info"
                                                                                            onClick={() => { navigate(`/admin/bookingStatus`, { state: { date: booking?.schedule.Date, time: booking?.schedule.ID_time_type, id: booking?.ID, status: booking?.Status } }) }}
                                                                                        >Booking Detail</button>
                                                                                    </div>
                                                                            }
                                                                        </>
                                                                    )
                                                                })}
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

export default PatientManagement