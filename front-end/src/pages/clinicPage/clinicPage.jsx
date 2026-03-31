import { useState } from "react";
import ClinicList from "../../components/clinics/clinicList";
import Sidebar from "../../components/sidebar/sideBar";

const ClinicsPage = () => {


  return (
    // <div className="min-h-screen bg-gray-100 p-2 ">
    //   <div className="p-4 mx-auto border borer-gray-300 rounded-3xl bg-white shadow-lg">
    //     <h1 className="text-3xl font-bold mb-6">
    //       Clinics Management
    //     </h1>

        <ClinicList />
    //   </div>
    // </div>
  );
};

export default ClinicsPage;