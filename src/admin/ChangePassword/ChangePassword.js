import "./ChangePassword.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import pwPic from '../../asset/image/AccountPage/reset.webp'
import { useSelector } from 'react-redux'
import { useState } from "react";
import { useDispatch } from "react-redux"
import { changePwRedux } from "../../redux/slices/accountSlice"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { validateEmpty, validateLength } from "../../util/validate";

const ChangePassword = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const account = useSelector(state => state.accountSlice.account)
    const [passwordInput, setPasswordInput] = useState({
        id: account.ID,
        oldPassword: '',
        newPassword: '',
        reEnterPassword: ''
    })
    const submitBtn = async () => {

        if (validateEmpty(passwordInput, ["oldPassword", "newPassword", "reEnterPassword"]) && validateLength(passwordInput.oldPassword, 6, "Old password") && validateLength(passwordInput.newPassword, 6, "New password")) {
            if (passwordInput.newPassword === passwordInput.reEnterPassword) {
                let result = await dispatch(changePwRedux(passwordInput))
                if (result.payload.code === 0) {
                    navigate("/admin")
                    toast.success(result.payload.message)
                } else {
                    toast.error(result.payload.message)
                }
            } else {
                toast.error("Re-enter password is not match!")
            }
        } else {
            toast.error("Please fill required fields")
        }
        setPasswordInput({
            ...passwordInput,
            oldPassword: '',
            newPassword: '',
            reEnterPassword: ''
        })
    }

    return (
        <div className="admin-password">

            <div className="row page-header">
                <div className="col-lg-6 align-self-center ">
                    <h2>Change Password</h2>
                    <div className="mt-2">
                        <Link to="/admin" className="link-hp me-2">Home</Link>
                        <FontAwesomeIcon icon={faAngleRight} />
                        <span className="link-current ms-2">Change Password</span>
                    </div>

                </div>
            </div>

            <section className="main-content">

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">

                                <div className="row pw-content">
                                    <div className="col-6 p-3">
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ maxWidth: '500px' }}>
                                                <Form.Label>Current Password</Form.Label>
                                                <Form.Control type="password" placeholder="******" value={passwordInput.oldPassword} onChange={e => setPasswordInput({ ...passwordInput, oldPassword: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword" style={{ maxWidth: '500px' }}>
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control type="password" placeholder="******" value={passwordInput.newPassword} onChange={e => setPasswordInput({ ...passwordInput, newPassword: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicRePassword" style={{ maxWidth: '500px' }}>
                                                <Form.Label>Re-enter Password</Form.Label>
                                                <Form.Control type="password" placeholder="******" value={passwordInput.reEnterPassword} onChange={e => setPasswordInput({ ...passwordInput, reEnterPassword: e.target.value })} />
                                            </Form.Group>

                                            <Button variant="primary" type="button" className="mt-1" onClick={() => submitBtn()}>
                                                Confirm
                                            </Button>
                                        </Form>
                                    </div>
                                    <div className="col-6 d-flex align-items-center justify-content-center">
                                        <img src={pwPic} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default ChangePassword