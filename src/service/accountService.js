import axios from "axios";

const loginUser = async (user) => {
    return await axios.post("login", user);
}

const registerUser = async (user) => {
    return await axios.post("register", user);
}

const changePassword = async (user) => {
    return await axios.post("changePassword", user);
}

export {
    loginUser,
    registerUser,
    changePassword
}