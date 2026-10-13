import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";                     
import Dashboard from "./components/Dashboard";  
import Assistant from "./components/Assistant";
import UserContext from "./context/UserContext";
import Recommendation from "./components/Recommendation";
import Payment from "./components/Payment";
import Success from "./components/Success";
import RoleLogin from "./components/RoleLogin";
import RoleDashboard from "./components/RoleDashboard";

const App = () => {
  return (
    <Router>
      <UserContext>
       
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Home/>} />
          <Route path="/login/:role" element={<RoleLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/doctor-dashboard" element={<RoleDashboard role="doctor" />} />
          <Route path="/hospital-dashboard" element={<RoleDashboard role="hospital" />} />
          <Route path="/admin-dashboard" element={<RoleDashboard role="admin" />} />
        </Routes>
      </UserContext>
    </Router>
  );
};

export default App;
