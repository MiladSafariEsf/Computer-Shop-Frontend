import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <footer className="footer">
            <div className="row glasss">
                <div className="col-lg-8">
                    <div className="right">
                        <div className="title">درباره ما</div>
                        <div className="des">
                            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است...
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="left">
                        <div className="title">ما را در شبکه های اجتماعی دنبال کنید</div>
                        <div className="socials">
                            <a href="mailto:miladsafarishop@gmail.com" aria-label="انتقال به صفحه گیت هاب" className="footer-item">
                                {/* <i className="fa-brands fa-github"></i> */}
                                <FontAwesomeIcon className="footer-item-i" icon={faGithub} />
                            </a>
                            <a href="mailto:miladsafarishop@gmail.com" aria-label="انتقال به صفحه لینکدین" className="footer-item">
                                {/* <i className="fa-brands fa-linkedin-in"></i> */}
                                <FontAwesomeIcon className="footer-item-i" icon={faLinkedinIn} />
                            </a>
                            <a href="mailto:miladsafarishop@gmail.com" aria-label="ارسال ایمیل به سازنده سایت" className="footer-item">
                                {/* <i className="fa-solid fa-at"></i> */}
                                <FontAwesomeIcon className="footer-item-i" icon={faAt} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="bottom" style={{ boxShadow: 'none' }}>
                    کلیه حقوق محفوظ می باشد 2024 ©
                </div>
            </div>

        </footer>
    );
}

export default Footer;
