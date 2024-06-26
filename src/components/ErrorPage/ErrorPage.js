import { useEffect } from "react";
import "./ErrorPage.scss"
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash";
import { createBooking } from "../../service/bookingService";
import dayjs from "dayjs";

const ErrorPage = () => {

    const navigate = useNavigate();
    var now = dayjs()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const code = queryParams.get('code');
    const id = queryParams.get('id');
    const cancel = queryParams.get('cancel');
    const status = queryParams.get('status');
    const orderCode = queryParams.get('orderCode');

    console.log(code, id, cancel, status, orderCode);

    useEffect(() => {

        const callApi = async () => {
            var storedBooking = localStorage.getItem("booking");
            if (!_.isEmpty(id) && !_.isEmpty(storedBooking)) {
                let booking = JSON.parse(storedBooking);
                booking.Status = "Cancelled";
                booking.PaymentInfo = {
                    ID: orderCode,
                    Payment_method: "Banking",
                    Status: "Cancel",
                    Payment_date: now.format('MM-DD-YYYY'),
                }
                const res = await createBooking(booking)

                localStorage.setItem("booking", "");

                // if (res.data.code === 0) {
                //     toast.success(res.data.message)
                // } else {
                //     toast.error(res.data.message)
                // }
            }
        }
        callApi();

        const timer = setTimeout(() => {
            navigate('/');
        }, 4000);

        return () => clearTimeout(timer);

    }, []);

    return (
        <div className="error-page">
            <div className="card">
                <div className="checkmark-container">
                    <i className="checkmark">✗</i>
                </div>
                <h1>Error</h1>
                <p>Payment was unsuccessful. Your booking has been cancelled!<br /> You will be redirected to the home page shortly</p>
            </div>
        </div>
    )

}

export default ErrorPage