import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/mailList/MailList"
import BookingAlert from "../../components/bookingAlert/BookingAlert";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import "./confirm.css";

const Confirm = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    const location = useLocation();
    const navigate = useNavigate();
    const hotelId = location.pathname.split("/")[2];
    const { dates } = useContext(SearchContext);
    const { user, dispatch: authDispatch } = useContext(AuthContext);
    const [ userInfos, setUserInfos ] = useState({
        name: undefined,
        email: undefined,
        phone: undefined
    });

    const [checkedInput, setCheckedInput] = useState([false, false, false]);
    const [showWarning, setShowWarning] = useState(false);
    const selectedRooms = location.state.selectedRooms;

    const [roomsDetail, setRoomsDetail] = useState([]);
    const [roomsDetailLoading, setRoomsDetailLoading] = useState(false);
    const [roomsDetailError, setRoomsDetailError] = useState(undefined);

    const {data, loading, error} = useFetch(`/hotels/find/${hotelId}`);
    const [showBookingAlert, setShowBookingAlert] = useState(false);

    const eachDaySelected = (start, end) => {
        const day = new Date(start);
        const list = [];
        while ( day < end ) {
            list.push(day.getTime());
            day.setDate(day.getDate() + 1);
        };
        return list 
    };

    const allDates = eachDaySelected(dates[0].startDate, dates[0].endDate);

    const findDays = (date1, date2) => {
        const millisecondsPerDay = 24 * 3600 * 1000;
        const difference = date2.getTime() - date1.getTime();
        return difference / millisecondsPerDay;
      }

    const noOfDays = findDays(dates[0].startDate, dates[0].endDate);


    let totalPricePerNight = 0;
    for (const roomDetail of roomsDetail) {
        totalPricePerNight += roomDetail.roomPrice * roomDetail.roomNumbers.length * noOfDays
    }

    useEffect(() => {
        const fetchData = async () => {
            setRoomsDetailLoading(true);
            try{
                const response = await axios.post("/rooms/reservedRooms", selectedRooms);
                setRoomsDetail(response.data);
            } catch(err) {
                setRoomsDetailError(err);
            }
            setRoomsDetailLoading(false);
        };
        fetchData();
    }, [selectedRooms])

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setUserInfos(prev => ({...prev, [name]: value}))
    }

    const handleClick = async (e) => {
        e.preventDefault();
        const booking = {
            startDate: dates[0].startDate,
            endDate: dates[0].endDate,
            hotel: hotelId,
            roomsDetail: selectedRooms,
            price: totalPricePerNight,
            name: userInfos.name,
            email: userInfos.email,
            phone: userInfos.phone,
            user: user._id
        };

        if (userInfos.name && userInfos.email && userInfos.phone) {
            setShowWarning(false);
            try{
                await axios.post(`/booking/${user._id}`, booking, { withCredentials: true });
                try {
                    const rooms = Object.values(selectedRooms).flat();
                    await Promise.all(rooms.map(roomId => {
                        const response = axios.put(`/rooms/availability/${roomId}`, {dates: allDates});
                        return response.data;
                    }));
                    setShowBookingAlert(true);
                    
                } catch(err) {
                authDispatch({type:"LOG_OUT"})
                }
            }catch(err) {
                if (err.response.data.status === 500) {
                alert("Something went wrong, redirecting...");
                navigate("/");
                } else {
                    authDispatch({type:"LOG_OUT"})      
                }
            }
        }
        else {
            setShowWarning(true);
    }
    };

    return (
        <div>
            <Navbar />
            <Header type="general" />
            <div className="confirmContainer">
                <div className="confirmHotelDiv">
                    {loading? "Loading please wait..." :
                    <>
                    <img className="confirmHotelImg" src={data.photos? data.photos[0] : ""} alt="Hotel"/>
                    <div className="confirmHotelDetails">
                        <span className="confirmHotelName"><b>{data.name}</b></span> 
                        <div className="confirmDatesDiv">
                            <span className="confirmCheckDate"> <span style={{color: "#0174BE"}}>Check in</span> <br/> {days[dates[0].startDate.getDay()]}, {months[dates[0].startDate.getMonth()]} {dates[0].startDate.getDate()}  </span>
                            <span className="confirmDatesArrow">&#8594;</span>
                            <span className="confirmCheckDate"> <span style={{color: "#0174BE"}}>Check out</span> <br/> {days[dates[0].endDate.getDay()]}, {months[dates[0].endDate.getMonth()]} {dates[0].endDate.getDate()} </span>
                        </div>
                    </div>
                    </>
                    }
                </div>
                
                <div className="confirmWrapper">
                <div className="confirmContactDetails">
                    <div className="confirmContactHeader">
                    <h1>Contact details</h1>
                    </div>

                    <div className="confirmFullNameDiv">
                    <label className="confirmContactLabel">Full name</label>
                    <input className="confirmContactInput" name="name" onChange={handleChange} onBlur={()=> {setCheckedInput(prev => {const newArray=[...prev]; newArray[0]=true; return newArray})}} checkinput={checkedInput[0].toString()} type="text" required/>
                    </div>

                    <div className="confirmEmailDiv">
                    <label className="confirmContactLabel">Email</label>
                    <input className="confirmContactInput" name="email" onChange={handleChange} onBlur={()=> {setCheckedInput(prev => {const newArray=[...prev]; newArray[1]=true; return newArray})}} checkinput={checkedInput[1].toString()} type="email" required/>
                    </div>
                    
                    <div className="confirmPhoneCountryDiv">
                        <div className="confirmPhoneDiv">
                        <label className="confirmContactLabel">Phone Number</label>
                        <input className="confirmContactInput" name="phone" onChange={handleChange} onBlur={()=> {setCheckedInput(prev => {const newArray=[...prev]; newArray[2]=true; return newArray})}} checkinput={checkedInput[2].toString()} type="number" required/>
                        </div>

                        <div className="confirmCountryDiv">
                        <label className="confirmContactLabel">Country/region of residence</label>
                        <input className="confirmContactInput confirmCountry" type="text" placeholder="optional"/>
                        </div>
                    </div>
    
                    <div className="confirmGuestDiv">
                    <input className="confirmGuestCheckbox" type="checkbox"/>
                    <span className="confirmGuest" style={{fontWeight: 500}}>Make this booking for someone else</span>
                    </div>
                </div>

                <div className="confirmPayment">
                    <table>
                    <thead>
                        <tr>
                            <th className="confirmRowHeader"></th>
                            <th className="confirmRowHeader">Room Types</th>
                            <th className="confirmSpacer confirmRowHeader"></th>
                            <th className="confirmRowHeader">Room Numbers</th>
                            <th className="confirmSpacer confirmRowHeader"></th>
                            <th className="confirmRowHeader">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        { roomsDetailLoading? <tr><td>Loading please wait...</td></tr> :
                        <>
                        { roomsDetail?.map((roomDetail, index) => {
                            return (
                            <tr key={index}>
                                <td>{index+1}.</td>
                                <td className="confirmRowData"><b>{roomDetail.roomType}</b> <br/> ({noOfDays} {(noOfDays > 1)? "nights" : "night" })</td>
                                <td className="confirmSpacer"></td>
                                <td className="confirmRoomNumbers confirmRowData"><b>{roomDetail.roomNumbers.join(", ")}</b> <br/> ({roomDetail.roomNumbers.length} {roomDetail.roomNumbers.length > 1? "rooms" : "room"})</td>
                                <td className="confirmSpacer"></td>
                                <td className="confirmRoomPrice confirmRowData"><b>RM{roomDetail.roomPrice * noOfDays * roomDetail.roomNumbers.length}</b> <br/> (RM{roomDetail.roomPrice} x {roomDetail.roomNumbers.length} {roomDetail.roomNumbers.length > 1? "rooms" : "room"} x {noOfDays} {(noOfDays > 1)? "nights" : "night" })</td>
                            </tr>
                            )
                        })}
                        </>}
                        
                        <tr>
                            <td></td>
                            <td className="confirmPaddingTop" colSpan="2">Final Price</td>
                            <td className="confirmSpacer confirmPaddingTop"></td>
                            <td className="confirmFinalPrice confirmPaddingTop" colSpan="3"><b>RM{totalPricePerNight}</b></td>
                        </tr>
                    </tbody>
                    </table>
                    <button className="confirmButton" onClick={handleClick}>Pay Now</button> 
                    {showWarning && <span style={{color: "red"}}>Please fill in the required fields.</span>}
                    
                </div>

                </div>
        
            </div>
            <div className="confirmFooterDiv">
            <MailList />
            <Footer />
            </div>
            {showBookingAlert && <BookingAlert status="bookingConfirm"/>}
        </div>
    )
}

export default Confirm;