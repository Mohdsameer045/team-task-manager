import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
    role:"member"
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );

      alert("Signup Success");
      navigate("/");
    } catch {
      alert("Signup Failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        <input className="w-full border p-2 mb-2"
          placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input className="w-full border p-2 mb-2"
          placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input type="password"
          className="w-full border p-2 mb-2"
          placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <select
          className="w-full border p-2 mb-3"
          onChange={(e)=>setForm({...form,role:e.target.value})}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSignup}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Signup
        </button>

        <p className="mt-3 text-sm">
          Already have account?
          <Link to="/" className="text-blue-600"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;