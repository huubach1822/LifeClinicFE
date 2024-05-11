import axios from "axios";

const getAllCity = async () => {
    return await axios.get("getAllCity");
}

const getAllDegree = async () => {
    return await axios.get("getAllDegree");
}

const getAllSpeciality = async () => {
    return await axios.get("getAllSpeciality");
}

const getAllHealthcareType = async () => {
    return await axios.get("getAllHealthcareType");
}

export {
    getAllCity,
    getAllDegree,
    getAllSpeciality,
    getAllHealthcareType
}