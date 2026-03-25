import { useEffect, useState } from "react";

import admin1 from "../images/admin_board1.png";
import admin2 from "../images/admin_board2.png";
import admin3 from "../images/admin_board3.png";
import icon from "../images/admin_icon.png";

import "../styles/Dashboard.css";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const MOCK_BOOKINGS = [
    { id: 1, doctorName: "Dr. Rakesh Sharma", date: "2026-03-20", status: "CONFIRMED" },
    { id: 2, doctorName: "Dr. Rakesh Sharma", date: "2026-03-20", status: "CONFIRMED" },
    { id: 3, doctorName: "Dr. Kavita Joshi", date: "2026-03-20", status: "CONFIRMED" },
    { id: 4, doctorName: "Dr. Rakesh Sharma", date: "2026-03-18", status: "CONFIRMED" },
    { id: 5, doctorName: "Dr. Rohit Sharma", date: "2026-03-18", status: "CANCELLED" },
  ];

  useEffect(() => {
    setBookings(MOCK_BOOKINGS);
    setLoading(false);
  }, []);

  const handleCancel = (id) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "CANCELLED" } : item
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">

      {/* ===== CARDS ===== */}
      <div className="cards">
        <div className="card">
          <img src={admin1} alt="" />
          <div>
            <p className="number">11</p>
            <p>Doctors</p>
          </div>
        </div>

        <div className="card">
          <img src={admin2} alt="" />
          <div>
            <p className="number">107</p>
            <p>Appointments</p>
          </div>
        </div>

        <div className="card">
          <img src={admin3} alt="" />
          <div>
            <p className="number">63</p>
            <p>Patients</p>
          </div>
        </div>
      </div>

      {/* ===== BOOKINGS ===== */}
      <div className="booking-card">
        <div className="booking-header">
          <img src={icon} alt="" />
          <p>Latest Bookings</p>
        </div>

        <div className="booking-list">
          {bookings.map((item) => (
            <div className="booking-item" key={item.id}>

              <div className="left">
                <img
                  src={`https://randomuser.me/api/portraits/men/${item.id % 100}.jpg`}
                  alt=""
                />
                <div>
                  <p className="name">{item.doctorName}</p>
                  <p className="date">
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div>
                {item.status?.toLowerCase() === "cancelled" ? (
                  <span className="cancelled">Cancelled</span>
                ) : (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(item.id)}
                  >
                    ×
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;