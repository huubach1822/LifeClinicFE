import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./DashbroadDoc.scss";
import { useEffect, useState } from "react";
import { statsBooking, statsRevenue } from "../../../service/bookingService";
import { useSelector } from "react-redux"
import img from '../../../asset/adminAsset/world-map.png'
import { LineChart } from '@mui/x-charts/LineChart';
import _ from 'lodash'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const DashboardDoc = () => {

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

    const [key, setKey] = useState(6000)
    const [year, setYear] = useState(dayjs())
    const account = useSelector(state => state.accountSlice.account)
    const [stats, setStats] = useState({})
    const [revenue, setRevenue] = useState({})

    const fetchData = async () => {
        const result = await statsBooking(account.doctors[0].ID, year.format('YYYY'));
        setStats(result.data.result)
        let res2 = await statsRevenue(account.doctors[0].ID, year.format('YYYY'));
        setRevenue(res2.data.result)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchData().then(() => setKey(key + 1))
    }, [year])

    return (
        <div className="dashboardDoc">

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
                                    <div style={{ fontSize: "25px" }}>Salary Overview</div>
                                    <p className="text-white" style={{ fontSize: "18px" }}>Your total salary is {revenue?.revenue} VND</p>
                                </div>
                                <DatePicker views={['year']} value={year} onChange={(e) => setYear(e)} maxDate={dayjs()} />
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

export default DashboardDoc