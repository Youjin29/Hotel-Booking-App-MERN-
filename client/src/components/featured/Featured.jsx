import "./featured.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";  
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch.js";
 
const Featured = () => {
  const state = useContext(SearchContext);
  const {data, loading, error} = useFetch("hotels/countByCity?cities=kuala_lumpur,perhentian_island,kota_kinabalu");
  const dates = state.dates;
  const options = state.options
  const navigate = useNavigate();
  return (
    <div className="featured">
      {loading? "Loading please wait..." :
      <>
      <div className="featuredItem" onClick={() => {navigate("/hotels",{state:{destination:"Kuala Lumpur",dates:dates,options:options}})}}>
        <img
          src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3VhbGElMjBsdW1wdXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Kuala Lumpur</h1>
          <h2>{data[0]} properties</h2>
        </div>
      </div>
      
      <div className="featuredItem" onClick={() => {navigate("/hotels",{state:{destination:"Perhentian Island",dates:dates,options:options}})}}>
        <img
          src="https://www.vacationstravel.com/wp-content/uploads/2022/11/Untitled-design-2-1.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Perhentian Island</h1>
          <h2>{data[1]} properties</h2>
        </div>
      </div>
      <div className="featuredItem">
        <img
          src="https://images.unsplash.com/photo-1663168074436-c6fc315bfd61?auto=format&fit=crop&q=80&w=2970&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles" onClick={() => {navigate("/hotels",{state:{destination:"Kota Kinabalu",dates:dates,options:options}})}}>
          <h1>Kota Kinabalu </h1>
          <h2>{data[2]} properties</h2>
        </div>
      </div>
      </>}
    </div>
  );
};

export default Featured;
