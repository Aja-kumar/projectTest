import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchUserData = async (userId) => {
    try {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/auth/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const userData = response.data;
      // console.log(userData);
      setData(userData.user);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in.");
      } else {
        console.error(error);
        toast.error("Failed to fetch user data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const userId = parsedData.data._id;

        if (userId) {
          fetchUserData(userId);
        } else {
          console.error("User ID not found in session storage");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.error("No user data found in session storage");
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
      {data?.username ? (
        <div>
          <div>
            <img src={data.userProfile} alt="Profile" />
          </div>
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
