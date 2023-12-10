import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const {data, loading, error} = useFetch("hotels/getAllHotels?featured=true&limit=4");

  return (
    <div className="fp">
      { loading? "Loading please wait..." : <>
      {data.map( (item) =>
      <div className="fpItem" key={item._id} onClick={()=>{navigate(`/hotels/${item._id}`)}}>
        <img
          src={item.photos[0]}
          alt=""
          className="fpImg"
        />
        <div className="fpInfoBox">
          <span className="fpName">{item.name}</span>
          <span className="fpCity">{item.city}</span>
          <span className="fpPrice">Starting from RM{item.cheapestPrice}</span>
          {item.rating && <div className="fpRating">
            <button>{item.rating}</button>
            <span>Excellent</span>
          </div>}
        </div>
      </div>
      )}
      </>
      }
    </div>
  );
};

export default FeaturedProperties;
