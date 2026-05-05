import './AdminLogin'
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function AdminLogin({setAdmin}) {
    
      const [email, setEmail] = useState("");
          const [password, setPassword] = useState("");
           const navigate = useNavigate();

           const handleAdminLogin = async (e) =>{
            e.preventDefault();
              const response = await fetch("http://localhost:5000/api/auth/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
      
    });
        const data = await response.json();
    console.log(data);
       if(data.token){
     
      localStorage.setItem("admin",JSON.stringify(data));
       localStorage.setItem("token",data.token);
      setAdmin(data.admin);
       navigate(`/admindashboard`);
        console.log(data)
    }
  else{
      setPassword("");
      navigate("/");

  }
   
           }
    return (
        
        <div className="login-page">
            <div className="login-card">
                <h2>CampusConnect+</h2>
                <p>Login to your Admin account</p>


                <form onSubmit={handleAdminLogin} >
                    <div className="form-group">
                        <label>Admin User</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email " required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                    </div>

                    <button  type="submit" className="login-btn">
                        Login
                    </button>

                    {/* <div className="login-links">
                        <a href="#">Forgot password?</a>
                       
                    </div> */}
                </form>
            </div>
        </div>
    );
}