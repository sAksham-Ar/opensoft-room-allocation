import { useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            alert("Login is required");
            window.location.href = "/";
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("name");
        localStorage.removeItem("rollNo");
        window.location.href = "/";
    };

    return (
        <div className="dashboard">
            <h1>Hi {localStorage.getItem("name")}</h1>
            <Link to="/book">
                <button>
                    Book room
                </button>
            </Link>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;