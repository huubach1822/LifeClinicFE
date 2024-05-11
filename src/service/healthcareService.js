import axios from "axios";

const getAllHealthcare = async () => {
    return await axios.get("getAllHealthcarePackage");
}

const getAllHealthcarePagination = async (page, queryString, idCity, idType, priceOrder) => {
    return await axios.get(`getAllHealthcarePagination/page=${page}&queryString=${queryString}&idCity=${idCity}&idType=${idType}&priceOrder=${priceOrder}`);
}

const getHealthcareDetail = async (id) => {
    return await axios.get(`getHealthcareDetail/${id}`)
}

const getHealthcareByClinic = async (clinicID) => {
    return await axios.get(`getHealthcareByClinic/${clinicID}`)
}

const getAllHealthcareTypeAdmin = async (queryString) => {
    return await axios.get(`getAllHealthcareTypeAdmin/${queryString}`)
}

const createHealthcareType = async (data) => {
    return await axios.post(`createHealthcareType`, data)
}

const updateHealthcareType = async (data) => {
    return await axios.put(`updateHealthcareType`, data)
}

const deleteHealthcareType = async (id) => {
    return await axios.delete(`deleteHealthcareType/${id}`)
}

const getAllHealthcarePaginationAdmin = async (page, queryString, clinicID) => {
    return await axios.get(`getAllHealthcarePaginationAdmin/page=${page}&queryString=${queryString}&clinicID=${clinicID}`)
}

const createHealthcarePackage = async (data) => {
    return await axios.post(`createHealthcarePackage`, data)
}

const updateHealthcarePackage = async (data) => {
    return await axios.put(`updateHealthcarePackage`, data)
}

const deleteHealthcarePackage = async (id) => {
    return await axios.delete(`deleteHealthcarePackage/${id}`)
}

export {
    getAllHealthcare,
    getAllHealthcarePagination,
    getHealthcareDetail,
    getHealthcareByClinic,
    getAllHealthcareTypeAdmin,
    createHealthcareType,
    updateHealthcareType,
    deleteHealthcareType,
    getAllHealthcarePaginationAdmin,
    createHealthcarePackage,
    updateHealthcarePackage,
    deleteHealthcarePackage
}