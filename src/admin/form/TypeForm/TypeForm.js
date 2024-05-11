import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { createHealthcareType, updateHealthcareType } from '../../../service/healthcareService';

// props.show
// props.setShow
// props.fetchData

// props.obj
// props.setObj


const TypeForm = (props) => {

    const [tempObj, setTempObj] = useState()

    const handleCreate = () => {
        if (!_.isEmpty(tempObj?.Name)) {
            createHealthcareType(tempObj).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
            })
            closeForm();
        } else {
            setTempObj()
            toast.error("Please fill required fields");
        }
    }

    const handleUpdate = () => {
        if (!_.isEmpty(tempObj?.Name)) {
            updateHealthcareType(tempObj).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
            })
            closeForm();
        } else {
            toast.error("Please fill required fields");
        }
    }

    const closeForm = () => {
        props.setShow(false);
        props.setObj(null)
        setTempObj(null)
    }

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setTempObj(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        if (!_.isEmpty(props.obj)) {
            setTempObj(props.obj)
        } else {
            setTempObj(null)
        }
    }, [props.obj])

    return (
        <>
            <Modal show={props.show} onHide={() => closeForm()} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Healthcare Type Infomation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">
                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>ID</Form.Label>
                            <Form.Control disabled type="text" placeholder="ID_Auto_Increment" name="ID" value={tempObj?.ID} onChange={onInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="" name="Name" value={tempObj?.Name} onChange={onInputChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-3">
                            {
                                <>
                                    <Button variant="primary" type="button" className='btn btn-danger' onClick={() => closeForm()} >
                                        Cancel
                                    </Button>
                                    {
                                        _.isEmpty(props.obj) ? (
                                            <Button variant="primary" type="button" className='btn btn-primary' onClick={() => handleCreate()}>
                                                Create
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="primary" type="button" className='btn btn-primary' onClick={() => handleUpdate()}>
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
        </>
    )
}

export default TypeForm











// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import _ from 'lodash';

// // props.show
// // props.setShow
// // props.fetchData

// // props.obj
// // props.setObj


// const SpecialityForm = (props) => {

//     const [tempObj, setTempObj] = useState()

//     const handleCreate = () => {
//         if (!_.isEmpty(tempObj)) {
//             create(tempObj).then((e) => {
//                 if (e.data.code === 0) {
//                     toast.success(e.data.message);
//                 } else {
//                     toast.error(e.data.message);
//                 }
//                 props.fetchData()
//             })
//             closeForm();
//         } else {
//             setTempObj()
//             //toast
//         }
//     }

//     const handleUpdate = () => {
//         if (!_.isEmpty(tempObj)) {
//             update(tempObj).then((e) => {
//                 if (e.data.code === 0) {
//                     toast.success(e.data.message);
//                 } else {
//                     toast.error(e.data.message);
//                 }
//                 props.fetchData()
//             })
//             closeForm();
//         } else {
//             // toast
//         }
//     }

//     const closeForm = () => {
//         props.setShow(false);
//         props.setObj(null)
//         setTempObj(null)
//     }

//     // input change
//     const onInputChange = e => {
//         const { name, value } = e.target;
//         setTempObj(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     }

//     useEffect(() => {
//         if (!_.isEmpty(props.obj)) {
//             setTempObj(props.obj)
//         } else {
//             setTempObj(null)
//         }
//     }, [props.obj])

//     return (
//         <>
//             <Modal show={props.show} onHide={() => closeForm()} size="lg" centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Speciality Infomation</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form className="row">
//                         <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
//                             <Form.Label>ID</Form.Label>
//                             <Form.Control aria-disabled type="text" placeholder="ID_Auto_Increment" name="ID" value={tempObj?.ID} onChange={onInputChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
//                             <Form.Label>Name</Form.Label>
//                             <Form.Control  type="text" placeholder="" name="Name" value={tempObj?.Name} onChange={onInputChange} />
//                         </Form.Group>

//                         <div className="d-flex justify-content-end gap-3">
//                             {
//                                 <>
//                                     <Button variant="primary" type="button" className='btn-cancel' onClick={() => closeForm()} >
//                                         Cancel
//                                     </Button>
//                                     {
//                                         _.isEmpty(props.obj) ? (
//                                             <Button variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
//                                                 Create
//                                             </Button>
//                                         ) : (
//                                             <>
//                                                 <Button variant="primary" type="button" className='btn-create' onClick={() => handleUpdate()}>
//                                                     Save
//                                                 </Button>
//                                             </>
//                                         )
//                                     }
//                                 </>
//                             }
//                         </div>
//                     </Form>
//                 </Modal.Body>
//             </Modal>
//         </>
//     )
// }

// export default SpecialityForm