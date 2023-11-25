import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./register.css";
import RegisterInput from "../../components/registerInput/RegisterInput.jsx";

const Register = () => {
    const [ inputs, setInputs ] = useState({
        username: undefined,
        password: undefined,
        email: undefined,
        confirmPassword: undefined,
    });

    const [ isValid, setIsValid ] = useState({
        username: false,
        password: false,
        email: false,
        confirmPassword: false,
        allInputs: false,
    });

    const [registerError, setRegisterError] = useState(null);
    const [registerLoading, setRegisterLoading] = useState(false);

    const inputParams = [
        {
            id: 1,
            name: "username",
            type: "text" ,
            placeholder: "Username" ,
            label: "Username",
            pattern: "^[0-9A-Za-z]{6,16}$",
            errorMessage: "Username must contain between 6-16 characters, alphanumeric only.",
            required: true,
        },
        {
            id: 2 ,
            name: "password",
            type: "password",
            placeholder: "Password" ,
            label: "Password",
            pattern: "^(?=.*[^a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$",
            errorMessage: "Password must contain at least 8 characters, at least one letter and one number.",
            required: true,
        },
        {
            id: 3 ,
            name: "email",
            type: "email" ,
            placeholder: "Email" ,
            label: "Email",
            pattern: ".+.+.+",
            errorMessage: "Please enter a valid email.",
            required: true,
        },
        {
            id:  4,
            name: "confirmPassword",
            type: "password" ,
            placeholder: "Confirm password" ,
            label: "Confirm password",
            pattern: inputs.password,
            errorMessage: "Passwords do not match.",
            required: true,
        }
    ];

    const navigate = useNavigate();

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInputs((prev) => (
            {...prev, [name]: value}
        )  )
     
        const findInput = inputParams.find( input => input.name === name);
        const reg = RegExp(findInput.pattern);
        if (reg.test(value)) {
            setIsValid(prev => ({...prev, [name]:true}));
        } else{
            setIsValid(prev => ({...prev, [name]:false}));
        }
        };

    useEffect(() => {
        if (isValid.username && isValid.password && isValid.email && isValid.confirmPassword){
            setIsValid(prev => ({...prev, allInputs:true}));} else{
                setIsValid(prev => ({...prev, allInputs:false}))
            }
    }, [isValid.username, isValid.password, isValid.email, isValid.confirmPassword]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                const button = document.getElementById("submitRegister");
                if (button) {
                    button.click();
                }
            }
        }

        window.addEventListener("keydown", handleKeyPress);

        return (() => {
            window.removeEventListener("keydown", handleKeyPress);
        })
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setRegisterLoading(true);
            const response = await axios.post("/api/auth/register", inputs);
            navigate("/login",{state: {isRegistered: true}});
        } catch(err) {
            setRegisterError(err.response.data);
        }
        setRegisterLoading(false);
    };

    const handleBack = () => {
        navigate("/");
    };

    console.log(isValid)

    return (
        <div className="register">
            <div className="rLeftContainer">
                <div className="rLeftWrapper">
                    <Link to="/" style={{textDecoration:"none"}}>
                        <span className="registerLogo">geniebook</span>
                    </Link>
                    <span className="rPhrase">Are you ready for your next trip?
                </span>
                </div>
            </div>
            <div className="rRightContainer">
                <h1 className="signupHeader">Sign up here!</h1>
                {
                inputParams.map(input => 
                    <RegisterInput key={input.id} {...input} onChange={onChange} value={inputs[input.name]}/>
                )
                }
                <button id="submitRegister" disabled={!isValid.allInputs || registerLoading} className="registerButton" onClick={handleRegister}>Confirm</button>
                <button id="loginBackButton" disabled={registerLoading} onClick={handleBack} className="registerButton">Back to home</button>
                { registerLoading? <span style={{fontSize:"15px"}}>Signing you up now! Please wait...</span> : registerError &&
                <div className="rDbErrorMessageContainer">
                    <span className="dbErrorMessage">{registerError.message}</span>
                </div>
                }
            </div>
        </div>
    )
}

export default Register;