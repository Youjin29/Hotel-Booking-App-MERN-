
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingAlert from "../bookingAlert/BookingAlert";

import "./bookingItem.css";



const BookingItem = (props) => {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    const {booking} = props; 
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const optionRef = useRef();
    const navigate = useNavigate();

    const handleOption = () => {
        setOpenDropdown(!openDropdown);
    }

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    const noOfRooms = Object.values(booking.roomsDetail).flat().length;

    useEffect(() => {
        let handler = (e) => {
          if (!optionRef.current.contains(e.target)) {
            setOpenDropdown(false);
          }
        }
        document.addEventListener("mousedown", handler);
    
        return(() => document.removeEventListener("mousedown", handler));
      })
    
    const handleClick = () => {
        navigate(`/account/${booking._id}`)
    }

    return (
        <>
        <div className="biContainer">
            <h1 className="biHeaderCity">{booking.hotel.city}</h1>
            <span className="biHeaderDates">{startDate.getDate()} {months[startDate.getMonth()]} - {endDate.getDate()} {months[endDate.getMonth()]}</span>
            <div className="biHotelDiv">
                <div className="biHotelInfos" onClick={handleClick}>
                    <img src={booking.hotel.photos[0] || ""} alt="hotel"></img>
                    <div className="biBookingDetails">
                        <span className="biHotelName">{booking.hotel.name}</span>
                        <span className="biDates">{startDate.getDate()} {months[startDate.getMonth()]} - {endDate.getDate()} {months[endDate.getMonth()]}</span>
                        <span className="biNoOfRoomsAndCity">{noOfRooms} {noOfRooms>1? "rooms": "room"} . {booking.hotel.city}</span>
                        {new Date() > endDate && <span>Completed</span>}
                    </div>
                </div>
                <div className="biPriceCancel">
                    <span>RM {booking.price}</span>
                    {endDate > new Date() &&
                    <div onClick={handleOption} ref={optionRef}>
                        <span>&#8942;</span>
                        <span className={`biDropdown ${openDropdown? "active" : ""}`} onClick={() => {setOpenConfirm(true)}}>Cancel booking</span>
                    </div>
                    }   
                </div>
            </div>
        </div>
        {openConfirm && <BookingAlert status="bookingCancel" setOpen={setOpenConfirm} value={booking._id} refetch={props.refetch}/>}
        </>
    )
}

export default BookingItem;