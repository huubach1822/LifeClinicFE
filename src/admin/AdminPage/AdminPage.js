import "./AdminPage.scss";
import Logo from '../../asset/image/LogoNoWord.png';
import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPager, faHouseChimneyMedical, faBriefcaseMedical, faCalendarWeek, faUser, faKey, faRightFromBracket, faCalendarDays, faStethoscope, faHospitalUser, faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { logoutAccount } from "../../redux/slices/accountSlice"
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2'
import _ from 'lodash'
import { Outlet } from "react-router-dom";
import { doctorDetailRedux, logoutDoctor } from "../../redux/slices/doctorSlice"
import adminImg from '../../asset/adminAsset/businessman_8955333.png'

const AdminPage = () => {

    const [navToggle, setNavToggle] = useState(true);
    const account = useSelector(state => state.accountSlice.account)
    const doctor = useSelector(state => state.doctorSlice.doctor)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { pathname } = useLocation();


    useEffect(() => {
        const fetchDoctor = async () => {
            await dispatch(doctorDetailRedux(account.ID))
        }
        if (account.ID_account_type === 2) {
            fetchDoctor();
        }
    }, []);

    const logoutBtn = () => {
        Swal.fire({
            title: "Are you sure you want to log out?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logoutAccount())
                dispatch(logoutDoctor())
                navigate("/")
            } else if (result.isDenied) {

            }
        });
    }

    return (
        <div className="admin-page">

            {/* <!-- ============================================================== -->
			<!-- 						Topbar Start 							-->
			<!-- ============================================================== --> */}
            <div className="top-bar primary-top-bar">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col bg-color-nav">
                            <span style={{ display: navToggle ? 'flex' : 'none' }} className="admin-logo align-items-center justify-content-center">
                                <h1 className="d-flex align-items-center justify-content-center">
                                    <img alt="" src={Logo} className="logo-icon margin-r-10 lc-logo" />
                                    <div className="logo-text">LifeClinic</div>
                                </h1>
                            </span>
                            {/* <div className="left-nav-toggle" onClick={() => setNavToggle(!navToggle)}>
                                <div className="nav-collapse"><i className="fa fa-bars"></i></div>
                            </div> */}
                            <div style={{ cursor: 'pointer' }} className="left-nav-collapsed" onClick={() => setNavToggle(!navToggle)}>
                                <a className="nav-collapsed"><i className="fa fa-bars"></i></a>
                            </div>
                            {/* <div className="search-form hidden-xs">
                                <form>
                                    <input className="form-control" placeholder="Search for..." type="text" /> <button className="btn-search" type="button"><i className="fa fa-search"></i></button>
                                </form>
                            </div> */}
                            <ul className="list-inline top-right-nav">
                                {/* <li className="dropdown icons-dropdown d-none-m">
                                    <a data-toggle="dropdown" href="#"><i className="fa fa-envelope"></i>
                                        <div className="notify setpos"> <span className="heartbit"></span> <span className="point"></span> </div>
                                    </a>

                                    <ul className="dropdown-menu top-dropdown lg-dropdown notification-dropdown">
                                        <li>
                                            <div className="dropdown-header">
                                                <a className="float-right" href="#"><small>View All</small></a> Messages
                                            </div>

                                            <div className="scrollDiv">
                                                <div className="notification-list">
                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <img alt="" className="rounded-circle" src="assets/img/avtar-2.png" width="50" />
                                                        </span>
                                                        <span className="notification-title">
                                                            John Doe
                                                            <label className="label label-warning float-right">Support</label>
                                                        </span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <img alt="" className="rounded-circle" src="assets/img/avtar-3.png" width="50" />
                                                        </span>
                                                        <span className="notification-title">
                                                            Govindo Doe
                                                            <label className="label label-warning float-right">Support</label>
                                                        </span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <img alt="" className="rounded-circle" src="assets/img/avtar-4.png" width="50" />
                                                        </span>
                                                        <span className="notification-title">
                                                            Megan Doe
                                                            <label className="label label-warning float-right">Support</label>
                                                        </span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <img alt="" className="rounded-circle" src="assets/img/avtar-5.png" width="50" />
                                                        </span>
                                                        <span className="notification-title">
                                                            Hritik Doe
                                                            <label className="label label-warning float-right">Support</label>
                                                        </span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown icons-dropdown d-none-m">
                                    <a data-toggle="dropdown" href="#"><i className="fa fa-bell"></i>
                                        <div className="notify setpos"> <span className="heartbit"></span> <span className="point"></span> </div>
                                    </a>
                                    <ul className="dropdown-menu top-dropdown lg-dropdown notification-dropdown">
                                        <li>
                                            <div className="dropdown-header">
                                                <a className="float-right" href="#"><small>View All</small></a> Notifications
                                            </div>
                                            <div className="scrollDiv">
                                                <div className="notification-list">

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <i className="icon-cloud-upload text-primary"></i>
                                                        </span>
                                                        <span className="notification-title">Upload Complete</span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <i className="icon-info text-warning"></i>
                                                        </span>
                                                        <span className="notification-title">Storage Space low</span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <i className="icon-check text-success"></i>
                                                        </span>
                                                        <span className="notification-title">Project Task Complete</span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                    <a className="clearfix" >
                                                        <span className="notification-icon">
                                                            <i className=" icon-graph text-danger"></i>
                                                        </span>
                                                        <span className="notification-title">CPU Usage</span>
                                                        <span className="notification-description">Lorem Ipsum is simply dummy text of the printing.</span>
                                                        <span className="notification-time">15 minutes ago</span>
                                                    </a>

                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown">
                                    <a className="right-sidebar-toggle d-none-m" ><i className="fa fa-align-right"></i></a>
                                </li> */}
                                <li className="dropdown avtar-dropdown">
                                    <a data-toggle="dropdown" href="#">
                                        <img alt="" className="rounded-circle me-2"
                                            src={account?.ID_account_type === 2 ? process.env.REACT_APP_BACKEND_URL + doctor?.Avatar : adminImg}
                                            width="30" height="35" />
                                        {account?.ID_account_type === 2 ? doctor?.Name : account?.Username}
                                    </a>
                                    <ul className="dropdown-menu top-dropdown">
                                        <li>
                                            <a className="dropdown-item" ><i className="icon-bell"></i> Activities</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" ><i className="icon-user"></i> Profile</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" ><i className="icon-settings"></i> Settings</a>
                                        </li>
                                        <li className="dropdown-divider"></li>
                                        <li>
                                            <a className="dropdown-item" ><i className="icon-logout"></i> Logout</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ============================================================== -->
		<!--                        Topbar End                              -->
		<!-- ============================================================== -->
		
		
		<!-- ============================================================== -->
		<!--                        Right Side Start                        -->
		<!-- ============================================================== --> */}
            <nav className="toggle-sidebar" id="right-sidebar-toggle">
                <div className="nano">
                    <div className="nano-content">
                        <div>
                            <ul className="list-inline nav-tab-card clearfix" role="tablist">

                                <li className="active" role="presentation">
                                    <a aria-controls="friends" data-toggle="tab" href="#friends" role="tab">Friends</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="friends" role="tabcard">
                                    <ul className="list-unstyled sidebar-contact-list">
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-success circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-2.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>John Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-success circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-1.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>Govinda Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-danger circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-3.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>Megan Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-success circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-4.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>Hritik Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-success circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-5.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>Bianca Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-success circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-6.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>John Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-success circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-1.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>Govinda Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li className="clearfix">
                                            <a className="media-box" href="#"><span className="float-right"><span className="circle circle-danger circle-lg"></span></span> <span className="float-left">
                                                <img alt="user" className="media-box-object rounded-circle" src="assets/img/avtar-2.png" width="50" /></span>
                                                <span className="media-box-body"><span className="media-box-heading"><strong>Megan Doe</strong><br />
                                                    <small className="text-muted">Designer</small></span></span></a>
                                        </li>
                                        <li>
                                            <div className=" text-center">
                                                <a className="btn btn-teal" title="See more contacts">Load more..</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* <!-- ============================================================== -->
		<!--                        Right Side End                          -->
		<!-- ============================================================== -->
		

        <!-- ============================================================== -->
		<!-- 						Navigation Start 						-->
		<!-- ============================================================== --> */}
            <div style={{ display: navToggle ? 'block' : 'none' }} className="main-sidebar-nav default-navigation">
                <div className="nano">
                    <div className="nano-content sidebar-nav">

                        <div className="card-body border-bottom text-center nav-profile">
                            {/* <div className="notify setpos"> <span className="heartbit"></span> <span className="point"></span> </div> */}
                            <img alt="profile" className="margin-b-10  " src={account?.ID_account_type === 2 ? process.env.REACT_APP_BACKEND_URL + doctor?.Avatar : adminImg} width="100" height="95" />
                            <p className="lead margin-b-0 toggle-none">{account?.ID_account_type === 2 ? doctor?.Name : account?.Username}</p>
                            <p className="text-muted mv-0 toggle-none">Welcome {account?.ID_account_type === 2 ? "Doctor!" : "Admin!"}</p>
                        </div>

                        <ul className="metisMenu nav flex-column" id="menu">
                            <li className="nav-heading"><span>MAIN</span></li>
                            {account?.ID_account_type === 2 ?
                                <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/dashbroadDoc' ? ' active' : '')} onClick={() => navigate('/admin/dashbroadDoc')}>
                                    <a className="nav-link"><i className="fa fa-home"></i> <span className="toggle-none">Dashboard</span></a>
                                </li>
                                :
                                <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/adminDashbroad' ? ' active' : '')} onClick={() => navigate('/admin/adminDashbroad')}>
                                    <a className="nav-link"><i className="fa fa-home"></i> <span className="toggle-none">Dashboard</span></a>
                                </li>
                            }
                            {account?.ID_account_type === 2 &&
                                <>
                                    <li className="nav-heading"><span>APPOINTMENT SCHEDULE</span></li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/appointmentSchedule' ? ' active' : '')} onClick={() => navigate('/admin/appointmentSchedule')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faCalendarDays} className="me-3" /> <span className="toggle-none">Schedule Availability</span></a>
                                    </li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/bookingStatus' ? ' active' : '')} onClick={() => navigate('/admin/bookingStatus')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faStethoscope} className="me-3" /> <span className="toggle-none">Booking Management</span></a>
                                    </li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/patientManagement' ? ' active' : '')} onClick={() => navigate('/admin/patientManagement')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faHospitalUser} className="me-3" /> <span className="toggle-none">Patient Management</span></a>
                                    </li>
                                </>
                            }
                            {account?.ID_account_type === 3 &&
                                <>
                                    <li className="nav-heading"><span>ADMINISTRATOR</span></li>

                                    {/* <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/adminAppointmentSchedule' ? ' active' : '')} onClick={() => navigate('/admin/adminAppointmentSchedule')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faCalendarDays} className="me-3" /> <span className="toggle-none">Doctor Schedule</span></a>
                                    </li> */}

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/adminHealthcareSchedule' ? ' active' : '')} onClick={() => navigate('/admin/adminHealthcareSchedule')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faCalendarDays} className="me-3" /> <span className="toggle-none">Healthcare Schedule</span></a>
                                    </li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/adminBookingStatus' ? ' active' : '')} onClick={() => navigate('/admin/adminBookingStatus')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faStethoscope} className="me-3" /> <span className="toggle-none">Booking Management</span></a>
                                    </li>
                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/AdminPatientManagement' ? ' active' : '')} onClick={() => navigate('/admin/AdminPatientManagement')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faHospitalUser} className="me-3" /> <span className="toggle-none">Patient Management</span></a>
                                    </li>
                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/AdminDoctorManagement' ? ' active' : '')} onClick={() => navigate('/admin/AdminDoctorManagement')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faUserDoctor} className="me-3" /> <span className="toggle-none">Doctor Management</span></a>
                                    </li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/AdminHealthcareManagement' ? ' active' : '')} onClick={() => navigate('/admin/AdminHealthcareManagement')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faBriefcaseMedical} className="me-3" /> <span className="toggle-none">Healthcare Management</span></a>
                                    </li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/AdminClinicManagement' ? ' active' : '')} onClick={() => navigate('/admin/AdminClinicManagement')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faHouseChimneyMedical} className="me-3" /> <span className="toggle-none">Clinic Management</span></a>
                                    </li>

                                    <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/AdminBlogManagement' ? ' active' : '')} onClick={() => navigate('/admin/AdminBlogManagement')}>
                                        <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faPager} className="me-3" /> <span className="toggle-none">Blog Management</span></a>
                                    </li>
                                </>
                            }
                            <li className="nav-heading"><span>ACCOUNT MANAGEMENT</span></li>
                            {account?.ID_account_type === 2 &&
                                <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/doctorInfo' ? ' active' : '')} onClick={() => navigate('/admin/doctorInfo')}>
                                    <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faUser} className="me-3" /> <span className="toggle-none">Personal Information</span></a>
                                </li>
                            }
                            <li style={{ cursor: 'pointer' }} className={"nav-item" + (pathname === '/admin/changePassword' ? ' active' : '')} onClick={() => navigate('/admin/changePassword')}>
                                <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faKey} className="me-3" /> <span className="toggle-none">Change Password</span></a>
                            </li>
                            <li style={{ cursor: 'pointer' }} className="nav-item" onClick={() => logoutBtn()}>
                                <a className="nav-link" aria-expanded="false"><FontAwesomeIcon icon={faRightFromBracket} className="me-3" /> <span className="toggle-none">Logout</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- ============================================================== -->
		<!-- 						Navigation End	 						-->
		<!-- ============================================================== -->

			
		<!-- ============================================================== -->
		<!-- 						Content Start	 						-->
		<!-- ============================================================== --> */}

            <div className={navToggle ? '' : 'side-bar-hide'} style={{ marginLeft: navToggle ? '240px' : '0px', paddingTop: '60px', backgroundColor: '#F2F4F6', minHeight: '100vh' }}>
                <Outlet />
            </div>

            <footer className="footer" style={{ marginLeft: navToggle ? '240px' : '0px', textAlign: navToggle ? 'left' : 'center' }}>
                <span>Copyright &copy; 2024 LifeClinic</span>
            </footer>


            {/* <!-- ============================================================== -->
		<!-- 						Content End		 						-->
		<!-- ============================================================== --> */}

        </div >
    )
}
export default AdminPage