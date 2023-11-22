import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
 
import "./bookingAlert.css";

const BookingAlert = (props) => {

    const { status } = props;
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const handleClick = () => {
        navigate("/account")
    };

    const handleCancel = async () => {
        try{
            console.log(user._id)
            await axios.delete(`/booking/${user._id}/${props.value}`);
            props.setOpen(false);
            navigate("/account");
            props.refetch();
        } catch(err) {
            alert("Something went wrong, please sign in again!");
        }
    }

    return (
        <div className="baContainer">
            { status === "bookingConfirm"?
            <div className="baDiv">
                <FontAwesomeIcon className="baCheck" icon={faCircleCheck} size="5x" style={{color: "#50cd23", backgroundColor: "white", borderRadius: "50%"}} />
                <h1 className="baHeader">Hooray!</h1>
                <span className="baMessage">Your booking has been confirmed.</span>
                <button className="baButton" onClick={handleClick}>Manage booking</button>
            </div>
            :
            <div className="baDiv">
                <FontAwesomeIcon className="baCheck" icon={faCircleXmark} size="5x" style={{color: "#ccc", backgroundColor: "white", borderRadius: "50%"}} />
                <h1 className="baHeader cancel">Confirm cancellation</h1>
                <span className="baMessage cancel">Do you want to cancel this booking?</span>
                <div className="baCancelButtons">
                    <button className="baButton cancel" onClick={handleCancel}>Confirm</button>
                    <button className="baButton noCancel" onClick={() => {props.setOpen(false)}}>Go back</button>
                </div>
            </div>
            }
        </div>
    )
}

export default BookingAlert;