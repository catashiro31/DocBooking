import React from "react"
import "../styles/Footer.css"
import { NavLink } from "react-router-dom"
import ft from "../images/footer.png"

function Footer() {
    return (
        <>
            <div className="footer">
                <div className="footer-top">
                    <div className="footer-left">
                        <img src={ft} alt="footer" className="footer-logo" />
                        <p className="footer-desc">
                            Your trusted healthcare companion. Book doctor appointments,
                            manage schedules, and access medical services with ease.
                            Designed for efficiency, Medicheck simplifies healthcare
                            management with a user-friendly interface. Stay connected with
                            top doctors and ensure timely medical care.
                        </p>
                    </div>

                    <div className="footer-middle">
                        <h3>Company</h3>
                        <ul>
                            <a className="active" href="/"><li>Home</li></a>
                            <a href="/doctors"><li>All Doctors</li></a>
                            <a href="/about"><li>About</li></a>
                            <a href="/contact"><li>Contact</li></a>
                        </ul>
                    </div>

                    <div className="footer-right">
                        <h3>Get In Touch</h3>
                        <ul>
                            <li>+91-876-702-0032</li>
                            <li>medicheck@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>Copyright 2024@ MediCheck - All Right Reserved.</p>
            </div>
        </>
    )
}

export default Footer