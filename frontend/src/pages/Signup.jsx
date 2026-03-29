import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(firstName, lastName, email, password);
    if (success) {
      navigate('/home');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-56px)] bg-flipkart-light py-4 sm:py-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-sm overflow-hidden w-full max-w-[850px] min-h-[528px]">
        
        {/* Left Side Info */}
        <div className="bg-flipkart-blue w-full md:w-[40%] p-6 sm:p-8 md:p-10 flex flex-col justify-between text-white relative bg-[url('https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png')] bg-no-repeat bg-position-[center_bottom_30px] md:bg-position-[center_bottom_100px] min-h-[200px] md:min-h-0">
          <div>
            <h2 className="text-[22px] sm:text-[28px] font-medium mb-3 sm:mb-4">Looks like you're new here!</h2>
            <p className="text-[15px] sm:text-[18px] text-[#dbdbdb] leading-relaxed max-w-[32ch]">
              Sign up with your email to get started
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-[60%] p-5 sm:p-8 md:p-10 md:px-12 pb-6 relative flex flex-col">
          <form className="flex-1 mt-1 sm:mt-2" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-b border-[#e0e0e0] py-2 text-[15px] focus:outline-none focus:border-flipkart-blue transition-colors peer"
                />
                <label className={`absolute left-0 text-flipkart-grey text-[15px] pointer-events-none transition-all duration-200 ${firstName ? '-top-3.5 text-[12px]' : 'top-2 peer-focus:-top-3.5 peer-focus:text-[12px]'}`}>
                  First Name
                </label>
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-b border-[#e0e0e0] py-2 text-[15px] focus:outline-none focus:border-flipkart-blue transition-colors peer"
                />
                <label className={`absolute left-0 text-flipkart-grey text-[15px] pointer-events-none transition-all duration-200 ${lastName ? '-top-3.5 text-[12px]' : 'top-2 peer-focus:-top-3.5 peer-focus:text-[12px]'}`}>
                  Last Name
                </label>
              </div>
            </div>

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
                Create Password
              </label>
            </div>

            <p className="text-[12px] text-flipkart-grey mb-4">
              By continuing, you agree to Flipkart's{' '}
              <a href="#" className="text-flipkart-blue">Terms of Use</a> and{' '}
              <a href="#" className="text-flipkart-blue">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              className="w-full bg-flipkart-orange text-white py-3 rounded-sm font-medium text-[15px] shadow-sm hover:bg-[#f3580b] transition-colors"
            >
              Continue
            </button>
          </form>

          <div className="text-center mt-auto pt-6 sm:pt-8">
            <Link to="/login" className="w-full py-3 inline-block rounded-sm font-medium text-flipkart-blue shadow-[0_2px_4px_0_rgba(0,0,0,.2)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,.3)] text-[15px] bg-white transition-all">
              Existing User? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
