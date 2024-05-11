import '../AnAppointment/AnAppointment.scss'
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getHealthcareDetail } from '../../../service/healthcareService';
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

const AnAppointment = () => {

    const [healthcareDetail, setHealthcareDetail] = useState()
    const [timeType, setTimeType] = useState([]);
    const [maxPatient, setMaxPatient] = useState(5);
    const [selectedTime, setSelectedTime] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [key, setKey] = useState(1000);
    const minDate = dayjs().add(1, 'day');
    const maxDate = dayjs().add(1, 'month').endOf('month');
    const [healthcareList, setHealthcareList] = useState([])
    const [selectedHealthCare, setSelectedHealthcare] = useState()

    const fetchData = async () => {
        let res = await getHealthcareDetail(selectedHealthCare?.ID);
        setHealthcareDetail(res.data.healthcareDetail);
        console.log(res.data)
        let res2 = await getAllTimeType();
        setTimeType(res2.data.timeType);
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
        fetchData()
    }, [selectedHealthCare])

    useEffect(() => {
        if (endDate === null) {
            setSelectedTime({})
        }
    }, [endDate])

    const handleChange = (event) => {
        setSelectedTime({ ...selectedTime, [event.target.name]: event.target.checked });
    }

    const getListOfDays = (start, end, excludeArr) => {
        // start, end ObjToDate, excludeArr MM-DD-YYYY
        let days = []
        let current = start

        if (_.isEmpty(excludeArr)) {
            while (current !== end) {
                days.push(current)
                current = dayjs(current, "MM-DD-YYYY").add(1, 'day').format("MM-DD-YYYY");
            }
        } else {
            while (current !== end) {
                if (!excludeArr.some((e) => e === current)) {
                    days.push(current)
                }
                current = dayjs(current, "MM-DD-YYYY").add(1, 'day').format("MM-DD-YYYY");
            }
        }

        days.push(end)

        return days
    }

    const confirmBtn = () => {
        for (const property in selectedTime) {
            if (selectedTime[property] === false) {
                delete selectedTime[property]
            }
        }

        if (startDate === null) {
            toast.error('Please choose start date!')
        } else if (endDate === null) {
            toast.error('Please choose end date!')
        } else if (Math.sign(maxPatient) !== 1) {
            toast.error('The maximum number of patients must be a positive number!')
        } else if (_.isEmpty(selectedTime)) {
            toast.error('Please select time for appointment!')
        } else {
            let data = {
                ID_healthcare: healthcareDetail.ID,
                Date_arr: getListOfDays(dayjs(startDate).format('MM-DD-YYYY'), dayjs(endDate).format('MM-DD-YYYY'), healthcareDetail?.healthcareSchedule),
                Max_number: maxPatient,
                Time_type_arr: Object.keys(selectedTime),
            }
            createScheduleForHealthcare(data).then(res => {
                if (res.data.code === 1) {
                    toast.error(res.data.message)
                } else {
                    toast.success(res.data.message)
                }
                fetchData().then()
            })
            setStartDate(null)
            setEndDate(null)
            setSelectedTime({})
            setKey(key + 1)
        }
    }

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };


    return (
        <div className='an-appointment'>
            <div className="row">
                <div className="col-4 d-flex flex-column gap-3 align-items-center justify-content-center date-picker-parent mutil-dp">
                    <Autocomplete
                        id="country-select-demo"
                        sx={{ width: 300 }}
                        options={healthcareList}
                        autoHighlight
                        disableClearable
                        value={selectedHealthCare}
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
                        selected={startDate}
                        onChange={onChange}
                        inline
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={maxDate.format('MM-DD-YYYY')}
                        minDate={minDate.format('MM-DD-YYYY')}
                        showMonthDropdown
                        showYearDropdown
                        selectsRange
                        dropdownMode="select"
                        filterDate={(date) => {
                            return !healthcareDetail?.healthcareSchedule.includes(dayjs(date).format('MM-DD-YYYY'))
                        }}
                        dayClassName={(date) => {
                            return healthcareDetail?.healthcareSchedule.includes(dayjs(date).format('MM-DD-YYYY')) && dayjs(date).isAfter(dayjs()) ? "availableDate" : ""
                        }}
                        key={key}
                    />
                </div>
                <div className="col-8 d-flex flex-column justify-content-between">
                    <div>
                        <div className='title-font'><span className='fw-bold'>Selected Day: </span>{startDate !== null && endDate !== null ? `${dayjs(startDate).format('MM-DD-YYYY')} to ${dayjs(endDate).format('MM-DD-YYYY')}` : ''}</div>
                        <div className='title-font fw-bold mt-3'>Choose Time</div>
                        <div className="time-btn-container mt-2">
                            {timeType?.map((item, index) => {
                                // return <button disabled={timeSchedule?.some((e) => e.time_type.ID === item.ID)} key={index} type="button" className={"btn " + (timeSchedule?.some((e) => e.time_type.ID === item.ID) ? "btn-secondary" : "btn-primary")}>{item.Value}</button>
                                return (
                                    <div key={index} className='checkBoxBtn'>
                                        <div className="cat action">
                                            <label>
                                                <input name={item.ID} checked={selectedTime[item.ID]} onChange={handleChange} disabled={endDate === null} type="checkbox" /><span>{item.Value}</span>
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
                    <div className='d-flex justify-content-end gap-3'>
                        <button className='btn btn-primary mt-3' onClick={confirmBtn}>Confirm</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AnAppointment