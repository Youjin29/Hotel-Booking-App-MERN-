import "./registerInput.css";
import { useState } from "react"; 

const RegisterInput = (props) => {
    const { label, errorMessage, id, onChange, ...others} = props;

    const [checkedInput, setCheckedInput] = useState(false);

    return (
        <div className="riContainer">
            <label className="riLabel">{label}</label>
            <input className="riInput" key={id} {...others} onChange={onChange} onBlur={() => {setCheckedInput(true)}} checkedinput={props.name === "confirmPassword" ? "true" : checkedInput.toString()}/>
            <span className={props.name === "password" || props.name === "username"? "riInputRemind" :"riErrorMessage"}>{errorMessage}</span>
        </div>
    )
}

export default RegisterInput