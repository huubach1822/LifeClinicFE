import "./BlogPage.scss";
import { getAllBlogs } from "../../service/blogService";
import { useEffect } from "react";
import { useState } from "react";
import Pagination from '@mui/material/Pagination';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const BlogPage = () => {

    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getAllBlogs(page, "").then(res => {
            setBlogs(res.data.data.result);
            setTotalPage(res.data.data.totalPages);
        })
    }, [])


    const pageChange = (event, value) => {
        if (value !== page) {
            setPage(value);
            getAllBlogs(value, "").then(res => {
                setBlogs(res.data.data.result);
                setTotalPage(res.data.data.totalPages);
            })
            window.scrollTo(0, 0);
        }
    };

    return (


        <div className="blog-page-container ">

            <div className="blog-s1-p1">
                <Link to="/" className="doc-s1-p1-hp me-2">Home Page</Link>
                <FontAwesomeIcon icon={faAngleRight} />
                <span className="doc-s1-p1-doc ms-2">Blog</span>
            </div>

            <div className="d-flex justify-content-center flex-column align-items-center">
                <div className="blog-page">

                    {
                        blogs.map((blog, index) => {
                            return (
                                <div class="card">
                                    <div class="card-img-holder">
                                        <img src={process.env.REACT_APP_BACKEND_URL + blog?.Image} alt="Blog image" />
                                    </div>
                                    <h3 class="blog-title">{blog?.Name}</h3>
                                    <span class="blog-time">{dayjs(blog.Date, "MM-DD-YYYY").format('dddd MMM D, YYYY')}</span>
                                    <p class="description">
                                        {blog?.Description}
                                    </p>
                                    <div class="options">
                                        <span>
                                            Read Full Blog
                                        </span>
                                        <button class="btn" onClick={() => navigate(`/blogDetail/${blog.ID}`)}>
                                            Click
                                            <FontAwesomeIcon className="ms-2" icon={faArrowRight} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                </div>

                <div className="doc-pagination d-flex justify-content-center pb-3">
                    <Pagination count={totalPage} page={page} siblingCount={2} variant="outlined" shape="rounded" onChange={pageChange} />
                </div>
            </div>

        </div>
    );
};

export default BlogPage;