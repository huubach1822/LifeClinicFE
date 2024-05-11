import "./AdminBlogManagement.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";
// import { getAllBlog } from "../../service/blogService";
import BlogForm from "../form/BlogForm/BlogForm";
import Pagination from '@mui/material/Pagination';
import { getAllBlogs, deleteBlog } from "../../service/blogService";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

const AdminBlogManagement = () => {

    const [blogs, setBlogs] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [queryObject, setQueryObject] = useState({
        page: 1,
        queryString: ""
    });

    const [show, setShow] = useState(false);
    const [selectedID, setSelectedID] = useState(null);

    const fetchData = async () => {
        const response = await getAllBlogs(queryObject.page, queryObject.queryString);
        setBlogs(response.data.data.result);
        setTotalPage(response.data.data.totalPages);
    };

    useEffect(() => {
        fetchData();
    }, [queryObject]);

    useEffect(() => {
        fetchData();
    }, [])

    const pageChange = (event, value) => {
        if (value !== queryObject.page) {
            setQueryObject({
                ...queryObject,
                page: value
            })
        }
    };

    const deleteBtn = async (id) => {
        Swal.fire({
            title: "Are you sure you want to delete?",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBlog(id).then((result) => {
                    fetchData();
                    if (result.data.code === 0) {
                        toast.success(result.data.message)
                    } else {
                        toast.error(result.data.message)
                    }
                })
            } else if (result.isDenied) {

            }
        });
    }

    return (
        <div className="admin-patient-management">
            <BlogForm fetchData={fetchData} show={show} setShow={setShow} selectedID={selectedID} setSelectedID={setSelectedID} />
            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Blog Management</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Blog Management</span>
                    </div>
                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="mt-3">
                                    <div className="d-flex flex-row justify-content-end align-items-center gap-3">
                                        <div>Search: </div>
                                        <Form.Control value={queryObject.queryString} onChange={(e) => setQueryObject({ ...queryObject, queryString: e.target.value, page: 1 })} style={{ width: '250px' }} type="text" placeholder="Enter blog title" />
                                        <button className="btn btn-primary" onClick={() => { setSelectedID(null); setShow(true) }}>Add New</button>
                                    </div>
                                    <div className="as-table mt-3" style={{ minHeight: '500px' }}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Date</th>
                                                    <th>Author</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {blogs?.map((item, index) => {
                                                    return (
                                                        <tr key={`blog${item.ID}`}>
                                                            <td>
                                                                {item?.ID}
                                                            </td>
                                                            <td>
                                                                {item?.Name}
                                                            </td>
                                                            <td>
                                                                {item?.Date}
                                                            </td>
                                                            <td>
                                                                {item?.account?.Username}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-center gap-3 align-items-center">
                                                                    <button className="btn btn-primary mt-1" onClick={() => { setSelectedID(item.ID); setShow(true) }}>Blog Detail</button>
                                                                    <button onClick={() => deleteBtn(item.ID)} type="button" className="btn btn-danger pr-btn-delete">Delete</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-center p-2">
                                        <Pagination count={totalPage} page={queryObject.page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
};

export default AdminBlogManagement;