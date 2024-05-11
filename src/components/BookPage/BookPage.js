import "./BookPage.scss";
import bpdoc from "../../asset/image/BookPage/bpdoc.png";
import bphc from "../../asset/image/BookPage/bphc.png";
import { useNavigate, useParams, Link } from "react-router-dom";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookPage = () => {

    const navigate = useNavigate();
    // param from url
    let { id, name } = useParams();

    return (
        <div className="book-page-container">
            <div class="styles_body__Z1vMj snipcss-hxts8" style={{ marginTop: "0px" }}>
                <div class="styles_breadcrumb__aTA0J" >
                    <div class="styles_container__pVb9x styles_containerPartner__pJy0t">
                        <ul class="styles_breadcrumbs__Lvmdm">
                            <div id="first"></div>
                            <li><Link to="/">Home Page</Link>&nbsp;</li>
                            <li class="undefined undefined "><span class="styles_text__KPG_r">&nbsp;
                                <FontAwesomeIcon icon={faAngleRight} />
                                &nbsp;<a>{name}</a></span></li>
                            <li class="undefined  styles_last__rM2K0"><span class="styles_text__KPG_r">&nbsp;
                                <FontAwesomeIcon icon={faAngleRight} />
                                &nbsp;<a>Booking method</a></span></li>
                            <div id="last"></div>
                        </ul>
                    </div>
                </div>
                <div class="styles_chooseFeature__sBvc9">
                    <div id="styles_contentBannerHome__1G7jj styles_chooseFeatureContainer__nGIOJ" class="styles_container__pVb9x styles_contentBannerHome__1G7jj styles_chooseFeatureContainer__nGIOJ">
                        <div class="ant-row styles_rowboxService__OrDbs styles_chooseFeature__utkk1">
                            <div class="ant-col ant-col-24 styles_colTitle___giBI">
                                <h1 class="styles_title__u_sMk">Appointment booking method</h1>
                                <div class="styles_desc__hbahd">Book appointments quickly, no waiting needed, with many healthcare facilities across cities</div>
                            </div>
                            <div class="ant-col ant-col-24 styles_colBoxService__HAjlP">
                                <ul class="styles_listBoxService__gEkVw styles_chooseFeatureList__dEtay style-zho9d" id="style-zho9d">
                                    <li class="styles_chooseFeatureItem__MQsB3">
                                        <div class="styles_card__XD17W" onClick={() => navigate(`/bookingClinic/${id}`)}>
                                            <figure><img src={bpdoc} width="35" height="35" alt="" /></figure>
                                            <div class="styles_name__pt_wb">Book a doctor's appointment</div>
                                        </div>
                                    </li>
                                    <li class="styles_chooseFeatureItem__MQsB3" onClick={() => navigate(`/bookingClinicHc/${id}`)}>
                                        <div class="styles_card__XD17W">
                                            <figure><img src={bphc} width="35" height="35" alt="" /></figure>
                                            <div class="styles_name__pt_wb">Healthcare Package</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="styles_bottomButton__Fuqd_">
                        <button onClick={() => navigate(-1)} type="button" class="ant-btn ant-btn-text styles_btnBack__IzOr4 style-Gdhqk" id="style-Gdhqk"><span>Go back</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" color="#003553" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style={{ color: "rgb(0, 53, 83)" }}>
                            <g>
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"></path>
                            </g>
                        </svg></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookPage