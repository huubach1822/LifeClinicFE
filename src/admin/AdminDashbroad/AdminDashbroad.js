import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./AdminDashbroad.scss";
import { useEffect, useState } from "react";
import { statsBooking, statsRevenue } from "../../service/bookingService";
import img from '../../asset/adminAsset/world-map.png'
import { LineChart } from '@mui/x-charts/LineChart';
import _ from 'lodash'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { getAllDoctors } from "../../service/doctorService";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getAllHealthcare } from "../../service/healthcareService";
import tempLogo from "../../asset/image/Healthcarepackage/tempLogo.webp";

const AdminDashbroad = () => {

    const xLabels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const [key, setKey] = useState(5000)
    const [doctors, setDoctors] = useState([])
    const [year, setYear] = useState(dayjs())
    const [selectedDoctor, setSelectedDoctor] = useState({
        ID: "all",
        Name: "All",
    })
    const [stats, setStats] = useState({})
    const [revenue, setRevenue] = useState({})
    const [flag, setFlag] = useState("doctor")
    const [healthCare, setHealthCare] = useState([])
    const [selectedHealthCare, setSelectedHealthCare] = useState({
        ID: "all",
        Name: "All",
    })

    const fetchData = async () => {

        var id = null
        if (flag === "doctor") {
            id = selectedDoctor.ID
        } else {
            id = selectedHealthCare.ID
        }

        const result = await statsBooking(id, year.format('YYYY'), flag);
        setStats(result.data.result)
        let res2 = await statsRevenue(id, year.format('YYYY'), flag);
        setRevenue(res2.data.result)

        let res3 = await getAllDoctors();
        res3.data.doctors.unshift({ ID: "all", Name: "All" })
        setDoctors(res3.data.doctors)
        let res4 = await getAllHealthcare();
        res4.data.healthcarePackage.unshift({ ID: "all", Name: "All" })
        setHealthCare(res4.data.healthcarePackage)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchData().then(() => setKey(key + 1))
    }, [year, selectedDoctor, flag, selectedHealthCare])

    return (
        <div className="admin-dashbroad">

            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Dashboard</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Dashboard</span>
                    </div>

                </div>
            </div>

            <section className="main-content">
                <div className="row w-no-padding margin-b-30">

                    <div className="col-md-4">
                        <div className="widget  bg-light">
                            <div className="row-table ">
                                <div className="margin-b-30">
                                    <h2 className="margin-b-5">Pending Appointment</h2>
                                    <div className="d-flex flex-row align-items-center justify-content-between">
                                        <p className="text-muted" style={{ margin: 0, padding: 0 }}>Total</p>
                                        <span style={{ margin: 0, padding: 0, color: "#FF7800" }} className="float-right widget-r-m">{stats.pending}</span>
                                    </div>
                                </div>
                                <div className="progress margin-b-10  progress-mini">
                                    <div key={key} style={{ width: `${stats.pending / stats.all * 100}%`, backgroundColor: "#FF7800" }} className="progress margin-b-10  progress-mini">
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <p className="text-muted float-left margin-b-0">Percent</p>
                                    <p className="text-muted float-right margin-b-0">{(stats.all !== 0 ? (stats.pending / stats.all * 100) : 0).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-md-3">
                        <div className="widget  bg-light">
                            <div className="row-table ">
                                <div className="margin-b-30">
                                    <h2 className="margin-b-5">Approved Appointment</h2>
                                    <div className="d-flex flex-row align-items-center justify-content-between">
                                        <p className="text-muted" style={{ margin: 0, padding: 0 }}>Total</p>
                                        <span style={{ margin: 0, padding: 0, color: "#2e7df5" }} className="float-right widget-r-m">{stats.approved}</span>
                                    </div>
                                </div>
                                <div className="progress margin-b-10 progress-mini">
                                    <div key={key} style={{ width: `${stats.approved / stats.all * 100}%`, backgroundColor: "#2e7df5" }} className="progress margin-b-10  progress-mini">
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <p className="text-muted float-left margin-b-0">Percent</p>
                                    <p className="text-muted float-right margin-b-0">{(stats.all !== 0 ? stats.approved / stats.all * 100 : 0).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="col-md-4">
                        <div className="widget  bg-light">
                            <div className="row-table ">
                                <div className="margin-b-30">
                                    <h2 className="margin-b-5">Finished Appointment</h2>
                                    <div className="d-flex flex-row align-items-center justify-content-between">
                                        <p className="text-muted" style={{ margin: 0, padding: 0 }}>Total</p>
                                        <span style={{ margin: 0, padding: 0, color: "#2ECD6E" }} className="float-right widget-r-m">{stats.finished}</span>
                                    </div>
                                </div>
                                <div className="progress margin-b-10 progress-mini">
                                    <div key={key} style={{ width: `${stats.finished / stats.all * 100}%`, backgroundColor: "#2ECD6E" }} className="progress margin-b-10  progress-mini">
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <p className="text-muted float-left margin-b-0">Percent</p>
                                    <p className="text-muted float-right margin-b-0">{(stats.all !== 0 ? stats.finished / stats.all * 100 : 0).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="widget  bg-light">
                            <div className="row-table ">
                                <div className="margin-b-30">
                                    <h2 className="margin-b-5">Cancelled Appointment</h2>
                                    <div className="d-flex flex-row align-items-center justify-content-between">
                                        <p className="text-muted" style={{ margin: 0, padding: 0 }}>Total</p>
                                        <span style={{ margin: 0, padding: 0, color: "#FC6161" }} className="float-right widget-r-m">{stats.cancelled}</span>
                                    </div>
                                </div>
                                <div className="progress margin-b-10 progress-mini">
                                    <div key={key} style={{ width: `${stats.cancelled / stats.all * 100}%`, backgroundColor: "#FC6161" }} className="progress margin-b-10  progress-mini">
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <p className="text-muted float-left margin-b-0">Percent</p>
                                    <p className="text-muted float-right margin-b-0">{(stats.all !== 0 ? stats.cancelled / stats.all * 100 : 0).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-chart" style={{ backgroundImage: `url(${img})`, backgroundSize: "cover" }}>
                            <div className="card-header text-white d-flex justify-content-between align-items-center">
                                <div>
                                    <div style={{ fontSize: "25px" }}>Income Overview</div>
                                    <p className="text-white" style={{ fontSize: "18px" }}>Total income is {revenue?.revenue} VND</p>
                                </div>
                                <div className="d-flex gap-3">
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={flag}
                                        label="Filter"
                                        onChange={(e) => setFlag(e.target.value)}
                                        InputLabelProps={{ shrink: false }}
                                    >
                                        <MenuItem value={"doctor"}>Doctor</MenuItem>
                                        <MenuItem value={"healthcare"}>Healthcare Package</MenuItem>
                                    </Select>

                                    {
                                        flag === "doctor" ?
                                            <Autocomplete
                                                id="country-select-demo"
                                                sx={{ width: 300 }}
                                                options={doctors}
                                                autoHighlight
                                                disableClearable
                                                value={selectedDoctor}
                                                onChange={(e, value) => setSelectedDoctor(value)}
                                                getOptionLabel={(option) => option.Name}
                                                renderOption={(props, option) => (
                                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                        <img
                                                            loading="lazy"
                                                            width="20"
                                                            srcSet={process.env.REACT_APP_BACKEND_URL + option.Avatar}
                                                            src={process.env.REACT_APP_BACKEND_URL + option.Avatar}
                                                            alt=""
                                                        />
                                                        {option.Name}
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Choose a doctor"
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                                        }}
                                                    />
                                                )}
                                            />
                                            :
                                            <Autocomplete
                                                id="country-select-demo"
                                                sx={{ width: 300 }}
                                                options={healthCare}
                                                autoHighlight
                                                disableClearable
                                                value={selectedHealthCare}
                                                onChange={(e, value) => setSelectedHealthCare(value)}
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
                                    }

                                    <DatePicker views={['year']} value={year} onChange={(e) => setYear(e)} maxDate={dayjs()} />
                                </div>
                            </div>
                            <div className="card-body" style={{ paddingTop: 0 }}>
                                <div>
                                    <LineChart
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                        series={[
                                            { data: Object.values(!_.isEmpty(revenue) ? revenue?.totalPerMonth : {}) },
                                        ]}
                                        width={1200}
                                        height={400}
                                        sx={{
                                            //change left yAxis label styles
                                            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                                // strokeWidth: "0.4",
                                                fill: "#ffffff"
                                            },
                                            // change all labels fontFamily shown on both xAxis and yAxis
                                            // "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
                                            //     fontFamily: "Roboto",
                                            // },
                                            // change bottom label styles
                                            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                                // strokeWidth: "0.5",
                                                fill: "#ffffff"
                                            },
                                            // bottomAxis Line Styles
                                            "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                                                stroke: "#ffffff",
                                                // strokeWidth: 0.4
                                            },
                                            // leftAxis Line Styles
                                            "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                                                stroke: "#ffffff",
                                                // strokeWidth: 0.4
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default AdminDashbroad