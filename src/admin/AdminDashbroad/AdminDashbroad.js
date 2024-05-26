import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faUserDoctor, faKitMedical, faUsers, faHouseChimneyMedical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./AdminDashbroad.scss";
import { useEffect, useState } from "react";
import { statsBooking, statsRevenue } from "../../service/bookingService";
import img from '../../asset/adminAsset/chartbg1.jpg'
import img2 from '../../asset/adminAsset/chartbg2.jpg'
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
import { getTotalAdmin } from "../../service/clinicService";

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
    // const [key, setKey] = useState(5000)
    // const [key2, setKey2] = useState(5000)
    const [doctors, setDoctors] = useState([])
    const [year, setYear] = useState(dayjs())
    const [year2, setYear2] = useState(dayjs())
    const [selectedDoctor, setSelectedDoctor] = useState({
        ID: "all",
        Name: "All",
    })
    const [stats, setStats] = useState({})
    const [revenue, setRevenue] = useState({})
    const [revenue2, setRevenue2] = useState({})
    // const [flag, setFlag] = useState("doctor")
    const [healthCare, setHealthCare] = useState([])
    const [selectedHealthCare, setSelectedHealthCare] = useState({
        ID: "all",
        Name: "All",
    })

    const [totalAll, setTotalAll] = useState({})

    const fetchData = async () => {
        let res2 = await statsRevenue(selectedDoctor.ID, year.format('YYYY'), "doctor");
        setRevenue(res2.data.result)
    }

    const fetchData2 = async () => {
        let res2 = await statsRevenue(selectedHealthCare.ID, year2.format('YYYY'), "healthcare");
        setRevenue2(res2.data.result)
    }

    useEffect(() => {

        const getData = async () => {
            const result = await statsBooking("all", year.format('YYYY'), "doctor");
            const result2 = await statsBooking("all", year.format('YYYY'), "healthcare");

            setStats({
                pending: result.data.result.pending + result2.data.result.pending,
                finished: result.data.result.finished + result2.data.result.finished,
                cancelled: result.data.result.cancelled + result2.data.result.cancelled,
                all: result.data.result.all + result2.data.result.all,
            })

            let res3 = await getAllDoctors();
            res3.data.doctors.unshift({ ID: "all", Name: "All" })
            setDoctors(res3.data.doctors)
            let res4 = await getAllHealthcare();
            res4.data.healthcarePackage.unshift({ ID: "all", Name: "All" })
            setHealthCare(res4.data.healthcarePackage)

            let res5 = await getTotalAdmin();
            setTotalAll(res5.data.result)
        }
        getData()
        fetchData()
        fetchData2()
    }, [])

    useEffect(() => {
        fetchData()
    }, [year, selectedDoctor])

    useEffect(() => {
        fetchData2()
    }, [year2, selectedHealthCare])

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

                <div class="row">
                    <div class="col">
                        <div class="widget bg-light padding-0">
                            <div class="row row-table">
                                <div class="col-xs-4 text-center padding-15 bg-primary" style={{ width: "50%" }}>
                                    {/* <em class="icon-bag fa-3x"></em> */}
                                    <FontAwesomeIcon style={{ width: "48px", height: "48px" }} icon={faUserDoctor} />
                                </div>
                                <div class="col-xs-8 padding-15 text-right" style={{ width: "50%" }}>
                                    <h2 class="mv-0" style={{ textAlign: "center" }}>{totalAll?.totalDoctor}</h2>
                                    <div class="margin-b-0 text-muted" style={{ textAlign: "center" }}>Doctor</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="widget bg-light padding-0">
                            <div class="row row-table">
                                <div class="col-xs-4 text-center padding-15 bg-teal" style={{ width: "50%" }}>
                                    <FontAwesomeIcon style={{ width: "48px", height: "48px" }} icon={faKitMedical} />
                                </div>
                                <div class="col-xs-8 padding-15 text-right" style={{ width: "50%" }}>
                                    <h2 class="mv-0" style={{ textAlign: "center" }}>{totalAll?.totalHealthcarePackage}</h2>
                                    <div class="margin-b-0 text-muted" style={{ textAlign: "center" }}>Healthcare</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="widget bg-light padding-0">
                            <div class="row row-table">
                                <div class="col-xs-4 text-center padding-15 bg-success" style={{ width: "50%" }}>
                                    {/* <em class="icon-people fa-3x"></em> */}
                                    <FontAwesomeIcon style={{ width: "48px", height: "48px" }} icon={faUsers} />
                                </div>
                                <div class="col-xs-8 padding-15 text-right" style={{ width: "50%" }}>
                                    <h2 class="mv-0" style={{ textAlign: "center" }}>{totalAll?.totalPatient}</h2>
                                    <div class="margin-b-0 text-muted" style={{ textAlign: "center" }}>Patient</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="widget bg-light padding-0">
                            <div class="row row-table">
                                <div class="col-xs-4 text-center padding-15 bg-indigo" style={{ width: "50%" }}>
                                    <FontAwesomeIcon style={{ width: "48px", height: "48px" }} icon={faHouseChimneyMedical} />
                                </div>
                                <div class="col-xs-8 padding-15 text-right" style={{ width: "50%" }}>
                                    <h2 class="mv-0" style={{ textAlign: "center" }}>{totalAll?.totalClinic}</h2>
                                    <div class="margin-b-0 text-muted" style={{ textAlign: "center" }}>Clinic</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                    <div style={{ width: `${stats.pending / stats.all * 100}%`, backgroundColor: "#FF7800" }} className="progress margin-b-10  progress-mini">
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
                                    <div style={{ width: `${stats.finished / stats.all * 100}%`, backgroundColor: "#2ECD6E" }} className="progress margin-b-10  progress-mini">
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
                                    <div style={{ width: `${stats.cancelled / stats.all * 100}%`, backgroundColor: "#FC6161" }} className="progress margin-b-10  progress-mini">
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
                                    <div style={{ fontSize: "25px" }}>Doctor Income Overview</div>
                                    <p className="text-white" style={{ fontSize: "18px" }}>Total income is {revenue?.revenue} VND</p>
                                </div>
                                <div className="d-flex gap-3">
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
                                    <DatePicker views={['year']} value={year} onChange={(e) => setYear(e)} maxDate={dayjs()} />
                                </div>
                            </div>
                            <div className="card-body" style={{ paddingTop: 0 }}>
                                <div>
                                    <LineChart
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                        series={[
                                            {
                                                data: Object.values(!_.isEmpty(revenue) ? revenue?.totalPerMonth : {}),
                                                color: '#FFFFFF'
                                            },
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

                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-chart" style={{ backgroundImage: `url(${img2})`, backgroundSize: "cover" }}>
                            <div className="card-header text-white d-flex justify-content-between align-items-center">
                                <div>
                                    <div style={{ fontSize: "25px" }}>Healthcare Package Income Overview</div>
                                    <p className="text-white" style={{ fontSize: "18px" }}>Total income is {revenue2?.revenue} VND</p>
                                </div>
                                <div className="d-flex gap-3">
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
                                    <DatePicker views={['year']} value={year2} onChange={(e) => setYear2(e)} maxDate={dayjs()} />
                                </div>
                            </div>
                            <div className="card-body" style={{ paddingTop: 0 }}>
                                <div>
                                    <LineChart
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                        series={[
                                            {
                                                data: Object.values(!_.isEmpty(revenue2) ? revenue2?.totalPerMonth : {}),
                                                color: '#FFFFFF'
                                            },
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