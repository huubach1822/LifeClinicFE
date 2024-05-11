import "./Footer.scss"
import Logo from '../../asset/image/Logo.png'
import Icon1 from '../../asset/image/Footer/icon-1.webp'
import Icon2 from '../../asset/image/Footer/icon-2.webp'
import Icon3 from '../../asset/image/Footer/icon-dmca.png'
import { useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate();

    return (
        <div className="footer-container">
            <div className="footer-page d-flex">
                <div>
                    <div><img alt="" src={Logo}></img></div>
                    <div><span className="footer-title">Address: </span>97 Kim Ma, Ba Dinh, Ha Noi</div>
                    <div><span className="footer-title">Website: </span>https://lifeclinic.vn</div>
                    <div><span className="footer-title">Email: </span>cskh@LifeClinic.vn</div>
                    <div><span className="footer-title">Phone: </span>(028) 710 78098</div>
                </div>
                <div className="d-flex flex-column flex-fill">
                    <div className="right-footer d-flex flex-fill justify-content-evenly">
                        <div>
                            <div className="footer-title">Service</div>
                            <div className="footer-underline" onClick={() => navigate("/doctor")}>Book doctor's appointment</div>
                            <div className="footer-underline" onClick={() => navigate("/medicalFacility")}>Schedule a hospital visit</div>
                            <div className="footer-underline" onClick={() => navigate("/healthcareService")}>Get health check-up</div>
                            <div className="footer-underline" onClick={() => navigate("/blog")}>Read our blog</div>
                        </div>
                        <div>
                            <div className="footer-title">Support</div>
                            <div className="footer-underline" onClick={() => navigate("/aboutUs")}>About LifeClinic</div>
                            {/* <div className="footer-underline">Questions and Answers</div> */}
                            <div className="footer-underline">Contact Us</div>
                            <div className="footer-underline">Privacy Policy</div>
                        </div>
                    </div>
                    <div className="icon-content d-flex justify-content-center align-items-center gap-5 flex-fill">
                        <img alt="" className="icon-footer" src={Icon1}></img>
                        <img alt="" className="icon-footer" src={Icon2}></img>
                        <img alt="" className="icon-footer" src={Icon3}></img>
                    </div>
                </div>
            </div>
            <div className="footer-end py-3">
                <span className="me-3">Copyright © 2020 - 2024 LifeClinic Vietnam Company Limited.</span>
            </div>
        </div>

    )
}

export default Footer;
