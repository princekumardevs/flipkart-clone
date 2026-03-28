import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-flipkart-blue h-[56px] fixed w-full top-0 z-50 flex items-center shadow-md">
      <div className="max-w-[1248px] w-full mx-auto px-4 flex items-center gap-4 lg:gap-8">
        
        {/* Logo */}
        <Link to="/" className="shrink-0 flex flex-col items-center">
          <span className="text-white text-[20px] font-bold italic tracking-tight leading-none h-[22px]">Flipkart</span>
          <span className="flex items-center hover:underline italic gap-1 leading-none mt-px">
            <span className="text-[11px] text-white italic">Explore</span>
            <span className="text-[11px] text-[#ffe500] font-medium leading-none">Plus</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="#ffe500" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L9.464 6.136L16 6.82L10.96 11.23L12.56 17L8 14.1L3.44 17L5.04 11.23L0 6.82L6.536 6.136L8 0Z" />
            </svg>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[550px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full h-[36px] pl-4 pr-10 rounded-sm text-[14px] bg-white text-black outline-none shadow-[0_2px_4px_0_rgba(0,0,0,.23)]"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-flipkart-blue cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 17 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <g fill="#2874F1"><path d="M11.618 9.897l4.224 4.212c.092.09.1.23.02.312l-1.464 1.46c-.08.08-.222.072-.314-.02L9.868 11.66M6.486 10.9c-2.42 0-4.38-1.955-4.38-4.367 0-2.413 1.96-4.37 4.38-4.37s4.38 1.957 4.38 4.37c0 2.412-1.96 4.368-4.38 4.368m0-10.834C2.904.066 0 2.96 0 6.533 0 10.105 2.904 13 6.486 13s6.487-2.895 6.487-6.467c0-3.572-2.905-6.467-6.487-6.467 "/></g>
            </svg>
          </button>
        </form>

        {/* Action Links */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          {user ? (
            <div className="flex items-center gap-2 relative group cursor-pointer h-[56px]">
              <div className="text-white text-[15px] font-medium hover:opacity-90 flex items-center h-full">
                {user.firstName} {user.lastName} ▾
              </div>
              <div className="absolute top-full right-[-70px] bg-white shadow-[0_4px_16px_0_rgba(0,0,0,.2)] rounded-sm w-[240px] hidden group-hover:block z-50 text-black before:content-[''] before:absolute before:-top-2 before:right-[50%] before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-b-8 before:border-b-white">
                <div className="flex items-center gap-3 p-4 border-b border-[#f0f0f0]">
                  <div className="w-8 h-8 rounded-full bg-flipkart-blue text-white flex items-center justify-center text-[14px] font-bold">
                    {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-[14px] overflow-hidden">
                    <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-[12px] text-flipkart-grey truncate" title={user.email}>{user.email}</p>
                  </div>
                </div>
                <div className="py-2">
                  <div onClick={() => navigate('/orders')} className="px-4 py-3 hover:bg-[#f5faff] cursor-pointer text-[14px] flex items-center gap-4 text-flipkart-grey hover:text-flipkart-blue hover:font-medium">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.237.248.402.49.402h9.522c.26 0 .484-.183.528-.44l1.83-7.5c.032-.132.002-.27-.08-.372-.08-.104-.21-.157-.34-.148zM5.336 12.672c-1.1 0-1.996.896-1.996 1.996 0 1.1.896 1.996 1.996 1.996 1.1 0 1.996-.896 1.996-1.996 0-1.1-.896-1.996-1.996-1.996zm7.252 0c-1.1 0-1.996.896-1.996 1.996 0 1.1.896 1.996 1.996 1.996 1.1 0 1.996-.896 1.996-1.996 0-1.1-.896-1.996-1.996-1.996z" /></svg>
                    Orders
                  </div>
                  <div onClick={() => navigate('/wishlist')} className="px-4 py-3 hover:bg-[#f5faff] cursor-pointer text-[14px] flex items-center gap-4 text-flipkart-grey hover:text-flipkart-blue hover:font-medium">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 15.025l-1.16-1.056C2.7 10.22 0 7.766 0 4.7 0 2.296 1.91 0 4.4 0c1.4 0 2.74.654 3.6 1.708C8.86.654 10.2 0 11.6 0 14.09 0 16 2.296 16 4.7c0 3.066-2.7 5.52-6.84 9.27L8 15.025z" /></svg>
                    Wishlist
                  </div>
                  <div onClick={logout} className="px-4 py-3 hover:bg-[#f5faff] cursor-pointer text-[14px] flex items-center gap-4 text-flipkart-grey hover:text-flipkart-blueblue hover:font-medium">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM7 4h2v5H7V4zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
                    Logout
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-flipkart-blue px-10 py-[6px] rounded-sm font-medium text-[15px] cursor-pointer hover:shadow-sm">
              Login
            </Link>
          )}
          <Link to="#" className="text-white text-[15px] font-medium hover:opacity-90">
            Become a Seller
          </Link>
          <Link to="/" className="text-white text-[15px] font-medium flex items-center gap-1 hover:opacity-90">
            More
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L12 12.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="flex items-center text-white text-[15px] font-medium hover:opacity-90 tracking-wide">
            <div className="relative mr-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.237.248.402.49.402h9.522c.26 0 .484-.183.528-.44l1.83-7.5c.032-.132.002-.27-.08-.372-.08-.104-.21-.157-.34-.148zM5.336 12.672c-1.1 0-1.996.896-1.996 1.996 0 1.1.896 1.996 1.996 1.996 1.1 0 1.996-.896 1.996-1.996 0-1.1-.896-1.996-1.996-1.996zm7.252 0c-1.1 0-1.996.896-1.996 1.996 0 1.1.896 1.996 1.996 1.996 1.1 0 1.996-.896 1.996-1.996 0-1.1-.896-1.996-1.996-1.996z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-3 bg-[#ff6161] text-white text-[11px] font-bold px-[5px] py-px rounded-full border border-flipkart-blue">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
