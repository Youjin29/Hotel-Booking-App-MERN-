import "./propertyList.css";
import useFetch from "../../hooks/useFetch.js";

const PropertyList = () => {
  const {data, loading, error} = useFetch("hotels/countByType");

  const images = [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzb3J0fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmlsbGF8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1596313127813-b9f7c7a3b466?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhYmlufGVufDB8fDB8fHww"
  ];

  return (
    <div className="pList">
      { loading? "Loading please wait..." :
      <>
      { data && images.map( (image, index) => 
      <div className="pListItem" key={index}>
        <img
          src={image}
          alt=""
          className="pListImg"
        />
        <div className="pListTitles">
          <h1>{data[index]?.type}</h1>
          <h2>{data[index]?.count} {data[index]?.type}</h2>
        </div>
      </div>
)}   
      </>
      }
    </div>
  );
};

export default PropertyList;
