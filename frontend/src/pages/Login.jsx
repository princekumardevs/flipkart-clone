import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-56px)] bg-flipkart-light py-8">
      <div className="flex bg-white shadow-md rounded-sm overflow-hidden w-[850px] min-h-[528px]">
        
        {/* Left Side Info */}
        <div className="bg-flipkart-blue w-[40%] p-10 flex flex-col justify-between text-white relative bg-[url('https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png')] bg-no-repeat bg-position-[center_bottom_100px]">
          <div>
            <h2 className="text-[28px] font-medium mb-4">Login</h2>
            <p className="text-[18px] text-[#dbdbdb] leading-relaxed">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-[60%] p-10 px-12 pb-6 relative flex flex-col">
          <form className="flex-1 mt-6" onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-[#e0e0e0] py-2 text-[15px] focus:outline-none focus:border-flipkart-blue transition-colors peer"
              />
              <label className={`absolute left-0 text-flipkart-grey text-[15px] pointer-events-none transition-all duration-200 ${email ? '-top-3.5 text-[12px]' : 'top-2 peer-focus:-top-3.5 peer-focus:text-[12px]'}`}>
                Enter Email Address
              </label>
            </div>

            <div className="relative mb-8">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-[#e0e0e0] py-2 text-[15px] focus:outline-none focus:border-flipkart-blue transition-colors peer"
              />
              <label className={`absolute left-0 text-flipkart-grey text-[15px] pointer-events-none transition-all duration-200 ${password ? '-top-3.5 text-[12px]' : 'top-2 peer-focus:-top-3.5 peer-focus:text-[12px]'}`}>
                Enter Password
              </label>
            </div>

            <p className="text-[12px] text-flipkart-grey mb-4">
              By continuing, you agree to Flipkart's{' '}
              <a href="#" className="text-flipkart-blue">Terms of Use</a> and{' '}
              <a href="#" className="text-flipkart-blue">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              className="w-full bg-flipkart-orange text-white py-[10px] rounded-sm font-medium text-[15px] shadow-sm mb-4"
            >
              Login
            </button>
            
            <div className="mb-4 p-4 bg-[#f4f8ff] border border-flipkart-blue/20 rounded-sm flex justify-between items-center">
              <div className="text-[13px] text-flipkart-dark">
                <span className="font-bold block mb-1">Instant Test Account</span>
                test@flipkart.com / testpassword
              </div>
              <button 
                type="button" 
                onClick={() => { setEmail('test@flipkart.com'); setPassword('testpassword'); }}
                className="px-4 py-1.5 bg-white border border-flipkart-blue text-flipkart-blue rounded-sm text-[13px] font-medium hover:bg-flipkart-blue hover:text-white transition-colors"
              >
                Use
              </button>
            </div>
            
            <div className="text-center mt-4">
              <a href="#" className="text-[14px] text-flipkart-blue">Forgot Password?</a>
            </div>
          </form>

          <div className="text-center mt-auto pt-8">
            <Link to="/signup" className="text-flipkart-blue text-[14px] font-medium cursor-pointer">
              New to Flipkart? Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
