import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import './DoctorForm.scss';
import dayjs from 'dayjs';
import _ from 'lodash';
import { validateEmpty } from '../../../util/validate';
import { updateDoctorByID, createdoctor } from '../../../service/doctorService';

// props.show
// props.setShow
// props.fetchData
// pros.viewOnly

// props.doctor
// props.setDoctor

// props.speciality
// props.degree
// props.clinic

function handleError() {
    var img = document.getElementById('imgDoctor');
    if (!img.complete || img.naturalWidth === 0) {
        // Image failed to load, do something (e.g., replace with a placeholder)
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='white' /%3E%3C/svg%3E";
        // Alternatively, you can hide the image altogether:
        // img.style.display = 'none';
    }
}

const DoctorForm = (props) => {

    const [editMode, setEditMode] = useState(false);
    const [doctor, setDoctor] = useState({
        Name: "",
        DateOfBirth: "",
        Phone: "",
        Description: "",
        Gender: "Male",
        Price: "",
        Email: "",
        ID_degree: "",
        ID_speciality: "",
        ID_clinic: ""
    });
    const [account, setAccount] = useState({
        Username: "",
        Password: "",
        ID_account_type: 2
    });

    const handleCreate = () => {
        if (validateEmpty(doctor, ["Name", "DateOfBirth", "Phone", "Description", "Gender", "Price", "Email", "ID_clinic", "ID_speciality", "ID_degree"]) && validateEmpty(account, ["Username", "Password"])) {
            doctor.DateOfBirth = dayjs(doctor.DateOfBirth).format('MM-DD-YYYY')
            if (!_.isEmpty(doctorImage?.name)) {
                let formData = new FormData();
                formData.append("image", doctorImage)
                formData.append("doctor", JSON.stringify(doctor))
                formData.append("account", JSON.stringify(account))
                createdoctor(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    props.fetchData()
                    closeForm();
                })
            } else {
                toast.error("Please choose an image")
            }
        } else {
            toast.error("Please fill required fields")
        }
    }

    const handleUpdate = () => {
        if (validateEmpty(doctor, ["Name", "DateOfBirth", "Phone", "Description", "Gender", "Price", "Email"])) {
            doctor.DateOfBirth = dayjs(doctor.DateOfBirth).format('MM-DD-YYYY')
            if (!_.isEmpty(doctorImage?.name)) {
                doctor.Avatar = null
                let formData = new FormData();
                formData.append("image", doctorImage)
                formData.append("doctor", JSON.stringify(doctor))
                updateDoctorByID(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                })
            } else {
                let updateDoc = _.pick(doctor, ["ID", "Name", "DateOfBirth", "Phone", "Description", "Price", "Gender", "Email", "ID_speciality", "ID_degree", "ID_clinic"])
                let formData = new FormData();
                formData.append("doctor", JSON.stringify(updateDoc))
                updateDoctorByID(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                })
            }
            props.fetchData()
            closeForm();
        } else {
            toast.error("Please fill required fields")
        }
    }

    const closeForm = () => {
        props.setShow(false);
        props.setDoctor(null)
        setEditMode(false)
        setDoctor({})
        setDoctorImage(null)
        setAccount({
            Username: "",
            Password: "",
            ID_account_type: 2
        })
    }

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setDoctor(prev => ({
            ...prev,
            [name]: value
        }));
    }


    const [doctorImage, setDoctorImage] = useState(null);
    const uploadImage = async (e) => {
        setDoctorImage(e.target.files[0]);
    };

    useEffect(() => {
        if (!_.isEmpty(props.doctor)) {
            setDoctor({ ...props.doctor, DateOfBirth: dayjs(props.doctor.DateOfBirth) })
        } else {
            setDoctor({
                Name: "",
                DateOfBirth: "",
                Phone: "",
                Description: "",
                Gender: "",
                Price: "",
                Email: "",
                ID_degree: "",
                ID_speciality: "",
                ID_clinic: ""
            })
        }
    }, [props.doctor, props.show])

    return (
        <>
            <Modal show={props.show} onHide={() => closeForm()} size="xl" centered id="doctor-form">
                <Modal.Header closeButton>
                    <Modal.Title>Doctor Infomation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">

                        <div className='col-4'>

                            {
                                _.isEmpty(props.doctor) &&
                                <Form.Group className="mb-3" style={{ visibility: 'hidden' }}>
                                    <Form.Label>Hidden</Form.Label>
                                    <Form.Control disabled />
                                </Form.Group>
                            }

                            <div className='mb-3 d-flex align-items-center justify-content-center gap-3'>
                                <input disabled={!editMode && !_.isEmpty(props.doctor)} style={{ width: '80px' }} accept="image/*" type="file" id="myFile" name="filename" onChange={uploadImage} />
                                <img id="imgDoctor" alt='' src={_.isEmpty(doctorImage?.name) ?
                                    process.env.REACT_APP_BACKEND_URL + doctor?.Avatar
                                    : URL.createObjectURL(doctorImage)}
                                    onError={() => handleError()} style={{ border: '1px solid #808080', width: '155px', height: '155px', borderRadius: '3px', objectFit: 'cover' }} />
                            </div>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Doctor Fee</Form.Label>
                                <Form.Control disabled={!editMode && !_.isEmpty(props.doctor)} name='Price' type="number" value={doctor?.Price} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Speciality</Form.Label>
                                <Form.Select disabled={!editMode && !_.isEmpty(props.doctor)} name='ID_speciality' value={doctor?.ID_speciality} onChange={onInputChange} >
                                    <option value="" disabled>Please select...</option>
                                    {props?.speciality?.map((item) => {
                                        return <option key={item.ID} value={item.ID}>{item.Name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className='col-4'>

                            {
                                _.isEmpty(props.doctor) &&
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control disabled={!editMode && !_.isEmpty(props.doctor)} name='Username' type="text" value={account.Username} onChange={(e) => { setAccount(prev => ({ ...prev, Username: e.target.value })) }} />
                                </Form.Group>
                            }

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>ID</Form.Label>
                                <Form.Control disabled type="text" value={doctor?.ID} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control disabled={!editMode && !_.isEmpty(props.doctor)} name='Name' type="text" value={doctor?.Name} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control disabled={!editMode && !_.isEmpty(props.doctor)} name='Phone' type="number" value={doctor?.Phone} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3 flex-column d-flex" controlId="formBasicEmail">
                                <Form.Label>DateOfBirth</Form.Label>
                                <DatePicker disabled={!editMode && !_.isEmpty(props.doctor)} value={doctor?.DateOfBirth} name='DateOfBirth' onChange={(newValue) => setDoctor({ ...doctor, DateOfBirth: newValue })} slotProps={{ textField: { size: 'small' } }} format="MM-DD-YYYY" />
                            </Form.Group>
                        </div>

                        <div className='col-4'>

                            {
                                _.isEmpty(props.doctor) &&
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control disabled={!editMode && !_.isEmpty(props.doctor)} name='Password' type="text" value={account.Password} onChange={(e) => { setAccount(prev => ({ ...prev, Password: e.target.value })) }} />
                                </Form.Group>
                            }

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Degree</Form.Label>
                                <Form.Select disabled={!editMode && !_.isEmpty(props.doctor)} name='ID_degree' value={doctor?.ID_degree} onChange={onInputChange} >
                                    <option value="" disabled>Please select...</option>
                                    {props?.degree?.map((item) => {
                                        return <option key={item.ID} value={item.ID}>{item.Name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select disabled={!editMode && !_.isEmpty(props.doctor)} name='Gender' value={doctor?.Gender} onChange={onInputChange}>
                                    <option value="" disabled>Please select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Clinic</Form.Label>
                                <Form.Select disabled={!editMode && !_.isEmpty(props.doctor)} name='ID_clinic' value={doctor?.ID_clinic} onChange={onInputChange} >
                                    <option value="" disabled>Please select...</option>
                                    {props?.clinic?.map((item) => {
                                        return <option key={item.ID} value={item.ID}>{item.Name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control disabled={!editMode && !_.isEmpty(props.doctor)} name='Email' type="text" value={doctor?.Email} onChange={onInputChange} />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3 col-12" controlId="formBasicEmail">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} disabled={!editMode && !_.isEmpty(props.doctor)} name='Description' type="text" value={doctor?.Description} onChange={onInputChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-3">
                            {
                                props.viewOnly !== true ? (
                                    <>
                                        <Button variant="primary" type="button" className='btn-cancel' onClick={() => closeForm()} >
                                            Cancel
                                        </Button>
                                        {
                                            _.isEmpty(props.doctor) ? (
                                                <Button variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
                                                    Create
                                                </Button>
                                            ) : (
                                                <>
                                                    {
                                                        props.doctor.IsDeleted ? (
                                                            <>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {!editMode ? (
                                                                    <Button variant="primary" type="button" className='btn-edit' onClick={() => setEditMode(true)}>
                                                                        Edit
                                                                    </Button>
                                                                )
                                                                    : (
                                                                        <Button variant="primary" type="button" className='btn-create' onClick={() => handleUpdate()}>
                                                                            Save
                                                                        </Button>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DoctorForm