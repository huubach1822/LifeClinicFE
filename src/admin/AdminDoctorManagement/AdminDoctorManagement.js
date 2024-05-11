import "./AdminDoctorManagement.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";
import { getAllDoctorSpeciality, deleteDocSpeciality, deleteDoctorByID } from "../../service/doctorService";
import SpecialityForm from "../form/SpecialityForm/SpecialityForm";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import { getAllDoctorsAdmin } from "../../service/doctorService";
import DoctorForm from "../form/DoctorForm/DoctorForm";
import { getAllSpeciality, getAllDegree } from "../../service/categoryService";
import { getAllClinics } from "../../service/clinicService";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

const AdminDoctorManagement = () => {

    const [queryString, setQueryString] = useState("");
    const [specialityList, setSpecialityList] = useState([]);
    const [show, setShow] = useState(false);
    const [obj, setObj] = useState(null);
    const [totalPage, setTotalPage] = useState(1);
    const [queryObject, setQueryObject] = useState({
        queryString: "",
        page: 1,
    });
    const [doctors, setDoctor] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState([]);
    const [speciality, setSpeciality] = useState([]);
    const [degree, setDegree] = useState([]);
    const [clinic, setClinic] = useState([]);
    const [show2, setShow2] = useState(false);

    const [clinicList, setClinicList] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState(
        { ID: "all", Name: "All" }
    );

    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };

    const fetchData = async () => {
        const response = await getAllDoctorSpeciality(queryString);
        setSpecialityList(response.data.result);
        let res1 = await getAllSpeciality();
        setSpeciality(res1.data.speciality);
        let res2 = await getAllDegree();
        setDegree(res2.data.degree);
        let res3 = await getAllClinics();
        setClinic(res3.data.clinics);
    }
    const fetchDataDoctor = async () => {
        let res = await getAllDoctorsAdmin(queryObject.page, queryObject.queryString, selectedClinic.ID);
        setDoctor(res.data.data.result);
        setTotalPage(res.data.data.totalPages)
        const response = await getAllDoctorSpeciality(queryString);
        setSpecialityList(response.data.result);
        const response2 = await getAllClinics();
        response2.data.clinics.unshift({ ID: "all", Name: "All" })
        setClinicList(response2.data.clinics);
    }

    useEffect(() => {
        fetchData();
    }, [queryString]);

    useEffect(() => {
        fetchDataDoctor();
    }, [queryObject, selectedClinic]);

    useEffect(() => {
        fetchData();
        fetchDataDoctor();
    }, []);

    const deleteBtn = async (id) => {
        Swal.fire({
            title: "Are you sure you want to delete?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDoctorByID(id).then((result) => {
                    fetchDataDoctor();
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
        setSelectedDoctor(item)
        setShow2(true)
    }

    return (
        <div className="admin-doc-management">
            <SpecialityForm fetchData={fetchData} show={show} setShow={setShow} obj={obj} setObj={setObj} />
            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Doctor Management</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Doctor Management</span>
                    </div>

                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="da-container p-2 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="as-title">Speciality List</div>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>Search: </div>
                                                <Form.Control value={queryString} onChange={(e) => setQueryString(e.target.value)} style={{ width: '250px' }} type="text" placeholder="Enter speciality name" />
                                                <button className="btn btn-primary" onClick={() => { setObj(null); setShow(true) }}>Add New</button>
                                            </div>
                                        </div>
                                        <div className='as-table'>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Number of doctor</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {specialityList?.map((item, index) => {
                                                        return (
                                                            <tr key={`speciality${item?.ID}`}>
                                                                <td>
                                                                    {item?.ID}
                                                                </td>
                                                                <td>
                                                                    {item?.Name}
                                                                </td>
                                                                <td>
                                                                    {item?.count_doctor}
                                                                </td>
                                                                <td >
                                                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                                                        <button className="btn btn-primary" onClick={() => { setObj(item); setShow(true) }}>Edit</button>
                                                                        <button onClick={() => {
                                                                            Swal.fire({
                                                                                title: "Are you sure you want to delete?",
                                                                                icon: "warning",
                                                                                showDenyButton: true,
                                                                                confirmButtonText: "Yes",
                                                                                denyButtonText: `No`,
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    deleteDocSpeciality(item.ID).then((result) => {
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

                                                                        }}
                                                                            disabled={item.count_doctor > 0} className="btn btn-danger">Delete</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="da-container p-2 d-flex flex-column justify-content-between">
                                    <div style={{ height: "675px" }}>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="as-title">Doctor List</div>
                                            <div className="d-flex gap-4 align-items-center">
                                                <Autocomplete
                                                    id="country-select-demo"
                                                    sx={{ width: 300 }}
                                                    options={clinicList}
                                                    autoHighlight
                                                    disableClearable
                                                    value={selectedClinic}
                                                    onChange={(e, value) => setSelectedClinic(value)}
                                                    getOptionLabel={(option) => option.Name}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            <img
                                                                loading="lazy"
                                                                width="20"
                                                                srcSet={process.env.REACT_APP_BACKEND_URL + option.Logo}
                                                                src={process.env.REACT_APP_BACKEND_URL + option.Logo}
                                                                alt=""
                                                            />
                                                            {option.Name}
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Choose a clinic"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                />
                                                <div>Search: </div>
                                                <Form.Control value={queryObject.queryString} onChange={(e) => setQueryObject({ ...queryObject, queryString: e.target.value, page: 1 })} style={{ width: '250px' }} type="text" placeholder="Enter doctor name" />
                                                <button className="btn btn-primary" onClick={() => { setSelectedDoctor(null); setShow2(true) }}>Add New</button>
                                            </div>
                                        </div>
                                        <div className='as-table' style={{ height: "max-content" }}>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Gender</th>
                                                        <th>Price</th>
                                                        <th>Date Of Birth</th>
                                                        <th>Is Deleted</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {doctors?.map((item, index) => {
                                                        return (
                                                            <tr key={`schedule${item?.ID}`}>
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
                                                                    {item?.Price}
                                                                </td>
                                                                <td>
                                                                    {item?.DateOfBirth}
                                                                </td>
                                                                <td>
                                                                    {item?.IsDeleted ? "Yes" : "No"}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                                                        <button onClick={() => detailBtn(item)} type="button" className="btn btn-primary pr-btn-detail">Detail</button>
                                                                        <button disabled={item.IsDeleted} onClick={() => deleteBtn(item.ID)} type="button" className="btn btn-danger pr-btn-delete">Delete</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center p-2">
                                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            <DoctorForm show={show2} setShow={setShow2} fetchData={fetchDataDoctor} doctor={selectedDoctor} setDoctor={setSelectedDoctor} speciality={speciality} degree={degree} clinic={clinic} />
        </div >
    )
}

export default AdminDoctorManagement