import "./Header.scss"
import Logo from '../../asset/image/Logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTiktok, faFacebookF, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { Link } from "react-router-dom";
import hp from '../../asset/image/Header/hp.svg'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { useNavigate } from "react-router-dom"

const Header = () => {

    const account = useSelector(state => state.accountSlice.account);
    const navigate = useNavigate();

    const btnAccount = () => {
        if (_.isEmpty(account)) {
            navigate("/login")
        } else {
            navigate("/account")
        }
    }

    return (
        <div className="header-page">
            <div className="header-container">
                <Link to="/"><img alt="" className="left-header" src={Logo}></img></Link>
                <div className="right-header">
                    <div className="up-header">
                        <div className="social-network-header">
                            <a className="icon-header" href="https://github.com/huubach1822"><FontAwesomeIcon icon={faTiktok} />TikTok</a>
                            <div className="line-icon"></div>
                            <a className="icon-header" href="https://github.com/huubach1822"><FontAwesomeIcon icon={faFacebookF} />Facebook</a>
                            <div className="line-icon"></div>
                            <a className="icon-header" href="https://github.com/huubach1822"><FontAwesomeIcon icon={faYoutube} />Youtube</a>
                        </div>
                        <div className="account-header">
                            <button className="btn btn-primary acc-button d-flex" onClick={() => btnAccount()}>
                                <div><FontAwesomeIcon icon={faUser} /></div>
                                <div className="flex-fill ps-2">{_.isEmpty(account) ? "My Account" : account.Username}</div>
                            </button>
                        </div>
                    </div>
                    <div className="down-header">
                        <div className="contact-info">
                            <div className="contact-logo">
                                <img alt="" src={hp} />
                            </div>
                            <div className="phone-number-container">
                                <div className="contact-us">Contact Support</div>
                                <div className="phone-number">19002024</div>
                            </div>
                        </div>
                        <ul className="nav-bar flex-fill d-flex flex-row justify-content-end">
                            <li><Link to="/medicalFacility">Medical facility</Link></li>
                            <li><Link to="/doctor">Doctor</Link></li>
                            <li><Link to="/healthcareService">Healthcare package</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            {/* <li><a href="#">Q&A</a></li> */}
                            <li><Link to="/aboutUs">About us</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;