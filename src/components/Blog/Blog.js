import "./Blog.scss";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Banner1 from "../../asset/image/Blog/bannerBlog1.jpg"
import Banner2 from "../../asset/image/Blog/bannerBlog2.png"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogByID, getAllBlogs } from "../../service/blogService";
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const Blog = () => {

    // param from url
    let { id } = useParams();
    const [blog, setBlog] = useState({});
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const result = await getBlogByID(id);
        setBlog(result.data.result);
        getAllBlogs(1, "").then(res => {
            setBlogs(res.data.data.result);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
    }, [id])


    return (
        <div className="blog-detail-container">
            <div class="styles_body__Z1vMj snipcss-MIQ8Q">
                <div class="styles_breadcrumb__aTA0J style-CHE38" id="style-CHE38">
                    <div class="styles_container__pVb9x styles_containerPartner__pJy0t">
                        <ul class="styles_breadcrumbs__Lvmdm">
                            <div id="first"></div>
                            <li><Link to="/" className="doc-s1-p1-hp me-2">Home Page</Link></li>
                            <li class="undefined  styles_last__rM2K0"><span class="styles_text__KPG_r">
                                <FontAwesomeIcon icon={faAngleRight} />
                                <a className="ms-2">Blog Detail</a>
                            </span>
                            </li>
                            <div id="last"></div>
                        </ul>
                    </div>
                </div>
                <div class="styles_post__4ycd3">
                    <div class="styles_container__4RwxE">
                        <div class="styles_BannerTop__dGbnw"><a><span id="style-aLlyQ" class="style-aLlyQ"><img style={{ borderRadius: "20px" }} alt="Banner News" src={Banner1} decoding="async" data-nimg="fixed" id="style-6JarZ" class="style-6JarZ box-shadow" /><noscript></noscript></span></a></div>
                        <div class="ant-row style-dX9pC" id="style-dX9pC">
                            <div class="ant-col ant-col-24 ant-col-lg-16 style-vBHjj" id="style-vBHjj">
                                <div class="styles_post__YpwMX">
                                    <h1 class="styles_title__XXbyM">{blog?.Name}</h1>
                                    <div class="styles_tag__YAVgQ">
                                        <div class="styles_icon__Eifpe"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                                            <path d="M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5a2 2 0 01-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"></path>
                                        </svg></div><span>{dayjs(blog.Date, "MM-DD-YYYY").format('dddd MMM D, YYYY')}</span>
                                        {/* <span> - </span><span>Mộc Thanh</span> */}
                                    </div>
                                    <div class="styles_description___sqNo">{blog.Description}</div>
                                    <div class="styles_contentWrapper__hdn8m">
                                        <div class="styles_content__jK9pH" dangerouslySetInnerHTML={{ __html: blog?.Content }}></div>
                                    </div>
                                </div>
                            </div>
                            <div class="ant-col ant-col-24 ant-col-lg-8 style-I6bAR" id="style-I6bAR">
                                <div class="styles_banner__GKa4r"><span id="style-AVk5N" class="style-AVk5N"><img style={{ borderRadius: '20px' }} alt="Banner tải app Medpro" src={Banner2} decoding="async" data-nimg="fill" id="style-BqfDh" class="style-BqfDh" /><noscript></noscript></span></div>
                            </div>
                        </div>
                        <div class="styles_pc__80NIc">
                            <div class="styles_saleSlider__UO__F">
                                <div class="styles_title__slBCB">
                                    <p>Related Blog</p>
                                </div>
                                <div class="ant-row styles_slider__M_ZHZ style-rlOCQ" id="style-rlOCQ">

                                    {
                                        blogs?.filter(item => item.ID !== blog.ID).slice(0, 4).map((blog, index) => {
                                            return (
                                                <div onClick={() => navigate(`/blogDetail/${blog.ID}`)} class="ant-col ant-col-12 styles_item__iiub4 ant-col-lg-6 style-MWb3W" id="style-MWb3W"><a>
                                                    <div class="styles_card__xMQxJ">
                                                        <div class="styles_image__LC8PZ"><span id="style-tzP4R" class="style-tzP4R"><span id="style-G81Cp" class="style-G81Cp"></span><img alt="Phòng khám Đa khoa Quốc Tế Timec đã có trên Medpro" src={process.env.REACT_APP_BACKEND_URL + blog.Image} decoding="async" data-nimg="responsive" id="style-DJwyL" class="style-DJwyL" /><noscript></noscript></span></div>
                                                        <p class="styles_title__slBCB">{blog.Name}</p>
                                                        <div class="styles_tag__7cDEO">
                                                            <div class="styles_icon__WQ69D"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                                <path d="M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5a2 2 0 01-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"></path>
                                                            </svg></div>
                                                            <div><span>{dayjs(blog.Date, "MM-DD-YYYY").format('dddd MMM D, YYYY')}</span>
                                                                {/* <span> - </span><span>Mộc Thanh</span>  */}
                                                            </div>
                                                        </div>
                                                        <div class="styles_more__EW9F4">Watch more<div class="styles_icon__WQ69D styles_rightIcon__TJ9nx"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" color="#00e0ff" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ color: "rgb(0, 224, 255)" }}>
                                                            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                                        </svg></div>
                                                        </div>
                                                    </div>
                                                </a></div>
                                            )
                                        })
                                    }

                                </div>
                                <div onClick={() => navigate(`/blog`)} class="styles_viewMore__CQl_9"><a>
                                    <div class="styles_btnMore__tV8Kb">See all <span id="style-ZBFbW" class="style-ZBFbW"><img alt="Icon Arrow" src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdirection_right.db237e24.svg&amp;w=32&amp;q=75" decoding="async" data-nimg="fixed" id="style-4RC7Y" class="style-4RC7Y" /><noscript></noscript></span></div>
                                </a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Blog