import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import { useState, useContext } from "react";
import useFetch from "../../hooks/useFetch.js";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

const Reserve = ({setOpen, hotelId}) => {

    const [selectedRooms, setSelectedRooms] = useState({});
    const [openWarning, setOpenWarning] = useState(false);
    const { data, loading} = useFetch(`/hotels/rooms/${hotelId}`);
    const { dates } = useContext(SearchContext);
    const navigate = useNavigate();

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

    const isAvailable = (roomNumber) => {
        return !(roomNumber.unavailableDates.some(date => allDates.includes(new Date(date).getTime())));
    }

    // const handleSelect = (e) => {
    //     if (e.target.checked) {
    //     setSelectedRooms(prev => ([...prev, e.target.value]));
    //     } else {
    //         setSelectedRooms( prev => 
    //             prev.filter( item => item !== e.target.value)
    //         );
    //     }
    // };

    const handleSelect = (e) => {
        if (e.target.checked) {
            setSelectedRooms(prev => {
                if (e.target.name in selectedRooms) {
                    const newState = {};
                    for (const key of Object.keys(selectedRooms)) {
                        if (key !== e.target.name) {
                            newState[key] = selectedRooms[key];
                        } else {
                            newState[e.target.name] = [...selectedRooms[e.target.name], e.target.value];
                        }
                    }
                    return newState;
                } else {
                    return {...prev, [e.target.name]:[e.target.value]}
                } 
            })
        } else {
          setSelectedRooms(prev => {
            const newState = {};
            for (const key of Object.keys(selectedRooms)) {
                if (key !== e.target.name ) {
                    newState[key] = selectedRooms[key];
                } else {
                    const newArray = [];
                    for (const each of selectedRooms[key]) {
                        if (each === e.target.value) {
                            continue
                        } else {
                            newArray.push(each);
                        }
                    }
                    newState[key] = newArray;
                }
             }
            return newState;
          })
        }
    }

    // const handleClick = async () => {
    //     try{
    //         await Promise.all(selectedRooms.map(roomId => {
    //            const response = axios.put(`/rooms/availability/${roomId}`, {dates: allDates});
    //            return response.data;
    //         }))
    //     }catch(err) {

    //     }
    // }

    const handleClick = () => {
        if (Object.values(selectedRooms).flat().length === 0) {
            setOpenWarning(true);
        } else {
            navigate(`/confirm/${hotelId}`, {state: {selectedRooms: selectedRooms}});
        }
    }

    return (
        <div className="reserve">
            <div className="rContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)}/>
                <span id="selectTitle"><b>Select your rooms:</b></span>
                {loading? <div>Loading please wait...</div> :data.sort((a,b)=> a.price-b.price).map((room, index) => (
                    <div className="rItem" key={index}>
                        <div className="rItemInfo">
                            <div className="rTitle">{room.title}</div>
                            <div className="rDesc">{room.desc}</div>
                            <div className="rMaxPeople">Max people: <b>{room.maxPeople}</b></div>
                            <div className="rPrice">RM{room.price}</div> 
                        </div>
                        <div className="rRooms">
                        {room.roomNumbers.map(roomNumber => (
                        <div className="room" key={roomNumber._id}>
                            <label>{roomNumber.number}</label>
                            <input type="checkbox" name={room._id} value={roomNumber._id} onChange={handleSelect} disabled={!isAvailable(roomNumber)}></input>
                        </div>      
                        ))}
                        </div>
                    </div>
                ))}
                <button className="rButton" onClick={handleClick}>Reserve Now!</button>
                {openWarning && <span className="reserveWarning">Please select at least 1 room</span>}
            </div>
        </div>
    )
}

export default Reserve;