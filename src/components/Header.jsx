import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
  

  return (
    <header>
      <nav className="nav glass">
        {/* بخش راست */}
        <div className="right-nav">
          <h1>فروشگاه کامپیوتر</h1>
          <Link to="/" aria-label="صفحه اصلی">
            {/* <i className="fa-solid fa-house-chimney header-item"></i> */}
            <FontAwesomeIcon className="header-item icon" icon={faHouseChimney}/>
          </Link>
          <Link to="/cart" aria-label="سبد خرید">
            {/* <i className="fa-solid fa-cart-shopping header-item"></i> */}
            <FontAwesomeIcon className="header-item icon" icon={faCartShopping}/>
          </Link>
          <Link to="/search" aria-label="جستجو">
            {/* <i className="fa-solid fa-magnifying-glass header-item"></i> */}
            <FontAwesomeIcon className="header-item icon" icon={faMagnifyingGlass} />
          </Link>
        </div>

        {/* بخش چپ */}
        <div className="left-nav">
          <div className="logout">
            <ProfileMenu/>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
