import axios from "axios";

const createPatient = async (patient) => {
    return await axios.post("createPatient", patient);
}

const updatePatient = async (patient) => {
    return await axios.put("updatePatient", patient);
}

const getAllPatientByAccount = async (id) => {
    return await axios.get(`getAllPatientByAccount/${id}`);
}

const deletePatient = async (id) => {
    return await axios.delete(`deletePatient/${id}`);
}

const getAllPatientForDoctor = async (id, page, queryString) => {
    return await axios.get(`getAllPatientForDoctor/${id}/${page}/${queryString}`);
}

const getAllPatientByHealthCare = async (id, page, queryString) => {
    return await axios.get(`getAllPatientByHealthCare/${id}/${page}/${queryString}`);
}

export {
    createPatient,
    getAllPatientByAccount,
    deletePatient,
    updatePatient,
    getAllPatientForDoctor,
    getAllPatientByHealthCare
}