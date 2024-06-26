import axios from "axios";

const createBooking = async (obj) => {
    return await axios.post("createBooking", obj);
}

const getAllBookingByAccount = async (id, status) => {
    return await axios.get(`getAllBookingByAccount/${id}/${status}`);
}

const deleteBooking = async (ID_booking, ID_schedule) => {
    return await axios.delete(`deleteBooking/${ID_booking}/${ID_schedule}`);
}

const getBookingForDoctor = async (id, status, date, time, page) => {
    return await axios.get(`getBookingForDoctor/${id}/${status}/${date}/${time}/${page}`);
}

const updateBooking = async (obj) => {
    return await axios.put("updateBooking", obj);
}

const statsBooking = async (id, flag = "doctor") => {
    return await axios.get(`statsBooking/${id}/${flag}`);
}

const statsRevenue = async (id, year, flag = "doctor") => {
    return await axios.get(`statsRevenue/${id}/${year}/${flag}`);
}

const getBookingForAdmin = async (id, status, date, time, page, flag) => {
    return await axios.get(`getBookingForAdmin/${id}/${status}/${date}/${time}/${page}/${flag}`);
}

const getMedicalResultByID = async (id) => {
    return await axios.get(`getMedicalResultByID/${id}`);
}

const updateMedicalResult = async (obj) => {
    return await axios.put("updateMedicalResult", obj);
}

const createMedicalResult = async (obj) => {
    return await axios.post("createMedicalResult", obj);
}

const deleteMedicalResult = async (id) => {
    return await axios.delete(`deleteMedicalResult/${id}`);
}

export {
    createBooking,
    getAllBookingByAccount,
    deleteBooking,
    getBookingForDoctor,
    updateBooking,
    statsBooking,
    statsRevenue,
    getBookingForAdmin,
    getMedicalResultByID,
    updateMedicalResult,
    createMedicalResult,
    deleteMedicalResult
}