import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState, useContext, useRef, useEffect } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchDispatchContext } from "../../context/SearchContext";
 
const Header = ({ type, homepage }) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const [destination, setDestination] = useState("");
  const [openDestinations, setOpenDestinations] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: startDate,
      endDate: new Date(startDate.getTime() + (24*60*60*1000)),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [active, setActive] = useState("stays");
  const destinationRef = useRef(null);
  const dateRef = useRef(null);
  const optionsRef = useRef(null);

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1, }
    });
  };

  useEffect(() => {
    let handler = (e) => {
      if (homepage === "true") {
        if (!destinationRef.current.contains(e.target) && !dateRef.current.contains(e.target) && !optionsRef.current.contains(e.target)) {
          setOpenDestinations(false);
          setOpenDate(false);
          setOpenOptions(false);
        }
      }
    }
    document.addEventListener("mousedown", handler);

    return(() => document.removeEventListener("mousedown", handler));
  },[homepage])

  const dispatch = useContext(SearchDispatchContext);

  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: {
        city: destination,
        dates: dates,
        options: options,
      }
    })
    navigate("/hotels", { state: { destination, dates, options } });
  };

  return (
    <div className={`header ${homepage === "true" && "headerHomePage"}` }>
      <div
        className={
          type === "general" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className={
          type === "general" ? "headerList listMode" : "headerList"
        }>
          <div className="headerListSlider" value={active}></div>
          <div className="headerListItem" onClick={() => {setActive("stays")}}>
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
          <div className="headerListItem" onClick={() => {setActive("flights")}}>
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem" onClick={() => {setActive("rentals")}}>
            <FontAwesomeIcon icon={faCar} />
            <span>Car rentals</span>
          </div>
          <div className="headerListItem" onClick={() => {setActive("attractions")}}>
            <FontAwesomeIcon icon={faBed}/>
            <span>Attractions</span>
          </div>
          <div className="headerListItem"  onClick={() => {setActive("transports")}}>
            <FontAwesomeIcon icon={faTaxi}/>
            <span>Airport taxis</span>
          </div>
        </div>
        {type !== "general" && (
          <>
            <h1 className="headerTitle">
              Welcome to Geniebook, a hotel booking simulator.
            </h1>
            <p className="headerDesc">
              This app allows user to create account, sign in and book hotels. You may also review or delete your bookings in your bookings page. The same booking (identical room and date) cannot be booked twice
            </p>
            <div className="headerSearch">
              <div className="headerSearchItem" ref={destinationRef}>
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <div>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  onChange={(e) => {setDestination(e.target.value);setOpenDestinations(false)}}
                  onClick={() => {setOpenDestinations(prev => !prev);setOpenDate(false);setOpenOptions(false)}}
                  value={destination}
                />
                { (openDestinations) ?
                <>
                <div className="dropdown-content">
                  <div className="dropdownTitle">
                  <span>Explore:</span>
                  </div>
                  <div className="cityChoice" onClick={ () => {setDestination("Kuala Lumpur");setOpenDestinations(false)} }>
                    <p><b>Kuala Lumpur</b></p>
                    <p style={{fontSize: "13px"}}>Malaysia</p>
                  </div>
                  <div className="cityChoice" onClick={ () => {setDestination("Perhentian Island");setOpenDestinations(false)} }>
                    <p><b>Perhentian Island</b></p>
                    <p style={{fontSize: "13px"}}>Terengganu, Malaysia</p>
                  </div>
                  <div className="cityChoice" onClick={ () => {setDestination("Kota Kinabalu");setOpenDestinations(false)} }>
                    <p><b>Kota Kinabalu</b></p>
                    <p style={{fontSize: "13px"}}>Sabah, Malaysia</p>
                  </div>
                </div>
                </>
                : null}
                </div>
              </div>
              <div className="headerSearchItem" ref={dateRef}>
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => {setOpenDate(!openDate);setOpenOptions(false);setOpenDestinations(false)}}
                  className="headerSearchText"
                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
              <div className="headerSearchItem"  ref={optionsRef}>
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => {setOpenOptions(!openOptions);setOpenDate(false);setOpenDestinations(false)}}
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Room</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.room <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchButton">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
