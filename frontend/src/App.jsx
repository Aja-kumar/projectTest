import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import { Toaster } from "react-hot-toast";
import UpdateProfile from "./pages/UpdateProfile";

const App = () => {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userProfile/" element={<UserProfile />} />
          <Route path="/updateProfile/:id" element={<UpdateProfile />} />
        </Routes>
      </div>
      <Toaster />
    </>
  );
};

export default App;
