import "./AdminClinicManagement.scss";
import { faAngleRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getAllClinicsPagination, deleteClinicByID, getAllClinics, getClinicImage, deleteClinicImage, createClinicImage } from "../../service/clinicService";
import { Pagination } from "@mui/material";
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import ClinicForm from "../form/ClinicForm/ClinicForm";
import { getAllCity } from "../../service/categoryService";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { useRef } from "react";

const AdminClinicManagement = () => {

    const [clinics, setClinics] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [queryObject, setQueryObject] = useState({
        page: 1,
        queryString: "",
        location: ""
    });

    const [show, setShow] = useState(false);
    const [selectedID, setSelectedID] = useState(null);
    const [city, setCity] = useState()

    const [clinicImage, setClinicImage] = useState([]);

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

    const selectChange = (event) => {
        setQueryObject({
            ...queryObject,
            location: event.target.value,
            page: 1
        })
    };

    const fetchData = async () => {
        const response = await getAllClinicsPagination(queryObject.page, queryObject.queryString, queryObject.location, true);
        setClinics(response.data.data.result);
        setTotalPage(response.data.data.totalPages);
        let res = await getAllCity()
        setCity(res.data.city)
        fetchData2()
    }

    const fetchData2 = async () => {
        const response = await getAllClinics();
        response.data.clinics.unshift({ ID: "all", Name: "All" })
        setClinicList(response.data.clinics);
        const response2 = await getClinicImage(selectedClinic.ID);
        setClinicImage(response2.data.result);
    }

    useEffect(() => {
        fetchData();
    }, [queryObject]);

    useEffect(() => {
        fetchData2();
    }, [selectedClinic]);

    useEffect(() => {
        fetchData();
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
                deleteClinicByID(id).then((result) => {
                    fetchData();
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
        setSelectedID(item)
        setShow(true)
    }

    const deleteImgBtn = async (id) => {
        Swal.fire({
            title: "Are you sure you want to delete?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClinicImage(id).then((result) => {
                    fetchData2();
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

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {

        let formData = new FormData();
        Array.from(event.target.files).forEach((image, index) => {
            formData.append(`images`, image)
        })
        formData.append("clinic", JSON.stringify(selectedClinic))
        createClinicImage(formData).then((result) => {
            if (result.data.code === 0) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
            fetchData2();
        })

    };

    return (
        <div className="admin-clinic-management">
            <ClinicForm show={show} selectedID={selectedID} setShow={setShow} setSelectedID={setSelectedID} fetchData={fetchData} />
            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Clinic Management</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Clinic Management</span>
                    </div>
                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body" >
                                <div className="mt-3">
                                    <div className="d-flex flex-row align-items-center justify-content-between" >
                                        <div className="as-title" >
                                            Clinic List
                                        </div>
                                        <div className="d-flex flex-row justify-content-end align-items-center gap-3">
                                            <Select
                                                style={{ width: '200px' }}
                                                value={queryObject.location}
                                                onChange={selectChange}
                                                displayEmpty
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
                                            <div>Search: </div>
                                            <Form.Control value={queryObject.queryString} onChange={(e) => setQueryObject({ ...queryObject, queryString: e.target.value, page: 1 })} style={{ width: '250px' }} type="text" placeholder="Enter clinic name" />
                                            <button className="btn btn-primary" onClick={() => { setSelectedID(null); setShow(true) }}>Add New</button>
                                        </div>
                                    </div>
                                    <div className="as-table mt-3" style={{ minHeight: '500px' }}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>City</th>
                                                    <th>Is Deleted</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    clinics.map((item, index) => {
                                                        return (
                                                            <tr key={`clinic${item?.ID}`}>
                                                                <td>
                                                                    {item?.ID}
                                                                </td>
                                                                <td>
                                                                    {item?.Name}
                                                                </td>
                                                                <td>
                                                                    {item?.Address}
                                                                </td>
                                                                <td>
                                                                    {item?.city.Name}
                                                                </td>
                                                                <td>
                                                                    {item?.IsDeleted ? "Yes" : "No"}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                                                        <button onClick={() => detailBtn(item.ID)} type="button" className="btn btn-primary pr-btn-detail">Detail</button>
                                                                        <button disabled={item.IsDeleted} onClick={() => deleteBtn(item.ID)} type="button" className="btn btn-danger pr-btn-delete">Delete</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
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

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body" >
                                <div className="mt-3">
                                    <div className="d-flex flex-row align-items-center justify-content-between" >
                                        <div className="as-title" >
                                            Clinic Image
                                        </div>
                                        <div className="d-flex flex-row justify-content-end align-items-center gap-3">
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
                                            <button disabled={selectedClinic.ID === "all"} className="btn btn-primary" onClick={handleButtonClick}>Add Image</button>
                                            <input ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*" type="file" id="myFile" name="filename" />
                                        </div>
                                    </div>
                                    <div className="as-table mt-3" style={{ minHeight: '500px' }}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Clinic</th>
                                                    <th>
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            Image
                                                        </div>
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    clinicImage?.map((item, index) => {
                                                        return (
                                                            <tr key={`clinicImg${item?.ID}`}>
                                                                <td>
                                                                    {item?.ID}
                                                                </td>
                                                                <td>
                                                                    {item?.clinic?.Name}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                        <img style={{ maxWidth: '300px', maxHeight: '200px' }} src={process.env.REACT_APP_BACKEND_URL + item.Image}></img>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                                                        <button onClick={() => deleteImgBtn(item.ID)} type="button" className="btn btn-danger pr-btn-delete">Delete</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
};

export default AdminClinicManagement;