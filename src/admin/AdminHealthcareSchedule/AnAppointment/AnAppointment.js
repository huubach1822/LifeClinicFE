import './AnAppointment.scss'
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getHealthcareDetail } from '../../../service/healthcareService';
import { getHealthcareScheduleByDate } from '../../../service/scheduleService';
import { getAllTimeType, createScheduleForHealthcare } from '../../../service/scheduleService';
import Form from 'react-bootstrap/Form';
import _ from 'lodash'
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getAllHealthcare } from "../../../service/healthcareService";
import Box from '@mui/material/Box';
import tempLogo from "../../../asset/image/Healthcarepackage/tempLogo.webp";

const AnAppointment = (props) => {

    const [healthcareDetail, setHealthcareDetail] = useState()
    const [timeType, setTimeType] = useState([]);
    const [timeSchedule, setTimeSchedule] = useState([]);
    const [maxPatient, setMaxPatient] = useState(5);
    const [selectedTime, setSelectedTime] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const minDate = dayjs().add(1, 'day');
    const maxDate = dayjs().add(1, 'month').endOf('month');
    const [healthcareList, setHealthcareList] = useState([])
    const [selectedHealthcare, setSelectedHealthcare] = useState()

    const fetchData = async () => {
        let res = await getHealthcareDetail(selectedHealthcare?.ID);
        setHealthcareDetail(res.data.healthcareDetail);
        let res2 = await getAllTimeType();
        setTimeType(res2.data.timeType);
        props.fetchData(props.queryObject)
    }

    useEffect(() => {
        const getData = async () => {
            let res3 = await getAllHealthcare();
            setHealthcareList(res3.data.healthcarePackage)
        }
        getData();
        fetchData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchData().then(() => {
            onChangeDTP(selectedDate).then()
        })

    }, [selectedHealthcare])

    const onChangeDTP = async (newValue) => {
        if (!_.isEmpty(dayjs(newValue))) {
            let res = await getHealthcareScheduleByDate(selectedHealthcare?.ID, dayjs(newValue).format('MM-DD-YYYY'));
            setTimeSchedule(res.data.timeSchedule)
        } else {
            setTimeSchedule([])
        }
    }

    useEffect(() => {
        onChangeDTP(selectedDate)
    }, [selectedDate])

    const handleChange = (event) => {
        setSelectedTime({ ...selectedTime, [event.target.name]: event.target.checked });
    }

    const confirmBtn = () => {
        for (const property in selectedTime) {
            if (selectedTime[property] === false) {
                delete selectedTime[property]
            }
        }
        if (_.isEmpty(dayjs(selectedDate))) {
            toast.error('Please choose a date!')
        } else if (Math.sign(maxPatient) !== 1) {
            toast.error('The maximum number of patients must be a positive number!')
        } else if (_.isEmpty(selectedTime)) {
            toast.error('Please select time for appointment!')
        } else {
            let data = {
                ID_healthcare: healthcareDetail.ID,
                Date: dayjs(selectedDate).format('MM-DD-YYYY'),
                Max_number: maxPatient,
                Time_type_arr: Object.keys(selectedTime),
            }
            createScheduleForHealthcare(data).then(res => {
                if (res.data.code === 1) {
                    toast.error(res.data.message)
                } else {
                    toast.success(res.data.message)
                }
                fetchData().then(
                    setSelectedTime({}),
                    onChangeDTP(selectedDate).then()
                )
            })
        }
    }

    return (
        <div className='an-appointment'>
            <div className="row">
                <div className="col-4 d-flex flex-column gap-3 align-items-center justify-content-center date-picker-parent">
                    <Autocomplete
                        id="country-select-demo"
                        sx={{ width: 300 }}
                        options={healthcareList}
                        autoHighlight
                        disableClearable
                        value={selectedHealthcare}
                        onChange={(e, value) => { setSelectedHealthcare(value) }}
                        getOptionLabel={(option) => option.Name}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                <img
                                    loading="lazy"
                                    width="20"
                                    srcSet={tempLogo}
                                    src={tempLogo}
                                    alt=""
                                />
                                {option.Name}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose a healthcare package"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                    <DatePicker
                        dateFormat="MM-DD-YYYY"
                        selected={selectedDate}
                        onChange={(date) => {
                            if (!_.isEmpty(selectedHealthcare)) {
                                setSelectedDate(date)
                            } else {
                                toast.error('Please choose a healthcare!')
                            }
                        }}
                        inline
                        maxDate={maxDate.format('MM-DD-YYYY')}
                        minDate={minDate.format('MM-DD-YYYY')}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName={(date) => {
                            return healthcareDetail?.healthcareSchedule.includes(dayjs(date).format('MM-DD-YYYY')) ? "availableDate" : ""
                        }}
                    />
                </div>
                <div className="col-8 d-flex flex-column justify-content-between">
                    <div>
                        <div className='title-font'><span className='fw-bold'>Selected Day: </span>{selectedDate !== null ? dayjs(selectedDate).format('MM-DD-YYYY') : ''}</div>
                        <div className='title-font fw-bold mt-3'>Choose Time</div>
                        <div className="time-btn-container mt-2">
                            {timeType?.map((item, index) => {
                                // return <button disabled={timeSchedule?.some((e) => e.time_type.ID === item.ID)} key={index} type="button" className={"btn " + (timeSchedule?.some((e) => e.time_type.ID === item.ID) ? "btn-secondary" : "btn-primary")}>{item.Value}</button>
                                return (
                                    <div key={index} className='checkBoxBtn'>
                                        <div className={"cat action " + (timeSchedule?.some((e) => e.time_type.ID === item.ID) ? "disable-btn" : "")}>
                                            <label>
                                                <input name={item.ID} checked={selectedTime[item.ID]} onChange={handleChange} disabled={selectedDate === null || timeSchedule?.some((e) => e.time_type.ID === item.ID)} type="checkbox" /><span>{item.Value}</span>
                                            </label>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div >
                            <div className='title-font fw-bold mt-3'>Maximum Patient</div>
                            <Form.Control value={maxPatient} onChange={(e) => setMaxPatient(e.target.value)} type="number" min={1} style={{ maxWidth: '70px' }} />
                        </div>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-primary mt-3' onClick={confirmBtn}>Confirm</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AnAppointment