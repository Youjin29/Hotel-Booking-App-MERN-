import "./searchItem.css";
import { Link, useLocation } from "react-router-dom";

const SearchItem = ({item}) => {

  return (
    <div className="searchItem">
      <img
        src={item.photos[0]}
        alt=""
        className="siImg"
      />
      <div className="siDesc">
      <Link to={`/hotels/${item._id}`} style={{textDecoration: "none"}}>
        <h1 className="siTitle">{item.name}</h1>
      </Link>
        <span className="siDistance">{item.distance} from the city of <span>{item.city}</span></span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
        </span>
        <span className="siFeatures">
          {item.description}
        </span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {item.rating &&
        <div className="siRating">
          <span>Excellent</span>
          <button>{item.rating}</button>
        </div>
}

        <div className="siDetailTexts">
          <span className="siPrice">RM{item.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/hotels/${item._id}`}>
          <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
