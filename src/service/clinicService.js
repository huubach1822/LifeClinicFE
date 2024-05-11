import axios from "axios";

const getAllClinics = async (isDeleted = false) => {
    return await axios.get(`getAllClinics/${isDeleted}`);
}

const getAllClinicsPagination = async (page, queryString, idCity, isDeleted = false) => {
    return await axios.get(`getAllClinicsPagination/page=${page}&queryString=${queryString}&idCity=${idCity}&isDeleted=${isDeleted}`);
}

const searchAll = async (queryString) => {
    return await axios.get(`searchAll/${queryString}`);
}

const createClinic = async (obj) => {
    return await axios.post("createClinic", obj, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
}

const updateClinicByID = async (obj) => {
    return await axios.put("updateClinicByID", obj, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
}

const deleteClinicByID = async (id) => {
    return await axios.delete(`deleteClinicByID/${id}`);
}

const getClinicImage = async (id) => {
    return await axios.get(`getClinicImage/${id}`)
}

const deleteClinicImage = async (id) => {
    return await axios.delete(`deleteClinicImage/${id}`)
}

const createClinicImage = async (obj) => {
    return await axios.post("createClinicImage", obj, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
}

const getTotalAdmin = async () => {
    return await axios.get("getTotalAdmin")
}

export {
    getAllClinics,
    getAllClinicsPagination,
    searchAll,
    createClinic,
    updateClinicByID,
    deleteClinicByID,
    getClinicImage,
    deleteClinicImage,
    createClinicImage,
    getTotalAdmin
}