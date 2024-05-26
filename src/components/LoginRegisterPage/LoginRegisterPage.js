import "./LoginRegisterPage.scss";
import loginWallpaper from '../../asset/image/LoginRegisterPage/login-wallpaper.jpg';
import loginWallpaper2 from '../../asset/image/LoginRegisterPage/side-wallpaper.jpg';
import Logo from '../../asset/image/Logo.png';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { loginRedux, registerRedux } from "../../redux/slices/accountSlice"
import { validateEmpty, validateLength } from "../../util/validate";

const LoginRegisterPage = () => {

    // react router
    const navigate = useNavigate();
    // redux
    const dispatch = useDispatch();
    // login register flag
    const [flag, setFlag] = useState(1);
    // input data
    const [input, setInput] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }
    // call api 
    const onClickBtn = async () => {
        if (flag === 1) {
            if (validateEmpty(input, ["username", "password"])) {
                let result = await dispatch(loginRedux(input));
                if (result.payload.code === 0) {
                    if (result.payload.account.ID_account_type === 1) {
                        navigate("/");
                    } else if (result.payload.account.ID_account_type === 2) {
                        navigate("/admin/dashbroadDoc");
                    } else if (result.payload.account.ID_account_type === 3) {
                        navigate("/admin/adminDashbroad");
                    }
                    toast.success(result.payload.message);
                } else {
                    toast.error(result.payload.message);
                }
            } else {
                toast.error("Please fill required fields")
            }
        } else {
            if (validateEmpty(input)) {
                if (input.password === input.confirmPassword) {
                    let result = await dispatch(registerRedux(input));
                    if (result.payload.code === 0) {
                        navigate("/");
                        toast.success(result.payload.message);
                    } else {
                        toast.error(result.payload.message);
                    }

                } else {
                    toast.error("Re-enter Passwords do not match");
                }
            } else {
                toast.error("Please fill required fields")
            }
        }
        setInput({
            username: '',
            password: '',
            confirmPassword: ''
        });
    }

    useEffect(() => {
        setInput({
            username: '',
            password: '',
            confirmPassword: ''
        });
    }, [flag])

    return (
        <div className="page-container" style={{ backgroundImage: `url("${loginWallpaper}")` }}>
            <div className="wrapper" >
                <div className="left" style={{ backgroundImage: `url("${loginWallpaper2}")` }}>
                    <Link to="/"><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></Link>
                </div>
                <div className="right">
                    <div className="d-flex justify-content-center mb-1 mt-3"><img alt="" className="login-logo" src={Logo} /></div>
                    <div className="tabs">
                        <ul>
                            <li className={flag === 0 ? "login_li" : "login_li active"} onClick={() => setFlag(1)}>Login</li>
                            <li className={flag === 1 ? "register_li" : "register_li active"} onClick={() => setFlag(0)}>Register</li>
                        </ul>
                    </div>

                    {flag === 0 && (
                        <div className="register">
                            <div className="input_field">
                                <input type="text" placeholder="Username" className="input" name="username" value={input.username} onChange={onInputChange} />
                            </div>
                            <div className="input_field">
                                <input type="password" placeholder="Password" name="password" className="input" value={input.password} onChange={onInputChange} />
                            </div>
                            <div className="input_field">
                                <input type="password" placeholder="Re-enter Password" name="confirmPassword" className="input" value={input.confirmPassword} onChange={onInputChange} />
                            </div>

                        </div>
                    )}

                    {flag === 1 && (
                        <div className="login">
                            <div className="input_field">
                                <input type="text" placeholder="Username" className="input" name="username" value={input.username} onChange={onInputChange} />
                            </div>
                            <div className="input_field">
                                <input type="password" placeholder="Password" className="input" name="password" value={input.password} onChange={onInputChange} />
                            </div>
                        </div>
                    )}

                    <button type="button" className="btn btn-primary" onClick={() => onClickBtn()}>{flag === 1 ? 'Login' : 'Register'}</button>

                </div>
            </div>


        </div>
    )
}

export default LoginRegisterPage;