import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
  

  return (
    <header>
      <nav className="nav glass">
        {/* بخش راست */}
        <div className="right-nav">
          <h1>کامپیوتر حامد</h1>
          <Link to="/" aria-label="صفحه اصلی">
            <i className="fa-solid fa-house-chimney header-item"></i>
          </Link>
          <Link to="/cart" aria-label="سبد خرید">
            <i className="fa-solid fa-cart-shopping header-item"></i>
          </Link>
          <Link to="/search" aria-label="جستجو">
            <i className="fa-solid fa-magnifying-glass header-item"></i>
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
