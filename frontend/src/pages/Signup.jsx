import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "@mui/material";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if (!username) {
      return toast.error("Please enter your email");
    }
    if (!email) {
      return toast.error("Please enter your email");
    }
    if (!password) {
      return toast.error("Please enter your password");
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/signup",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data;

      sessionStorage.setItem("user", JSON.stringify(userData));

      navigate("/userProfile");

      toast.success("Signup successful!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <div className="form-label">
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your user name"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-label">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-label">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <p>
          {`If you have a account? `}
          <Link to="/">Login</Link>
        </p>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Logging in..." : "Signup"}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
