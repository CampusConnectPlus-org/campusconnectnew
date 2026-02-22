import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();      // prevent page reload
        // TODO: validate login / call API here later
        navigate("/");           // ✅ redirect to home
    };
    return (
        <div className="login-page">
            <div className="login-card">
                <h2>CampusConnect</h2>
                <p>Login to your account</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" required />
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>

                    <div className="login-links">
                        <a href="#">Forgot password?</a>
                        <span> | </span>
                        <a href="#">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}