import "./ChangePassword.scss"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import pwPic from '../../../asset/image/AccountPage/reset.webp'
import { useSelector } from 'react-redux'
import { useState } from "react";
import { useDispatch } from "react-redux"
import { changePwRedux } from "../../../redux/slices/accountSlice"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { validateEmpty, validateLength } from "../../../util/validate";

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
                    navigate("/")
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
        <div className="pw-container">
            <div className="pw-title">Change password</div>
            <div className="row pw-content">
                <div className="col-6">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" placeholder="******" value={passwordInput.oldPassword} onChange={e => setPasswordInput({ ...passwordInput, oldPassword: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="******" value={passwordInput.newPassword} onChange={e => setPasswordInput({ ...passwordInput, newPassword: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicRePassword">
                            <Form.Label>Re-enter Password</Form.Label>
                            <Form.Control type="password" placeholder="******" value={passwordInput.reEnterPassword} onChange={e => setPasswordInput({ ...passwordInput, reEnterPassword: e.target.value })} />
                        </Form.Group>

                        <Button variant="primary" type="button" className="mt-1" onClick={() => submitBtn()}>
                            Confirm
                        </Button>
                    </Form>
                </div>
                <div className="col-6 d-flex">
                    <img src={pwPic} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ChangePassword 