import axios from "axios";

const getAllDoctors = async () => {
    return await axios.get("getAllDoctors");
}

const getAllDoctorsPagination = async (page = 1, queryString = "", idCity = "", idSpeciality = "", priceOrder = "") => {
    return await axios.get(`getAllDoctorsPagination/page=${page}&queryString=${queryString}&idCity=${idCity}&idSpeciality=${idSpeciality}&priceOrder=${priceOrder}`);
}

const getDoctorByClinic = async (id) => {
    return await axios.get(`getDoctorByClinic/${id}`)
}

const getDoctorDetail = async (id) => {
    return await axios.get(`getDoctorDetail/${id}`)
}

const getDoctorByAccount = async (id) => {
    return await axios.get(`getDoctorByAccount/${id}`)
}

const updateDoctorByID = async (obj) => {
    return await axios.put("updateDoctorByID", obj, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
}

const getAllDoctorSpeciality = async (queryString) => {
    return await axios.get(`getAllDoctorSpeciality/${queryString}`);
}

const updateDocSpeciality = async (obj) => {
    return await axios.put("updateDocSpeciality", obj)
}

const createDocSpeciality = async (obj) => {
    return await axios.post("createDocSpeciality", obj)
}

const deleteDocSpeciality = async (id) => {
    return await axios.delete(`deleteDocSpeciality/${id}`)
}

const getAllDoctorsAdmin = async (page, queryString, clinicID) => {
    return await axios.get(`getAllDoctorsAdmin/page=${page}&queryString=${queryString}&clinicID=${clinicID}`);
}

const createdoctor = async (obj) => {
    return await axios.post("createDoctor", obj, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
}

const deleteDoctorByID = async (id) => {
    return await axios.delete(`deleteDoctorByID/${id}`)
}

export {
    getAllDoctors,
    getAllDoctorsPagination,
    getDoctorByClinic,
    getDoctorDetail,
    getDoctorByAccount,
    updateDoctorByID,
    getAllDoctorSpeciality,
    updateDocSpeciality,
    createDocSpeciality,
    deleteDocSpeciality,
    getAllDoctorsAdmin,
    createdoctor,
    deleteDoctorByID
}