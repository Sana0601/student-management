import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [editingStudent, setEditingStudent] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
        year: ""
    });

    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    const loggedInStudent = JSON.parse(
        localStorage.getItem("student")
    );

    // Fetch all students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get("/api/students", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStudents(response.data);

            } catch (error) {
                console.error(error);
                setError("Unable to load students.");
            }
        };

        fetchStudents();
    }, [navigate]);


    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("student");

        navigate("/login");
    };


    // Open edit form
    const handleEdit = (student) => {
        setEditingStudent(student);

        setEditForm({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            course: student.course || "",
            year: student.year || ""
        });
    };


    // Handle edit input
    const handleChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };


    // Update student
    const handleUpdate = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await api.put(
                `/api/students/${editingStudent.id}`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStudents(
                students.map((student) =>
                    student.id === editingStudent.id
                        ? response.data
                        : student
                )
            );

            // Update logged-in student information
            if (
                loggedInStudent &&
                editingStudent.email === loggedInStudent.email
            ) {
                localStorage.setItem(
                    "student",
                    JSON.stringify(response.data)
                );
            }

            setEditingStudent(null);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to update student."
            );

        } finally {
            setSaving(false);
        }
    };


    // Cancel edit
    const handleCancelEdit = () => {
        setEditingStudent(null);
    };
    const handleDelete = async (student) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete your account, ${student.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/api/students/${student.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove student from table
            setStudents(
                students.filter(
                    (s) => s.id !== student.id
                )
            );

            // Logout after deleting own account
            localStorage.removeItem("token");
            localStorage.removeItem("student");

            alert("Account deleted successfully.");

            navigate("/login");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete account."
            );
        }
    };

    // Search
    const filteredStudents = students.filter((student) =>
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase()) ||
        student.course?.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="bg-light min-vh-100">

            {/* Navbar */}

            <nav className="navbar navbar-dark bg-primary shadow">

                <div className="container">

                    <span className="navbar-brand fw-bold">
                        🎓 Student Management System
                    </span>

                    <button
                        className="btn btn-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            <div className="container py-5">

                {/* Welcome */}

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Welcome, {loggedInStudent?.name || "Student"} 👋
                    </h2>

                    <p className="text-muted">
                        Here you can view all registered students.
                    </p>

                </div>


                {/* Statistics */}

                <div className="row g-4 mb-5">

                    <div className="col-md-4">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Total Students
                                </h6>

                                <h2 className="fw-bold">
                                    {students.length}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Computer Science
                                </h6>

                                <h2 className="fw-bold">

                                    {
                                        students.filter(
                                            (student) =>
                                                student.course ===
                                                "Computer Science"
                                        ).length
                                    }

                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Logged-in Student
                                </h6>

                                <h5 className="fw-bold">
                                    {loggedInStudent?.email}
                                </h5>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Error */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}


                {/* Edit Form */}

                {editingStudent && (

                    <div className="card shadow-sm border-0 mb-4">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                Edit My Profile
                            </h4>

                            <form onSubmit={handleUpdate}>

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={editForm.name}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={editForm.email}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            value={editForm.phone}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Course
                                        </label>

                                        <input
                                            type="text"
                                            name="course"
                                            className="form-control"
                                            value={editForm.course}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">
                                            Year
                                        </label>

                                        <input
                                            type="text"
                                            name="year"
                                            className="form-control"
                                            value={editForm.year}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>

                            </form>

                        </div>

                    </div>

                )}


                {/* Students Table */}

                <div className="card shadow-sm border-0">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h4 className="fw-bold mb-0">
                                All Registered Students
                            </h4>

                            <input
                                type="text"
                                className="form-control"
                                style={{ maxWidth: "300px" }}
                                placeholder="Search students..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead className="table-primary">

                                <tr>

                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Year</th>
                                    <th>Action</th>

                                </tr>

                                </thead>


                                <tbody>

                                {filteredStudents.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            No students found.
                                        </td>

                                    </tr>

                                ) : (

                                    filteredStudents.map((student) => (

                                        <tr key={student.id}>

                                            <td>
                                                {student.id}
                                            </td>

                                            <td className="fw-semibold">
                                                {student.name}
                                            </td>

                                            <td>
                                                {student.email}
                                            </td>

                                            <td>
                                                {student.phone || "-"}
                                            </td>

                                            <td>
                                                {student.course || "-"}
                                            </td>

                                            <td>
                                                {student.year || "-"}
                                            </td>


                                            {/* Edit only for logged-in student */}

                                            <td>

                                                {loggedInStudent &&
                                                    student.email ===
                                                    loggedInStudent.email && (

                                                        <div className="d-flex gap-2">

                                                            <button
                                                                className="btn btn-sm btn-warning"
                                                                onClick={() =>
                                                                    handleEdit(student)
                                                                }
                                                            >
                                                                ✏️ Edit
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() =>
                                                                    handleDelete(student)
                                                                }
                                                            >
                                                                🗑️ Delete
                                                            </button>

                                                        </div>

                                                    )}
                                            </td>

                                        </tr>

                                    ))

                                )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;