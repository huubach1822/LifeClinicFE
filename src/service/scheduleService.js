import axios from "axios";

const getAllTimeType = async () => {
    return await axios.get("getAllTimeType");
}

const getDoctorScheduleByDate = async (doctorID, date) => {
    return await axios.get(`getDoctorScheduleByDate/doctorID=${doctorID}&date=${date}`);
}

const getHealthcareScheduleByDate = async (healthcareID, date) => {
    return await axios.get(`getHealthcareScheduleByDate/healthcareID=${healthcareID}&date=${date}`);
}

const createScheduleForDoctor = async (data) => {
    return await axios.post("createScheduleForDoctor", data);
}

const getScheduleForDoctor = async (doctorID, date, page) => {
    return await axios.get(`getScheduleForDoctor/doctorID=${doctorID}&date=${date}&page=${page}`);
}

const updateMaxPatient = async (data) => {
    return await axios.put("updateMaxPatient", data);
}

const deleteSchedule = async (id) => {
    return await axios.delete(`deleteSchedule/${id}`);
}

const createScheduleForHealthcare = async (data) => {
    return await axios.post("createScheduleForHealthcare", data);
}

const getScheduleForHealthcare = async (healthcareID, date, page) => {
    return await axios.get(`getScheduleForHealthcare/healthcareID=${healthcareID}&date=${date}&page=${page}`);
}

export {
    getAllTimeType,
    getDoctorScheduleByDate,
    getHealthcareScheduleByDate,
    createScheduleForDoctor,
    getScheduleForDoctor,
    updateMaxPatient,
    deleteSchedule,
    createScheduleForHealthcare,
    getScheduleForHealthcare
}