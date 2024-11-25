import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUpdateData(parsedData.data);
          setUsername(parsedData.data.username);
          setEmail(parsedData.data.email);
        }
      } catch (error) {
        console.error(error.message);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("username", username);

    try {
      const response = await axios.put(
        `http://localhost:4000/api/auth/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/userProfile");
      }
      toast.success("updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-label">
          <label>Profile Image</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className="form-label">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-label">
          <label>Email</label>
          <input type="email" value={email} readOnly />
        </div>
        {error && <div className="error-message">{error}</div>}
        <Button type="submit" variant="contained" color="success">
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
