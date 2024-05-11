import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { validateEmpty } from '../../../util/validate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createBlog, updateBlogByID, getBlogByID } from '../../../service/blogService';
import { useSelector } from 'react-redux';
import "./BlogForm.scss";

// import axios from 'axios';
// const cheerio = require('cheerio');

// props.show
// props.setShow
// props.fetchData

// props.selectedID
// props.setSelectedID

function handleError() {
    var img = document.getElementById('imgBlog');
    if (!img.complete || img.naturalWidth === 0) {
        // Image failed to load, do something (e.g., replace with a placeholder)
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='white' /%3E%3C/svg%3E";
        // Alternatively, you can hide the image altogether:
        // img.style.display = 'none';
    }
}

const BlogForm = (props) => {

    const [editMode, setEditMode] = useState(false);
    const [blog, setBlog] = useState({
        ID: "",
        Name: "",
        Image: "",
        Description: ""
    })
    const [content, setContent] = useState("")

    const [blogImage, setBlogImage] = useState(null);
    const uploadImage = async (e) => {
        setBlogImage(e.target.files[0]);
    };

    const account = useSelector(state => state.accountSlice.account)

    const handleCreate = async () => {

        if (validateEmpty(blog, ["Name"]) && !_.isEmpty(content)) {
            if (!_.isEmpty(blogImage?.name)) {
                blog.ID_account = account.ID
                blog.Content = content
                let formData = new FormData();
                formData.append("image", blogImage)
                formData.append("blog", JSON.stringify(blog))
                createBlog(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    props.fetchData()
                })
            } else {
                toast.error("Please choose an image")
            }
            closeForm();
        } else {
            toast.error("Please fill required fields")
        }
    }

    const handleUpdate = () => {
        if (validateEmpty(blog, ["Name", "Description"]) && !_.isEmpty(content)) {
            if (!_.isEmpty(blogImage?.name)) {
                blog.Image = null
                blog.Content = content
                let formData = new FormData();
                formData.append("image", blogImage)
                formData.append("blog", JSON.stringify(blog))
                updateBlogByID(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    props.fetchData()
                    closeForm();
                })
            } else {
                let updateBlog = _.pick(blog, ["ID", "Name", "Description"])
                updateBlog.Content = content
                let formData = new FormData();
                formData.append("blog", JSON.stringify(updateBlog))
                updateBlogByID(formData).then((e) => {
                    if (e.data.code === 0) {
                        toast.success(e.data.message);
                    } else {
                        toast.error(e.data.message);
                    }
                    props.fetchData()
                    closeForm();
                })
            }
            closeForm();
        } else {
            toast.error("Please fill required fields")
        }
    }

    const closeForm = () => {
        props.setShow(false);
        props.setSelectedID(null)
        setEditMode(false)
        setBlog({})
        setBlogImage(null)
        setContent("")
    }

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setBlog(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const fetchData = async (id) => {
        let res = await getBlogByID(id);
        setBlog({
            ID: res.data.result.ID,
            Name: res.data.result.Name,
            Image: res.data.result.Image,
            Description: res.data.result.Description
        });
        setContent(res.data.result.Content)
    }

    useEffect(() => {
        if (props.selectedID != null) {
            fetchData(props.selectedID);
        } else {
            setBlog({
                Name: "",
                Content: "",
                Description: ""
            })
        }
    }, [props.selectedID, props.show])

    return (
        <div>
            <Modal show={props.show} onHide={() => closeForm()} size="xl" centered id="blog-form">
                <Modal.Header closeButton>
                    <Modal.Title>Blog Infomation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">
                        <div className="d-flex flex-row gap-5">
                            <div className='mb-3 d-flex align-items-center justify-content-center gap-3' style={{ flexGrow: 1 }}>
                                <input disabled={!editMode && props.selectedID != null} style={{ width: '80px' }} accept="image/*" type="file" id="myFile" name="filename" onChange={uploadImage} />
                                <img id='imgBlog' alt='' src={
                                    _.isEmpty(blogImage?.name) ?
                                        process.env.REACT_APP_BACKEND_URL + blog?.Image
                                        : URL.createObjectURL(blogImage)
                                }
                                    onError={() => handleError()} style={{ border: '1px solid #808080', width: '80%', height: '253px', borderRadius: '3px', objectFit: 'cover' }} />
                            </div>

                            <div className='d-flex flex-column'>
                                <Form.Group className="mb-3" controlId="formBasicEmail" style={{ width: '400px' }}>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control disabled={!editMode && props.selectedID != null} name='Name' type="text" value={blog?.Name} onChange={onInputChange} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{ width: '400px' }}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control disabled={!editMode && props.selectedID != null} name='Description' as="textarea" rows={5} value={blog?.Description} onChange={onInputChange} />
                                </Form.Group>
                            </div>

                        </div>

                        <ReactQuill
                            readOnly={!editMode && props.selectedID != null}
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ size: [] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['link', 'image', 'video'],
                                    ['clean']
                                ],
                            }}
                            theme="snow" value={content} onChange={(e) => setContent(e)} />;

                        <div className="d-flex justify-content-end gap-3">
                            {

                                <>
                                    <Button variant="primary" type="button" className='btn-cancel  btn-danger' onClick={() => closeForm()} >
                                        Cancel
                                    </Button>
                                    {
                                        props.selectedID == null ? (
                                            <Button variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
                                                Create
                                            </Button>
                                        ) : (
                                            <>
                                                {!editMode ? (
                                                    <Button variant="primary" type="button" className='btn-edit' onClick={() => setEditMode(true)}>
                                                        Edit
                                                    </Button>
                                                )
                                                    : (
                                                        <Button variant="primary" type="button" className='btn-create' onClick={() => handleUpdate()}>
                                                            Save
                                                        </Button>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </>

                            }
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default BlogForm