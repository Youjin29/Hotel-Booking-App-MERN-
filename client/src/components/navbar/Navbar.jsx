import "./navbar.css"
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSuitcase, faSquarePollVertical, faHeart, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import DropdownItem from "../dropdownItem/DropdownItem";

const Navbar = (props) => {
  const { user, dispatch } = useContext(AuthContext)
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  let menuRef = useRef();

  const handleLogout = () => {
    dispatch({type: "LOG_OUT"})
    navigate("/");
  };

  const handleBookings = () => {
    navigate("/account");
    setOpenMenu(false);
  }

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);

    return(() => document.removeEventListener("mousedown", handler));
  })

  return (
    <div className={`navbar ${props.homepage === "true" && "navbarHomePage"}`}>
      <div className="navContainer">
        <Link to="/" style={{textDecoration:"none", color:"inherit"}}>
        <span className="logo">geniebook</span>
        </Link>
        { user ? 
        <>
        <div className="navDropdownContainer" ref={menuRef}>
          <div className="navProfileHeader" onClick={() => {setOpenMenu(!openMenu)}}>
            <div className="navUserIcon">
              <FontAwesomeIcon className="navUserIconIcon" icon={faUser} size="xl" style={{color: "grey"}}/>
            </div>

            <div className="navUsername"> 
              <span>{user.username}</span>
              <span className="navUserTitle">Level 1</span>
            </div>
          </div>
          {/* {openMenu &&
          <> */}
          <div className={`navDropdownMenu ${openMenu? "active":"inactive"}`}>
            <ul>
              <DropdownItem className="navLI" icon={faSuitcase} name="Bookings" handleClick={handleBookings}/>
              <DropdownItem className="navLI" icon={faUser} name="Manage account"/>
              <DropdownItem className="navLI" icon={faSquarePollVertical} name="Review"/>
              <DropdownItem className="navLI" icon={faHeart} name="Saved"/>
              <DropdownItem className="navLI" icon={faRightFromBracket} name="Sign out" handleClick={handleLogout}/>
            </ul>
          </div>
          {/* </>
          }     */}
        </div>
       
        </>
        :
        <>
        <div className="navItems">
          <button className="navButton" onClick={() => {navigate("/register")}}>Register</button>
          <button className="navButton" onClick={handleLogin}>Login</button>
        </div>
        </>
        }
      </div>
    </div>
  )
}

export default Navbar