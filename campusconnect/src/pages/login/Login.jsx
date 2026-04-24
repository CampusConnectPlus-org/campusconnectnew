import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Login({ setUser }) {

    const [enrollmentNumber, setEnrollmentNumber] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                enrollmentNumber,
                password
            })

        });


        const data = await response.json();
        console.log(data);

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            navigate(`/`);
            console.log(data.user)
        }
        else {
            setPassword("");
            navigate("/login");

        }
        // if(data.success){
        //   setUser(data.user)
        //   navigate(`/`);
        // }else{

        //   setEnrollmentNumber("");
        //    setPassword("");
        //   //  navigate("/login")
        // }


    };
    return (
        <div className="login-page">
            <div className="login-card">
                <h2>CampusConnect+</h2>
                <p>Login to your account</p>


                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Enrollment
                            <input type="text" value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} placeholder="Enter your enrollment number" required /></label>
                    </div>

                    <div className="form-group">
                        <label>Password
                            <input type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" required /></label>
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>

                    {/* <div className="login-links"> */}
                        {/* <a href="#">Forgot password?</a> */}
                        {/* <span> | </span>
                        <a href="#">Create account</a> */}
                    {/* </div> */}
                </form>
            </div>
        </div>
    );
}