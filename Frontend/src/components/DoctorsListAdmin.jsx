import { useEffect, useState } from "react";
import { doctorService } from "../services/doctorService";
import "../styles/DoctorsList.css"; 
import ham from "../../public/doctors/Ham.jpg"

function DoctorsListAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.getDoctors()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <h2>All Doctors</h2>

      <div className="grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          doctors.map((doc) => (
            <div className="card" key={doc.id}>
              
              {/* IMAGE */}
              <img
                src={ham}
                alt=""
              />

              {/* INFO */}
              <div className="card-body">
                <p className="name">{doc.name}</p>
                <p className="specialty">{doc.specialty}</p>
                <p className="status">Available</p>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorsListAdmin;