import './AboutUs.scss';
import pic1 from '../../asset/image/AboutUs/au-pic1.webp';
import pic2 from '../../asset/image/AboutUs/au-pic2.webp';
import pic3 from '../../asset/image/AboutUs/au-pic3.webp';
import pic4 from '../../asset/image/AboutUs/au-pic4.png';
import phonesvg from '../../asset/image/AboutUs/mobile.svg';
import Logo from '../../asset/image/LogoNoBG.png'

const AboutUs = () => {

    return (
        <div className="about-us-page">
            <div className='au-section-1 d-flex flex-column align-items-center' style={{ backgroundImage: `url("${pic1}")` }}>
                <img alt="" src={Logo}></img>
                <div className='au-s1-welcome'>We Care About Your Health</div>
                <div className='au-s1-name'>Health is a right, not a privilege. It needs to be enjoyed with equity.</div>
            </div>
            <div className='au-section-2 row'>
                <div className='au-s2-left col-7'>
                    <div className='au-s2-title'>Welcome to LifeClinic</div>
                    <div className='au-s2-description'>This website allows patients and their relatives to register for hospital appointments online anytime, anywhere, without having to go to the hospital in person.</div>
                    <div className='au-s2-card-container'>
                        <div className='au-s2-card d-flex flex-row align-items-center'>
                            <div className='au-s2-card-number'>1</div>
                            <div className='d-flex flex-column justify-content-center'>
                                <div className='au-s2-card-text1'>Book now</div>
                                <div className='au-s2-card-text2'>for medical checkup</div>
                            </div>
                        </div>
                        <div className='au-s2-card d-flex flex-row align-items-center'>
                            <div className='au-s2-card-number'>2</div>
                            <div className='d-flex flex-column justify-content-center'>
                                <div className='au-s2-card-text1'>Find doctors</div>
                                <div className='au-s2-card-text2'>from many hospitals</div>
                            </div>
                        </div>
                        <div className='au-s2-card d-flex flex-row align-items-center'>
                            <div className='au-s2-card-number'>3</div>
                            <div className='d-flex flex-column justify-content-center'>
                                <div className='au-s2-card-text1'>Medical information</div>
                                <div className='au-s2-card-text2'>from trusted sources</div>
                            </div>
                        </div>
                        <div className='au-s2-card d-flex flex-row align-items-center'>
                            <div className='au-s2-card-number'>4</div>
                            <div className='d-flex flex-column justify-content-center'>
                                <div className='au-s2-card-text1'>Appointment Scheduling</div>
                                <div className='au-s2-card-text2'>for patients</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='au-s2-right col-5'>
                    <img alt="" src={pic2}></img>
                </div>
            </div>
            <div className='au-section-3'>
                <div className='au-s3-container d-flex flex-column align-items-center'>
                    <div>
                        <img alt='' src={pic3} className='au-s3-img'></img>
                    </div>
                    <div className='d-flex'>
                        <div className='au-s3-card'>
                            <div className='au-s3-title'>Viewpoint</div>
                            <div className='au-s3-content'>LifeClinic aims to become a leading technology solutions provider in Vietnam and Southeast Asia, connecting healthcare services to a wider population, bringing breakthrough efficiency to healthcare providers, and delivering convenient and satisfying experiences for patients in healthcare and personal health care.</div>
                        </div>
                        <div className='au-s3-card'>
                            <div className='au-s3-title'>Vision</div>
                            <div className='au-s3-content'>LifeClinic provides a smart healthcare access platform and solution that offers users new ways to take care of their health, anytime, anywhere through a highly interactive online platform that connects them with leading medical facilities and a large team of dedicated and experienced medical professionals.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='au-section-4'>
                <div className='au-s4-container d-flex align-items-center justify-content-end' style={{ backgroundImage: `url("${pic4}")` }}>
                    <div className='au-s4-img-container me-3'>
                        <img className='au-s4-img' alt='' src={phonesvg}></img>
                    </div>
                    <div className='au-s4-info'>
                        <div className='au-s4-title'>Contact Support</div>
                        <div className='au-s4-phone'>1900-2115</div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AboutUs