import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import BookingItem from "../../components/bookingItem/BookingItem";
import {AuthContext} from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import "./account.css"

const Account = () => {
    const {user, dispatch} = useContext(AuthContext)
    const {data, loading, error, refetch} = useFetch(`/booking/${user._id}`)
    const [page, setPage] = useState("upcoming");
    const navigate = useNavigate();

    const handleTab = (e) => {
        setPage(e.target.value)
    };

    let filteredData = [];

    if (page === "upcoming") {
        filteredData = data.filter(booking => new Date(booking.endDate) >= new Date());
    } else {
        filteredData = data.filter(booking => new Date(booking.endDate) < new Date());
    };

    const handleClick = () => {
        navigate("/");
    }

    if (error) {
        dispatch({type:"LOG_OUT"});
    }
    return (
        <div className="accountOuterContainer">
            <Navbar/>
            <div className="accountContentContainer">
                <h1 className="">Bookings & Trips</h1>
                <div className="accountTab">
                    <div className={page === "upcoming"? "active" : ""}><button className={page === "upcoming"? "active" : ""} value="upcoming" onClick={handleTab}>Upcoming</button></div>
                    <div className={page === "completed"? "active" : ""}><button className={page === "completed"? "active" : ""} value="completed" onClick={handleTab}>Completed</button></div>
                </div>
                {loading? "Loading please wait..." :
                 filteredData.length === 0? <>
                 <div className="accountNoBookings">
                    <FontAwesomeIcon icon={faEarthAmericas} size="10x" style={{color: "rgb(158, 184, 217, 0.8)", marginTop:"100px"}} />
                    <span>You have no upcoming bookings, start planning your next trip!</span>
                    <button onClick={handleClick}>Book now</button>
                 </div>
                 </> :
                 filteredData.map((booking, index) => (
                    <BookingItem key={index} booking={booking} refetch={refetch}/>
                ))
                }
            </div>
            <MailList/>
            <Footer/>
        </div>
    )
}

export default Account;