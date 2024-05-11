import axios from "axios";

const createBlog = async (obj) => {
    return await axios.post("createBlog", obj);
}

const getAllBlogs = async (page, queryString) => {
    return await axios.get(`getAllBlogs/page=${page}&queryString=${queryString}`);
}

const updateBlogByID = async (obj) => {
    return await axios.put("updateBlogByID", obj);
}

const deleteBlog = async (id) => {
    return await axios.delete(`deleteBlog/${id}`);
}

const getBlogByID = async (id) => {
    return await axios.get(`getBlogByID/${id}`);
}

export {
    createBlog,
    getAllBlogs,
    updateBlogByID,
    deleteBlog,
    getBlogByID
}