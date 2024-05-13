import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Route, Routes, Outlet } from "react-router-dom";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/en-gb';
import HomePage from "./components/HomePage/HomePage";
import LoginRegisterPage from "./components/LoginRegisterPage/LoginRegisterPage";
import MedicalFacility from "./components/MedicalFacility/MedicalFacility";
import HealthcarePackage from "./components/HealthcarePackage/HealthcarePackage";
import Doctor from "./components/Doctor/Doctor";
import BookingDoctor from "./components/BookingDoctor/BookingDoctor"
import BookingClinic from "./components/BookingClinic/BookingClinic";
import AccountPage from "./components/AccountPage/AccountPage";
import AboutUs from "./components/AboutUs/AboutUs";
import SelectPatient from "./components/SelectPatient/SelectPatient";
import ConfirmPage from "./components/ConfirmPage/ConfirmPage";
import BookingHealthcare from "./components/BookingHealthcare/BookingHealthcare";
import AdminPage from "./admin/AdminPage/AdminPage";
import { useDispatch, useSelector } from "react-redux";
import { setAccount } from "./redux/slices/accountSlice"
import _ from "lodash"
import ChangePassword from "./admin/ChangePassword/ChangePassword";
import DoctorInfo from "./admin/doctor/DoctorInfo/DoctorInfo";
import AppointmentScheduleDoc from "./admin/doctor/AppointmentScheduleDoc/AppointmentScheduleDoc";
import BookingStatus from "./admin/doctor/BookingStatus/BookingStatus";
import DashboardDoc from "./admin/doctor/DashbroadDoc/DashbroadDoc";
import PatientManagement from "./admin/doctor/PatientManagement/PatientManagement";
import Page404 from "./components/Page404/Page404";
import AdminDashbroad from "./admin/AdminDashbroad/AdminDashbroad";
import AdminPatientManagement from "./admin/AdminPatientManagement/AdminPatientManagement";
import AdminBookingStatus from "./admin/AdminBookingStatus/AdminBookingStatus";
import AdminAppointmentSchedule from "./admin/AdminAppointmentSchedule/AdminAppointmentSchedule";
import AdminDoctorManagement from "./admin/AdminDoctorManagement/AdminDoctorManagement";
import AdminHealthcareSchedule from "./admin/AdminHealthcareSchedule/AdminHealthcareSchedule";
import AdminBlogManagement from "./admin/AdminBlogManagement/AdminBlogManagement";
import BlogPage from "./components/BlogPage/BlogPage";
import Blog from "./components/Blog/Blog";
import AdminClinicManagement from "./admin/AdminClinicManagement/AdminClinicManagement";
import ClinicDetail from "./components/ClinicDetail/ClinicDetail";
import BookPage from "./components/BookPage/BookPage";
import BookingClinicHc from "./components/BookingClinic/BookingClinicHc";
import AdminHealthcareManagement from "./admin/AdminHealthcareManagement/AdminHealthcareManagement";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

function UserPage() {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
      <Footer />
      <TawkMessengerReact
        propertyId="6641f8f99a809f19fb304751"
        widgetId="default" />
    </React.Fragment>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {

  const dispatch = useDispatch()
  const account = useSelector(state => state.accountSlice.account)

  useEffect(() => {
    if (!_.isEmpty(localStorage.getItem('user_account'))) {
      let user = JSON.parse(localStorage.getItem('user_account'))
      dispatch(setAccount(user))
    }
  }, []);

  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <ToastContainer
          autoClose={1500}
        />
        <ScrollToTop />
        <Routes>

          <Route path="/login" element={<LoginRegisterPage />} />

          <Route path="/" element={<UserPage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/medicalFacility" element={<MedicalFacility />} />
            <Route path="/healthcareService" element={<HealthcarePackage />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/bookingDoctor/:id" element={<BookingDoctor />} />
            <Route path="/bookingClinic/:id" element={<BookingClinic />} />
            <Route path="/bookingClinicHc/:id" element={<BookingClinicHc />} />
            <Route path="/bookingHealthcare/:id" element={<BookingHealthcare />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/selectPatient" element={<SelectPatient />} />
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blogDetail/:id" element={<Blog />} />
            <Route path="/clinicDetail/:id" element={<ClinicDetail />} />
            <Route path="/bookPage/:name/:id" element={<BookPage />} />
          </Route>

          {account?.ID_account_type === 2 && (
            <>
              <Route path="/admin" element={<AdminPage />} >
                <Route path="/admin/changePassword" element={<ChangePassword />} />
                <Route path="/admin/doctorInfo" element={<DoctorInfo />} />
                <Route path="/admin/appointmentSchedule" element={<AppointmentScheduleDoc />} />
                <Route path="/admin/bookingStatus" element={<BookingStatus />} />
                <Route path="/admin/dashbroadDoc" element={<DashboardDoc />} />
                <Route path="/admin/patientManagement" element={<PatientManagement />} />
              </Route>
            </>
          )}

          {account?.ID_account_type === 3 && (
            <>
              <Route path="/admin" element={<AdminPage />} >
                <Route path="/admin/changePassword" element={<ChangePassword />} />
                <Route path="/admin/adminDashbroad" element={<AdminDashbroad />} />
                <Route path="/admin/adminPatientManagement" element={<AdminPatientManagement />} />
                <Route path="/admin/adminBookingStatus" element={<AdminBookingStatus />} />
                <Route path="/admin/adminAppointmentSchedule" element={<AdminAppointmentSchedule />} />
                <Route path="/admin/adminDoctorManagement" element={<AdminDoctorManagement />} />
                <Route path="/admin/adminHealthcareSchedule" element={<AdminHealthcareSchedule />} />
                <Route path="/admin/adminBlogManagement" element={<AdminBlogManagement />} />
                <Route path="/admin/adminClinicManagement" element={<AdminClinicManagement />} />
                <Route path="/admin/adminHealthcareManagement" element={<AdminHealthcareManagement />} />
              </Route>
            </>
          )}

          <Route path="*" element={<Page404 />} />

        </Routes>
      </LocalizationProvider>
    </div>
  );
}

export default App;
