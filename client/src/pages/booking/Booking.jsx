import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import useFetch from "../../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./booking.css"

const Booking = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [roomsDetail, setRoomsDetail] = useState([]);
    const [roomsDetailLoading, setRoomsDetailLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const userId = user._id;
    const bookingId = location.pathname.split("/")[2];
    const {data, loading, error} = useFetch(`/booking/${userId}/${bookingId}`);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate)

    const findDays = (date1, date2) => {
        const millisecondsPerDay = 24 * 3600 * 1000;
        const difference = date2.getTime() - date1.getTime();
        return difference / millisecondsPerDay;
      }

    const noOfDays = findDays(startDate, endDate);
    const noOfRooms = Object.values(roomsDetail).flat().length;
   
    console.log(data)
    
    useEffect(() => {
        const fetchData = async () => {
            setRoomsDetailLoading(true);
            try{
                const response = await axios.post("/rooms/reservedRooms", data.roomsDetail);
                setRoomsDetail(response.data);
            } catch(err) {
                console.log(err)
            }
            setRoomsDetailLoading(false);
        };
        fetchData();
    }, [data.roomsDetail])
    return (
        <div>
            <Navbar/>
            <div className="bookingPageContainer">
                { loading? "Loading please wait..." :
                <div className="bookingPageWrapper">
                    <Link to="/account" style={{textDecoration:"none", color:"inherit"}}>
                    <div style={{display:"flex", gap: "10px", marginTop:"20px", alignItems:"center"}}>
                        <div className="bookingPageBackArrow"></div>
                        <span style={{color:"#003580"}}>Back to bookings</span>
                    </div>
                    </Link>

                    <div className="bookingPageHotelDiv">
                        <img src={data.hotel?.photos[0]} alt="hotel"/>
                        <span className="bookingPageHotelName">{data.hotel?.name}</span>
                        <span className="bookingPageHotelRating"><FontAwesomeIcon icon={faStar} style={{color:"orange"}}/><FontAwesomeIcon icon={faStar} style={{color:"orange"}}/><FontAwesomeIcon icon={faStar} style={{color:"orange"}}/><FontAwesomeIcon icon={faStar} style={{color:"orange"}}/><FontAwesomeIcon icon={faStar} style={{color:"orange"}}/></span>
                        <span style={{fontSize:"13px"}}>Property-phone: <span style={{letterSpacing:"0.6px"}}>0123456789</span></span>
                        <div className="bookingPageHotelDatesWrapper">
                            <div>
                                <span className="bookingPageHotelDatesTitle">Check-in</span>
                                <span>{months[startDate.getMonth()]} {startDate.getDate()}, {startDate.getFullYear().toString().slice(2,)}</span>
                            </div>
                            <span className="bookingPageHotelNoOfNights">{noOfDays} {noOfDays > 1? "nights": "night"}</span>
                            <div>
                                <span className="bookingPageHotelDatesTitle">Check-out</span>
                                <span>{months[endDate.getMonth()]} {endDate.getDate()}, {endDate.getFullYear().toString().slice(2,)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bookingPageRoomDiv">
                        <h2 className="bookingPageH2">Room information</h2>
                        <table style={{fontSize: "15px", margin:"30px auto"}}>
                            <thead>
                                <tr style={{borderBottom:"solid black"}}>
                                    <th className=""></th>
                                    <th className="">Room Types</th>
                                    <th className=""></th>
                                    <th className="">Room Numbers</th>
                                </tr>
                            </thead>
                            <tbody>
                                { roomsDetailLoading? <tr><td>Loading please wait...</td></tr> :
                                <>
                                { roomsDetail?.map((roomDetail, index) => {
                                    return (
                                    <tr key={index}>
                                        <td>{index+1}.</td>
                                        <td className=""><b>{roomDetail.roomType}</b></td>
                                        <td className=""></td>
                                        <td className=""><b>{roomDetail.roomNumbers.join(", ")}</b> <br/> ({roomDetail.roomNumbers.length} {roomDetail.roomNumbers.length > 1? "rooms" : "room"})</td>
                                    </tr>
                                    )
                                })}
                                </>}
                            </tbody>
                        </table>
                        <span style={{fontSize:"13px"}}>Features: {data.hotel?.facilities.join(", ")}</span>
                    </div>

                    <div className="bookingPageGuestDiv">
                        <h2 className="bookingPageH2">Guest Information</h2>
                        <div>
                            <h3>Lead guest</h3>
                            <span>{data.name}</span>
                        </div>
                        <hr/>
                        <div>
                            <h3>Email</h3>
                            <span>{data.email}</span>
                        </div>
                        <hr/>
                        <div>
                            <h3>Contact</h3>
                            <span>{data.phone}</span>
                        </div>
                    </div>

                    <div className="bookingPagePolicyDiv">
                        <h2 className="bookingPageH2">Cancellation policy</h2>
                        <span style={{fontSize:"13px"}}>Failure to arrive at your hotel or property will be treated as a No-Show and will incur a charge of 100% of the booking value (Hotel policy).</span>
                    </div>

                    <div className="bookingPagePaymentDiv">
                        <h2 className="bookingPageH2">Payment information</h2>
                        <div style={{fontSize:"13px"}}>
                            <span>{noOfRooms} room(s) x {noOfDays} night(s)</span><span>MYR {data.price}</span>
                        </div>
                        <hr/>
                        <div style={{fontWeight:"600"}}>
                            <span>Total Charge</span><span>MYR {data.price}</span>
                        </div>
                    </div>
                </div>
                }
                <MailList/>
                <Footer/>
            </div>
        </div>
    )
}

export default Booking