import React, { useEffect, useState } from "react"
import { doctorService } from "../services/doctorService"
import { useNavigate } from "react-router-dom"
import doctorImg from "../images/home_booking-removebg-preview.png"
import img1 from "../images/img1.png"
import img2 from "../images/img2.png"
import img3 from "../images/img3.png"
import img4 from "../images/img4.png"
import img5 from "../images/img5.png"
import img6 from "../images/img6.png"
import d from "../../public/doctors/Ham.jpg"
import bannerImg from "../images/banner-removebg-preview.png"
import Footer from "../components/footer"
import Navbar from "../components/Header"
import "../styles/HomePage.css"

function HomePage() {
  const [topDoctors, setTopDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const SPECIALTIES = [
    {
      name: "General physician",
      image: img1
    },
    {
      name: "Gynecologist",
      image: img2
    },
    {
      name: "Dermatologist",
      image: img3
    },
    {
      name: "Pediatrician",
      image: img4
    },
    {
      name: "Neurologist",
      image: img5
    },
    {
      name: "Gastroenterologist",
      image: img6
    }
  ]

  useEffect(() => {
    doctorService
      .getDoctors()
      .then((data) => {
        setTopDoctors(data.slice(0, 8))
        setLoading(false)
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách bác sĩ:", error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Navbar />

      <div className="home">

        <div className="hero1">
          <div className="hero_left">
            <h1>
              Book Appointment <br />
              With Trusted Doctors
            </h1>

            <p>
              Simply browse through our extensive list of trusted doctors,
              schedule your appointment hassle-free.
            </p>

            <button className="more_book" onClick={() => navigate("/register")}>Book Appointment →</button>
          </div>

          <div className="hero_right">
            <img src={doctorImg} alt="doctor" />
          </div>
        </div>

        <div className="speciality">
          <h2>Find By Speciality</h2>
          <p>
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>

          <div className="specialty-list">
            {SPECIALTIES.map((item) => (
              <div
                key={item.name}
                onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(item.name)}`)}
                className="specialty-item"
              >
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="topDoctors">
          <h2>Top Doctors to Book</h2>
          <p>Simply browse through our extensive list of trusted doctors.</p>

          <div className="doctor_list">
            {loading ? (
              <p>Loading...</p>
            ) : topDoctors.length === 0 ? (
              <p>No doctors found</p>
            ) : (
              topDoctors.map((doc) => (
                <div className="doctor_card" key={doc.id}>
                  <img src={doc.image || d} alt={doc.name} />

                  <div className="doctor_info">
                    <span className="status">● Available</span>
                    <h3>{doc.name}</h3>
                    <p>{doc.specialty}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="more_btn" onClick={() => navigate("/doctors")}>More Doctors</button>
        </div>

        <div className="banner">
          <div className="banner_left">
            <h2>Book Appointment</h2>
            <h1>with 10+ Trusted Doctors</h1>
            <button className="more_btn" onClick={() => navigate("/register")}>Create account</button>
          </div>

          <div className="banner_right">
            <img src={bannerImg} alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage;