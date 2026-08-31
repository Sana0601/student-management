
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        course: "",
        year: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Password validation
        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Phone validation
        if (
            formData.phone &&
            !/^[0-9]{10}$/.test(formData.phone)
        ) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

        setLoading(true);

        try {
            // Do not send confirmPassword to the backend
            const { confirmPassword, ...studentData } = formData;

            await api.post(
                "/api/students/register",
                studentData
            );

            setMessage(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Registration failed. Email may already exist."
                );
            } else {
                setError("Unable to connect to the server.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-md-7 col-lg-6">

                        <div className="card shadow border-0">

                            <div className="card-body p-5">

                                <div className="text-center mb-4">

                                    <div style={{ fontSize: "50px" }}>
                                        🎓
                                    </div>

                                    <h2 className="fw-bold">
                                        Student Registration
                                    </h2>

                                    <p className="text-muted">
                                        Create your student account
                                    </p>

                                </div>

                                {message && (
                                    <div className="alert alert-success">
                                        {message}
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister}>

                                    {/* Full Name */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                        />

                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            minLength="6"
                                            required
                                        />

                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            required
                                        />

                                    </div>

                                    {/* Phone */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter 10-digit phone number"
                                            maxLength="10"
                                        />

                                    </div>

                                    {/* Course */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Course
                                        </label>

                                        <input
                                            type="text"
                                            name="course"
                                            className="form-control"
                                            value={formData.course}
                                            onChange={handleChange}
                                            placeholder="Example: Computer Science"
                                        />

                                    </div>

                                    {/* Year */}
                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Year
                                        </label>

                                        <select
                                            name="year"
                                            className="form-select"
                                            value={formData.year}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Select Year
                                            </option>

                                            <option value="First Year">
                                                First Year
                                            </option>

                                            <option value="Second Year">
                                                Second Year
                                            </option>

                                            <option value="Third Year">
                                                Third Year
                                            </option>

                                            <option value="Final Year">
                                                Final Year
                                            </option>

                                        </select>

                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100"
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Creating Account..."
                                            : "Create Account"}

                                    </button>

                                </form>

                                <hr className="my-4" />

                                <div className="text-center">

                                    <p className="text-muted mb-2">
                                        Already have an account?
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate("/login")
                                        }
                                    >
                                        Login
                                    </button>

                                </div>

                            </div>

                        </div>

                        <p className="text-center text-muted mt-3">
                            Student Management System
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;

