import "./Page404.scss"
import { useNavigate } from 'react-router-dom';


const Page404 = () => {

    const navigate = useNavigate();

    return (
        <div className="page-404" style={{ height: "100vh" }}>
            <div className="misc-wrapper">
                <div className="misc-content">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-6">
                                <div className="misc-box text-center">
                                    <h1 className="text-muted fs-large">404</h1>
                                    <h4 className="font-300">We're sorry, but the page you were looking for doesn't exist.</h4>
                                    <a onClick={() => navigate(-1)} className="btn btn-lg btn-primary btn-rounded box-shadow mt-10">Go Back</a>
                                </div>
                                <div className="text-center misc-footer">
                                    <p>Copyright &copy; 2024 LifeClinic</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page404