import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { updateMaxPatient } from '../../../service/scheduleService';

const EditMaxPatient = (props) => {

    const [number, setNumber] = useState()
    const [edit, setEdit] = useState(false)
    const now = dayjs();

    useEffect(() => {
        setNumber(props.item.Max_number)
    }, [props.item])

    const handleSave = async () => {
        if (number <= props.item.Current_number) {
            toast.error("Maximum patient cannot be less than current number of patient")
        } else {
            let res = await updateMaxPatient({ Max_number: number, ID: props.item.ID })
            if (res.data.code === 0) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
            props.fetchData(props.obj)
            setEdit(!edit)
        }
    }

    return (
        <>
            <div className='d-flex gap-3 align-items-center justify-content-center'>
                <Form.Control value={number} onChange={e => setNumber(e.target.value)} disabled={!edit} type="number" min={1} style={{ maxWidth: '70px' }} />
                {!edit ?
                    <button disabled={now.isAfter(dayjs(props.item.Date, 'MM-DD-YYYY'))} onClick={() => setEdit(!edit)} className="btn btn-warning" style={{ width: '80px' }}>Edit</button>
                    :
                    <button onClick={handleSave} className="btn btn-danger" style={{ width: '80px' }}>Save</button>
                }


            </div>
        </>
    )
}

export default EditMaxPatient