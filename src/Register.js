import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
} from "./firebase";
import "./Register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    registerWithEmailAndPassword( email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/Weather");
  }, [user, loading]);
  return (
    <><br /><div className="register">
          <div className="register__container">
              <input
                  type="text"
                  className="register__textBox"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail Address" />
              <input
                  type="password"
                  className="register__textBox"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" />
              <button className="register__btn" onClick={register}>
                  Register
              </button>
              <div>
                  Already have an account? <Link to="/">Login</Link> now.
              </div>
          </div>
      </div></>
  );
}
export default Register;