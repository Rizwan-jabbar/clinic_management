import DoctorsList from "../../components/doctors/doctorList";

const DoctorsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">👨‍⚕️ Doctors</h1>
      <DoctorsList />
    </div>
  );
};

export default DoctorsPage;