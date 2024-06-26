import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { getMedicalResultByID, createMedicalResult, updateMedicalResult, deleteMedicalResult } from '../../../service/bookingService';
import ReactQuill from 'react-quill';
import './ResultForm.scss';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'

const ResultForm = (props) => {

    const [result, setResult] = useState({})
    const [mode, setMode] = useState("")

    const [content, setContent] = useState("")

    const handleCreate = async () => {
        // if (!_.isEmpty(content)) {
        result.Date = dayjs(result.Date).format('YYYY-MM-DD');
        result.ID_booking = props.selectedID;
        result.Result = content;
        createMedicalResult(result).then((e) => {
            if (e.data.code === 0) {
                toast.success(e.data.message);
            } else {
                toast.error(e.data.message);
            }
        })
        closeForm();
        // } else {
        //     toast.error("Please fill required fields")
        // }
    }

    const handleUpdate = () => {
        // if (!_.isEmpty(content)) {
        result.Result = content;
        updateMedicalResult(result).then((e) => {
            if (e.data.code === 0) {
                toast.success(e.data.message);
            } else {
                toast.error(e.data.message);
            }
            closeForm();
        })
        // } else {
        //     toast.error("Please fill required fields")
        // }
    }

    const handleDelete = () => {

        Swal.fire({
            title: "Are you sure you want to delete?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((r) => {
            if (r.isConfirmed) {
                deleteMedicalResult(result.ID).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    closeForm();
                })
            } else if (r.isDenied) {

            }
        });

    }

    const closeForm = () => {
        props.setShow(false);
        props.setSelectedID(null)
        setContent("")
        setResult({})
        setMode("")
    }

    const fetchData = async (id) => {
        let res = await getMedicalResultByID(id);

        if (_.isEmpty(res.data.result)) {
            setResult({})
            setMode("create")
        } else {
            setResult({
                ID: res.data.result.ID,
                Date: res.data.result.Date,
                ID_booking: res.data.result.ID_booking
            });
            setContent(res.data.result.Result)
            setMode("update")
        }
    }

    useEffect(() => {
        // if (props.selectedID != null) {
        fetchData(props.selectedID);
        // } else {
        //     setResult({
        //         ID: "",
        //         Date: "",
        //         Result: "",
        //         ID_booking: ""
        //     })
        // }
    }, [props.selectedID, props.show])


    return (
        <div>
            <Modal show={props.show} onHide={() => closeForm()} centered id="result-form" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Medical Examination Result</Modal.Title>
                    <div style={{ margin: "0px auto", fontSize: "20px" }}>
                        {
                            mode !== "create" &&
                            <div>Updated: {result?.Date} </div>
                        }
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">

                        <ReactQuill
                            readOnly={mode === "view"}
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
                            theme="snow" value={content} onChange={(e) => setContent(e)}
                        />;

                        <div className="d-flex gap-3">
                            {

                                <>
                                    {
                                        mode !== "create" &&
                                        <Button variant="primary" type="button" className='btn-cancel  btn-danger' onClick={() => handleDelete()} >
                                            Delete
                                        </Button>
                                    }
                                    {
                                        mode === "create" ? (
                                            <Button style={{ marginLeft: "auto" }} variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
                                                Create
                                            </Button>
                                        ) : (
                                            <>
                                                <Button style={{ marginLeft: "auto" }} variant="primary" type="button" className='btn-create' onClick={() => handleUpdate()}>
                                                    Save
                                                </Button>

                                            </>
                                        )
                                    }
                                </>

                            }
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ResultForm