import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.js"; 
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
    const [ credentials, setCredentials ] = useState({
        username: undefined,
        password: undefined,
    });

    const {loading, error, dispatch} = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setCredentials((prev) => (
            {...prev, [e.target.id]: e.target.value}
        )  ) 
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch({type: "LOGIN_START"})
        try {
            const response = await axios.post("/api/auth/login", credentials);
            dispatch({type: "LOGIN_SUCCESS", payload: response.data});
            navigate("/");
        } catch(err) {
            dispatch({type: "LOGIN_FAILURE", payload: err.response.data})
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                const button = document.getElementById("submitLogin");
                if (button) {
                    button.click();
                }
            }
        }

        document.addEventListener("keydown", handleKeyPress);

        return (() => {
            document.removeEventListener("keydown", handleKeyPress);
        })
    }, []);

    return (
        <div className="login">
            <div className="lRightContainer">
                <div className="lRightWrapper">
                    <span className="lPhrase">Book your perfect stay with confidence.
                </span>
                </div>
            </div>
            <div className="lContainer">
                <h1 className="loginHeader">{ location.state?.isRegistered? "Signup successful, log in now!" : "Welcome"}</h1>
                <input type="text" placeholder="Username" id="username" onChange={handleChange} className="lInput" autoFocus/>
                <input type="password" placeholder="Password" id="password" onChange={handleChange} className="lInput"/>
                <button id="submitLogin" disabled={loading} onClick={handleLogin} className="lButton">Login</button>
                {loading? <span>Signing you in now, please wait...</span> : error && <span>{error.message}</span>}
            </div>
        </div>
    )
}

export default Login;