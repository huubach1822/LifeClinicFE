import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import './PatientForm.scss';
import { createPatient, updatePatient } from '../../service/patientService';
import dayjs from 'dayjs';
import _ from 'lodash';
import { validateEmpty } from '../../util/validate';

// props.show
// props.setShow
// props.fetchData
// pros.viewOnly

// props.patient
// props.setPatient

const ethnicityList = ["Kinh", "Tày", "Thái", "Mường", "Miên", "Hoa", "Nùng", "H'Mông", "Dao", "Gia Rai", "Ê Đê", "Ba Na", "Sán Chay", "Chăm", "Kơ Ho", "Xơ Đăng", "Sán Dìu", "Hrê", "Ra Glai", "Mnông", "Thổ", "Stiêng", "Khơ mú", "Bru - Vân Kiều", "Cơ Tu", "Giáy", "Tà Ôi", "Мạ", "Giẻ-Triêng", "Co", "Chơ Ro", "Xinh Mun", "Hà Nhì", "Chu Ru", "Lào", "La Chí", "Kháng", "Phù Lá", "La Hủ", "La Ha", "Pà Thẻn", "Lự", "Ngái", "Chứt", "Lô Lô", "Mảng", "Cơ Lao", "Bố Y", "Cống", "Si La", "Pu Péo", "Rơ Măm", "Brâu", "Ơ Đu"]

const PatientForm = (props) => {

    const account = useSelector(state => state.accountSlice.account)
    const [editMode, setEditMode] = useState(false);
    const [patient, setPatient] = useState({
        Name: "",
        DateOfBirth: null,
        Email: "",
        Gender: "Male",
        Phone: "",
        Address: "",
        Health_insurance_code: "",
        Ethnicity: ethnicityList[0],
        Citizen_id_number: "",
        ID_account: ""
    });

    const handleCreate = () => {
        if (validateEmpty(patient, ["Name", "DateOfBirth", "Email", "Gender", "Phone", "Address", "Health_insurance_code", "Ethnicity", "Citizen_id_number"])) {
            patient.ID_account = account.ID
            patient.DateOfBirth = dayjs(patient.DateOfBirth).format('MM-DD-YYYY')
            patient.IsDeleted = false
            createPatient(patient).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
            })
            closeForm();
        } else {
            toast.error("Please fill required fields")
            setPatient({
                Name: "",
                DateOfBirth: null,
                Email: "",
                Gender: "Male",
                Phone: "",
                Address: "",
                Health_insurance_code: "",
                Ethnicity: ethnicityList[0],
                Citizen_id_number: "",
                ID_account: ""
            })
        }
    }

    const handleUpdate = () => {
        if (validateEmpty(patient, ["Name", "DateOfBirth", "Email", "Gender", "Phone", "Address", "Health_insurance_code", "Ethnicity", "Citizen_id_number"])) {
            patient.DateOfBirth = dayjs(patient.DateOfBirth).format('MM-DD-YYYY')
            updatePatient(patient).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
            })
            closeForm();
        } else {
            toast.error("Please fill required fields")
        }
    }

    const closeForm = () => {
        props.setShow(false);
        props.setPatient(null)
        setEditMode(false)
        setPatient({
            Name: "",
            DateOfBirth: null,
            Email: "",
            Gender: "Male",
            Phone: "",
            Address: "",
            Health_insurance_code: "",
            Ethnicity: ethnicityList[0],
            Citizen_id_number: "",
            ID_account: ""
        })
    }

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setPatient(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        if (!_.isEmpty(props.patient)) {
            setPatient({ ...props.patient, DateOfBirth: dayjs(props.patient.DateOfBirth) })
        } else {
            setPatient({
                Name: "",
                DateOfBirth: null,
                Email: "",
                Gender: "Male",
                Phone: "",
                Address: "",
                Health_insurance_code: "",
                Ethnicity: ethnicityList[0],
                Citizen_id_number: "",
                ID_account: ""
            })
        }
    }, [props.patient])

    return (
        <>
            <Modal show={props.show} onHide={() => closeForm()} size="lg" centered id="patient-form">
                <Modal.Header closeButton>
                    <Modal.Title>Patient Infomation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">
                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control disabled={!editMode && !_.isEmpty(props.patient)} type="text" placeholder="" name="Name" value={patient.Name} onChange={onInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6 flex-column d-flex" controlId="formBasicEmail">
                            <Form.Label>DateOfBirth</Form.Label>
                            <DatePicker disabled={!editMode && !_.isEmpty(props.patient)} value={patient.DateOfBirth} onChange={(newValue) => setPatient({ ...patient, DateOfBirth: newValue })} slotProps={{ textField: { size: 'small' } }} format="MM-DD-YYYY" />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control disabled={!editMode && !_.isEmpty(props.patient)} type="text" placeholder="" name="Email" value={patient.Email} onChange={onInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select disabled={!editMode && !_.isEmpty(props.patient)} aria-label="Default select example" name="Gender" value={patient.Gender} onChange={onInputChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control disabled={!editMode && !_.isEmpty(props.patient)} type="number" placeholder="" name="Phone" value={patient.Phone} onChange={onInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Health Insurance Code</Form.Label>
                            <Form.Control disabled={!editMode && !_.isEmpty(props.patient)} type="text" placeholder="" name="Health_insurance_code" value={patient.Health_insurance_code} onChange={onInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Ethnicity</Form.Label>
                            <Form.Select disabled={!editMode && !_.isEmpty(props.patient)} aria-label="Default select example" name="Ethnicity" value={patient.Ethnicity} onChange={onInputChange} >
                                {ethnicityList.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Citizen ID Number</Form.Label>
                            <Form.Control disabled={!editMode && !_.isEmpty(props.patient)} type="number" placeholder="" name="Citizen_id_number" value={patient.Citizen_id_number} onChange={onInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3 col-12" controlId="formBasicEmail">
                            <Form.Label>Address</Form.Label>
                            <Form.Control disabled={!editMode && !_.isEmpty(props.patient)} type="text" placeholder="" name="Address" value={patient.Address} onChange={onInputChange} />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-3">
                            {
                                props.viewOnly !== true ? (
                                    <>
                                        <Button variant="primary" type="button" className='btn-cancel' onClick={() => closeForm()} >
                                            Cancel
                                        </Button>
                                        {
                                            _.isEmpty(props.patient) ? (
                                                <Button variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
                                                    Create
                                                </Button>
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

export default PatientForm