import about_img from "../images/about.png"
import "../styles/About.css"
import Navbar from "../components/Header"
import Footer from "../components/footer"

function About() {
    return (
        <>
            <Navbar />
            <h1 className="topic">About Us</h1>
            <div className="about_container_top">
                <div className="about_left_top">
                    <img src={about_img} alt="about" />
                </div>

                <div className="about_right_top">
                    <div>
                        <p>Welcome to MediCheck, your trusted partner in managing your healthcare needs conveniently 
                            and efficiently. At Medicheck, we understand the challenges individuals face when it comes 
                            to scheduling doctor appointments and managing their health records.</p>                       
                    </div>

                    <div>
                        <p>MediCheck is committed to excellence in healthcare technology. We continuously strive to 
                            enhance our platform, integrating the latest advancements to improve user experience and 
                            deliver superior service. Whether you're booking your first appointment or managing ongoing 
                            care, Prescripto is here to support you every step of the way.</p>                      
                    </div>

                    <div>
                        <b>Our Vision</b>
                    </div>

                    <div>
                        <p>Our vision at MediCheck is to create a seamless healthcare experience for every user. 
                            We aim to bridge the gap between patients and healthcare providers, making it easier 
                            for you to access the care you need, when you need it.</p>
                    </div>

                </div>
            </div>
            <h1 className="reason">Why Choose Us</h1>
            <div className="about_container_buttom">
                <div className="about1">
                    <b>EFFICIENCY:</b>
                    <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
                </div>
                <div className="about2">
                    <b>CONVENIENCE:</b>
                    <p>Access to a network of trusted healthcare professionals in your area.</p>
                </div>
                <div className="about3">
                    <b>PERSONALIZATION:</b>
                    <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default About