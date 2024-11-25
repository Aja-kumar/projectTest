import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setData(parsedData.data);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const handleEdit = () => {
    if (data) {
      navigate(`/updateprofile/${data._id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/auth/logout", {
        withCredentials: true,
      });
      sessionStorage.removeItem("user");
      navigate("/");
      toast.success("Logout successfully");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Container">
      {data ? (
        <div>
          <img
            src={
              data.UserProfile
                ? `http://localhost:4000${data.UserProfile}`
                : "fallback-image-url.jpg"
            }
            alt="Profile"
          />
          <Button variant="contained" color="success" onClick={handleEdit}>
            Edit
          </Button>

          <h2>
            User Name: <span>{data.username}</span>
          </h2>
          <h2>
            Email: <span>{data.email}</span>
          </h2>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default UserProfile;
