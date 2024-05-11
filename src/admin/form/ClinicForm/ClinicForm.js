import "./ClinicForm.scss"
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import _ from 'lodash';
import ReactQuill from 'react-quill';
import { validateEmpty } from '../../../util/validate';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { createClinic, updateClinic, updateClinicByID } from '../../../service/clinicService';
import { getDoctorByClinic } from '../../../service/doctorService';

function handleError() {
    var img = document.getElementById('imgClinic');
    if (!img.complete || img.naturalWidth === 0) {
        // Image failed to load, do something (e.g., replace with a placeholder)
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='white' /%3E%3C/svg%3E";
        // Alternatively, you can hide the image altogether:
        // img.style.display = 'none';
    }
}

const ClinicForm = (props) => {

    const [editMode, setEditMode] = useState(false);
    const [clinic, setClinic] = useState({

    })
    const [content, setContent] = useState("")
    const [clinicLogo, setClinicLogo] = useState(null);
    const [clinicImage, setClinicImage] = useState([]);
    const [clinicCity, setClinicCity] = useState("");

    const fetchData = async () => {
        let res = await getDoctorByClinic(props.selectedID)
        let tempClinic = res.data.result
        setClinic({
            ...tempClinic,
        })
        setClinicCity(tempClinic.city.Name)
        setContent(tempClinic.Description)
    }

    useEffect(() => {
        if (props.selectedID !== null) {
            fetchData()
        } else {
            setClinic({

            })
        }
    }, [props.selectedID, props.show])

    const uploadLogo = async (e) => {
        setClinicLogo(e.target.files[0]);
    };

    const uploadImage = async (e) => {
        setClinicImage(e.target.files);
    };

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setClinic(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const closeForm = () => {
        props.setShow(false);
        props.setSelectedID(null)
        setEditMode(false)
        setClinic({})
        setClinicImage(null)
        setClinicLogo(null)
        setContent("")
        setClinicCity("")
    }

    const handleCreate = () => {

        // console.log(clinic)
        // console.log(clinicLogo)
        // console.log(clinicImage)
        // console.log(clinicCity)
        // console.log(content)

        if (validateEmpty(clinic, ["Name", "Short_Description", "Longitude", "Latitude", "Address"]) && !_.isEmpty(content) && !_.isEmpty(clinicLogo?.name) && !_.isEmpty(clinicCity) && !_.isEmpty(clinicImage)) {

            clinic.Description = content;
            clinic.CityName = clinicCity;
            let formData = new FormData();

            formData.append("images", clinicLogo)
            Array.from(clinicImage).forEach((image, index) => {
                formData.append(`images`, image)
            })

            formData.append("clinic", JSON.stringify(clinic))

            createClinic(formData).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
                closeForm();
            })

        } else {
            toast.error("Please fill required fields")
        }

    }

    const handleUpdate = () => {

        if (validateEmpty(clinic, ["Name", "Short_Description", "Longitude", "Latitude", "Address"]) && !_.isEmpty(content) && !_.isEmpty(clinicCity)) {

            if (!_.isEmpty(clinicLogo?.name)) {
                clinic.Logo = null
                clinic.Description = content;
                clinic.CityName = clinicCity;
                let formData = new FormData();
                formData.append("image", clinicLogo)
                formData.append("clinic", JSON.stringify(clinic))
                updateClinicByID(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    props.fetchData()
                    closeForm();
                })
            } else {
                let updateClinic = _.pick(clinic, ["ID", "Name", "Address", "Short_Description", "Longitude", "Latitude"])
                updateClinic.Description = content;
                updateClinic.CityName = clinicCity;
                let formData = new FormData();
                formData.append("clinic", JSON.stringify(updateClinic))
                updateClinicByID(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    props.fetchData()
                    closeForm();
                })
            }
        } else {
            toast.error("Please fill required fields")
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={() => closeForm()} size="xl" centered id="clinic-form">
                <Modal.Header closeButton>
                    <Modal.Title>Clinic Infomation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <div className="grid-container-1">

                            <div className='mb-3 d-flex align-items-center justify-content-center gap-3'>
                                <input disabled={!editMode && props.selectedID != null} style={{ width: '80px' }} accept="image/*" type="file" id="myFile" name="filename" onChange={uploadLogo} />
                                <img id="imgClinic" alt='' src={_.isEmpty(clinicLogo?.name) ?
                                    process.env.REACT_APP_BACKEND_URL + clinic?.Logo
                                    : URL.createObjectURL(clinicLogo)}
                                    onError={() => handleError()} style={{ border: '1px solid #808080', width: '155px', height: '155px', borderRadius: '3px', objectFit: 'fill' }} />
                            </div>

                            {
                                props.selectedID == null &&
                                <div className="d-flex gap-3 align-items-center justify-content-center flex-column">
                                    <div className='d-flex gap-3'>
                                        <input multiple disabled={!editMode && props.selectedID != null} style={{ width: '80px' }} accept="image/*" type="file" id="myFile" name="filename" onChange={uploadImage} />
                                        <div>Select multiple images of clinic</div>
                                    </div>
                                    <div style={{ height: '100px', overflowY: 'auto' }}>
                                        {
                                            clinicImage?.length > 0 && Array.from(clinicImage).map((image, index) => {
                                                return (
                                                    <div>
                                                        {image.name}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }

                            <Form.Group className="mb-3 col-12" controlId="formBasicEmail" style={props.selectedID != null ? { gridColumn: 'span 2' } : {}} >
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={4} disabled={!editMode && props.selectedID != null} name='Short_Description' type="text" value={clinic?.Short_Description} onChange={onInputChange} />
                            </Form.Group>

                        </div>

                        <div className="grid-container-2">
                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ height: 'fit-content' }}>
                                <Form.Label>ID</Form.Label>
                                <Form.Control disabled type="text" value={clinic?.ID} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ height: 'fit-content' }}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control disabled={!editMode && props.selectedID != null} name='Name' type="text" value={clinic?.Name} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ height: 'fit-content' }}>
                                <Form.Label>City</Form.Label>
                                <Form.Select disabled={!editMode && props.selectedID != null} value={clinicCity} onChange={(e) => setClinicCity(e.target.value)}>
                                    <option value="" disabled>Please select...</option>
                                    <option value="An Giang">An Giang</option>
                                    <option value="Ba Ria – Vung Tau">Ba Ria – Vung Tau</option>
                                    <option value="Bac Lieu">Bac Lieu</option>
                                    <option value="Bac Giang">Bac Giang</option>
                                    <option value="Bac Kan">Bac Kan</option>
                                    <option value="Bac Ninh">Bac Ninh</option>
                                    <option value="Ben Tre">Ben Tre</option>
                                    <option value="Binh Duong">Binh Duong</option>
                                    <option value="Binh Dinh">Binh Dinh</option>
                                    <option value="Binh Phuoc">Binh Phuoc</option>
                                    <option value="Binh Thuan">Binh Thuan</option>
                                    <option value="Ca Mau">Ca Mau</option>
                                    <option value="Cao Bang">Cao Bang</option>
                                    <option value="Can Tho">Can Tho</option>
                                    <option value="Da Nang">Da Nang</option>
                                    <option value="Dak Lak">Dak Lak</option>
                                    <option value="Dak Nong">Dak Nong</option>
                                    <option value="Dien Bien">Dien Bien</option>
                                    <option value="Dong Nai">Dong Nai</option>
                                    <option value="Dong Thap">Dong Thap</option>
                                    <option value="Gia Lai">Gia Lai</option>
                                    <option value="Ha Giang">Ha Giang</option>
                                    <option value="Ha Nam">Ha Nam</option>
                                    <option value="Ha Noi">Ha Noi</option>
                                    <option value="Ha Tinh">Ha Tinh</option>
                                    <option value="Hai Duong">Hai Duong</option>
                                    <option value="Hai Phong">Hai Phong</option>
                                    <option value="Hau Giang">Hau Giang</option>
                                    <option value="Hoa Binh">Hoa Binh</option>
                                    <option value="Hung Yen">Hung Yen</option>
                                    <option value="Khanh Hoa">Khanh Hoa</option>
                                    <option value="Kien Giang">Kien Giang</option>
                                    <option value="Kon Tum">Kon Tum</option>
                                    <option value="Lai Chau">Lai Chau</option>
                                    <option value="Lang Son">Lang Son</option>
                                    <option value="Lao Cai">Lao Cai</option>
                                    <option value="Lam Dong">Lam Dong</option>
                                    <option value="Long An">Long An</option>
                                    <option value="Nam Dinh">Nam Dinh</option>
                                    <option value="Nghe An">Nghe An</option>
                                    <option value="Ninh Binh">Ninh Binh</option>
                                    <option value="Ninh Thuan">Ninh Thuan</option>
                                    <option value="Phu Tho">Phu Tho</option>
                                    <option value="Phu Yen">Phu Yen</option>
                                    <option value="Quang Binh">Quang Binh</option>
                                    <option value="Quang Nam">Quang Nam</option>
                                    <option value="Quang Ngai">Quang Ngai</option>
                                    <option value="Quang Ninh">Quang Ninh</option>
                                    <option value="Quang Tri">Quang Tri</option>
                                    <option value="Soc Trang">Soc Trang</option>
                                    <option value="Son La">Son La</option>
                                    <option value="Tay Ninh">Tay Ninh</option>
                                    <option value="Thai Binh">Thai Binh</option>
                                    <option value="Thai Nguyen">Thai Nguyen</option>
                                    <option value="Thanh Hoa">Thanh Hoa</option>
                                    <option value="Ho Chi Minh">Ho Chi Minh</option>
                                    <option value="Thua Thien Hue">Thua Thien Hue</option>
                                    <option value="Tien Giang">Tien Giang</option>
                                    <option value="Tra Vinh">Tra Vinh</option>
                                    <option value="Tuyen Quang">Tuyen Quang</option>
                                    <option value="Vinh Long">Vinh Long</option>
                                    <option value="Vinh Phuc">Vinh Phuc</option>
                                    <option value="Yen Bai">Yen Bai</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ height: 'fit-content' }}>
                                <Form.Label>Address</Form.Label>
                                <Form.Control disabled={!editMode && props.selectedID != null} name='Address' type="text" value={clinic?.Address} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ height: 'fit-content' }}>
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control disabled={!editMode && props.selectedID != null} name='Longitude' type="number" value={clinic?.Longitude} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ height: 'fit-content' }}>
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control disabled={!editMode && props.selectedID != null} name='Latitude' type="number" value={clinic?.Latitude} onChange={onInputChange} />
                            </Form.Group>

                        </div>

                        <ReactQuill
                            readOnly={!editMode && props.selectedID != null}
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ size: [] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['link', 'image', 'video'],
                                    ['clean']
                                ],
                            }}
                            theme="snow" value={content} onChange={(e) => setContent(e)} />;

                        <div className="d-flex justify-content-end gap-3">
                            {
                                <>
                                    <Button variant="primary" type="button" className='btn-cancel' onClick={() => closeForm()} >
                                        Cancel
                                    </Button>
                                    {
                                        props.selectedID == null ? (
                                            <Button variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
                                                Create
                                            </Button>
                                        ) : (
                                            <>
                                                {
                                                    clinic.IsDeleted ? (
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
                            }
                        </div>
                    </Form>
                </Modal.Body>
            </Modal >
        </>
    )
}

export default ClinicForm