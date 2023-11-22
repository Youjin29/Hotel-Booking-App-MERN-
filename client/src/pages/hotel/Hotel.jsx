import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import Reserve from "../../components/reserve/Reserve";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import {SearchContext} from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

const Hotel = () => {
  const location = useLocation();
  const hotelId = location.pathname.split("/")[2];

  const {data, loading} = useFetch(`/hotels/find/${hotelId}`);

  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const photos = data.photos?.length > 0?  data.photos : [];

  const navigate = useNavigate();
  const searchInfo = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const findDays = (date1, date2) => {
    const millisecondsPerDay = 24 * 3600 * 1000;
    const difference = date2.getTime() - date1.getTime();
    return difference / millisecondsPerDay;
  }

  const noOfDays = findDays(searchInfo.dates[0].startDate, searchInfo.dates[0].endDate);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };

  const handleReserve = () => {
    if (user) {setOpenModal(true);} 
    else {
      navigate("/login");
    }
  }

  return (
    <div>
      <Navbar />
      <Header type="general" />
      {loading? "Loading please wait..." :
      <>
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={photos[slideNumber]} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button onClick={handleReserve} className="bookNow">Reserve or Book Now!</button>
          <h1 className="hotelTitle">{data.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {data.distance} from center of city of <span>{data.city}</span>
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over RM{data.cheapestPrice} at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of City</h1>
              <p className="hotelDesc">
                {data.description}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a {noOfDays}-night stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span>
              <h2>
                <b>RM{data.cheapestPrice * noOfDays}</b> ({noOfDays} nights)
              </h2>
              <button onClick={handleReserve}>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
        <MailList />
        <Footer />
      </div>
      {openModal && <Reserve setOpen={setOpenModal} hotelId={hotelId}/>}
      </>} 
    </div>
  );
};

export default Hotel;
