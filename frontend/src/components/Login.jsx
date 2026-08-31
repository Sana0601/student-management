import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/api/students/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(
                "student",
                JSON.stringify(response.data.student)
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            if (error.response) {
                setMessage(
                    error.response.data.message ||
                    "Invalid email or password"
                );
            } else {
                setMessage(
                    "Unable to connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-md-6 col-lg-5">

                        <div className="card shadow border-0">

                            <div className="card-body p-5">

                                <div className="text-center mb-4">

                                    <div style={{ fontSize: "50px" }}>
                                        🎓
                                    </div>

                                    <h2 className="fw-bold">
                                        Student Login
                                    </h2>

                                    <p className="text-muted">
                                        Sign in to your account
                                    </p>

                                </div>

                                {message && (
                                    <div className="alert alert-danger">
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleLogin}>

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Enter your email"
                                            required
                                        />

                                    </div>

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control form-control-lg"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter your password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Logging in..."
                                            : "Login"}
                                    </button>

                                </form>

                                <hr className="my-4" />

                                <div className="text-center">

                                    <p className="text-muted mb-2">
                                        Don't have an account?
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate("/register")
                                        }
                                    >
                                        Create Account
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

export default Login;