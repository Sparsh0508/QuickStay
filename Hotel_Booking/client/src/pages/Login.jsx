import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError } from "../../utils";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Please fill all the fields");
    }
    try {
      const url = "http://localhost:3000/api/user/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Login successful!");
        login({ name: data.name, email: data.email, role: data.role }, data.token);
        setLoginInfo({
          email: "",
          password: "",
        });
        setTimeout(() => {
          if (data.role === "hotelOwner") {
            navigate("/owner");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        handleError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      handleError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              required
              value={loginInfo.email}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              required
              value={loginInfo.password}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 hover:underline font-medium"
            >
              Signup
            </Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
