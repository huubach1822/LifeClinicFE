import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateBooking } from '../../../service/bookingService';


const EditStatus = (props) => {

    const [status, setStatus] = useState(props.item.Status)
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        setStatus(props.item.Status)
    }, [props.item])

    const handleSave = async () => {
        let res = await updateBooking({ ID: props.item.ID, Status: status, ID_schedule: props.item.ID_schedule })
        if (res.data.code === 0) {
            toast.success(res.data.message)
        } else {
            toast.error(res.data.message)
        }
        console.log(props.queryObject)
        props.fetchData(props.docID, props.queryObject)
        setEdit(!edit)
    }

    return (
        <>
            <div className='d-flex gap-3 align-items-center justify-content-center'>
                <Form.Select value={status} onChange={e => setStatus(e.target.value)} disabled={!edit} style={{ maxWidth: '150px' }} aria-label="Default select example">
                    {/* <option key='blankChoice' hidden value>Select booking status</option> */}
                    <option value="Pending">Pending</option>
                    {/* <option value="Approved">Approved</option> */}
                    <option value="Finished">Finished</option>
                    <option value="Cancelled">Cancelled</option>
                </Form.Select>
                {!edit ?
                    <button disabled={props.item.Status === "Finished" || props.item.Status === "Cancelled"} onClick={() => setEdit(!edit)} className="btn btn-warning" style={{ width: '80px' }}>Edit</button>
                    :
                    <button onClick={handleSave} className="btn btn-danger" style={{ width: '80px' }}>Save</button>
                }
            </div>
        </>
    )
}

export default EditStatus