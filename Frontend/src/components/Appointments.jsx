import ic from "../images/icon_Appointment.png";
import "../styles/Appointment.css";

function Appointments() {
  const data = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    age: 22,
    date: "20 Mar 2026",
    time: "09:00 AM",
    doctor: "Dr. Rakesh Sharma",
    fee: 300,
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Trần Thị B",
    age: 25,
    date: "21 Mar 2026",
    time: "10:30 AM",
    doctor: "Dr. Kavita Joshi",
    fee: 400,
    status: "Pending",
  },
  {
    id: 3,
    name: "Lê Văn C",
    age: 30,
    date: "22 Mar 2026",
    time: "02:00 PM",
    doctor: "Dr. Rohit Sharma",
    fee: 350,
    status: "Cancelled",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    age: 28,
    date: "23 Mar 2026",
    time: "11:15 AM",
    doctor: "Dr. Rakesh Sharma",
    fee: 500,
    status: "Confirmed",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    age: 35,
    date: "24 Mar 2026",
    time: "03:45 PM",
    doctor: "Dr. Kavita Joshi",
    fee: 450,
    status: "Pending",
  },
];

  return (
    <div>
      <p>ALL Appointments</p>

      {/* HEADER */}
      <div className="table-header">
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fee</p>
        <p>Actions</p>
      </div>

      {/* DATA */}
      {data.map((item, index) => (
        <div className="table-row" key={item.id}>
          <p>{index + 1}</p>

          <div className="patient">
            <img src={ic} alt="" />
            <p>{item.name}</p>
          </div>

          <p>{item.age}</p>
          <p>{item.date} - {item.time}</p>
          <p>{item.doctor}</p>
          <p>₹{item.fee}</p>
          <p>{item.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Appointments;