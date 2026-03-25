import ct from "../images/contact.png"
import "../styles/Contact.css"
import Navbar from "../components/Header"
import Footer from "../components/footer";

function Contact() {
  return (
    <>
      <Navbar />
      <h1>Contact Us</h1>

      <div className="contact_container">
        <div className="contact_left">
          <img src={ct} alt="contact" />
        </div>

        <div className="contact_right">
          <div className="topic">Our Office</div>

          <div>
            <p>431213 Midc Area</p>
            <p>Jalna, Maharashtra, India</p>
          </div>

          <div>
            <p>Phone: +91-876-702-0032</p>
            <p>Email: medicheck@gmail.com</p>
          </div>

          <div>
            <p>Careers at MediCheck</p>
          </div>

          <div>
            <p>Learn more about our teams and job openings.</p>
          </div>

          <button>Explore Jobs</button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact;