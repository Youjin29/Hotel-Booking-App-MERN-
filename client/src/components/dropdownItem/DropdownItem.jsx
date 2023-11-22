import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import "./dropdownItem.css";

const DropdownItem = (props) => {
    const { name, icon, handleClick } = props

    return (
        <li className="dropdownItemLi" style={{color:"black", listStyleType:"none"}} onClick={handleClick}>  
            {icon && <FontAwesomeIcon icon={icon}/>}
            <span className='dropdownItemName'>{name}</span>  
        </li>
    )
}

export default DropdownItem;