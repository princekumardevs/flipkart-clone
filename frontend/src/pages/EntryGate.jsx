import { useNavigate } from 'react-router-dom';
import { getSessionId } from '../lib/session';
import { useAuth } from '../context/AuthContext';

function EntryGate() {
  const navigate = useNavigate();
  const { continueAsGuest: setGuestMode } = useAuth();

  const handleContinueAsGuest = () => {
    setGuestMode();
    getSessionId();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-flipkart-light flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[880px] bg-white rounded-sm shadow-[0_4px_16px_0_rgba(0,0,0,.18)] overflow-hidden">
        <div className="bg-flipkart-blue px-6 sm:px-10 py-8 sm:py-10 text-white">
          <h1 className="text-[26px] sm:text-[34px] font-bold italic tracking-tight">Flipkart</h1>
          <p className="mt-2 text-[14px] sm:text-[16px] text-[#dbe8ff]">
            Start your shopping journey
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-[20px] sm:text-[26px] font-semibold text-flipkart-dark">Choose how you want to continue</h2>
          <p className="mt-2 text-[13px] sm:text-[14px] text-flipkart-grey">
            Login for a personalized experience or continue as guest for quick checkout.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer w-full rounded-sm border border-flipkart-blue bg-white text-flipkart-blue px-5 py-4 text-[15px] sm:text-[16px] font-medium hover:bg-[#f5faff] transition-colors"
            >
              Login
            </button>

            <button
              onClick={handleContinueAsGuest}
              className="cursor-pointer w-full rounded-sm bg-flipkart-orange text-white px-5 py-4 text-[15px] sm:text-[16px] font-medium hover:bg-[#f65a0b] transition-colors"
            >
              Continue with Guest Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryGate;
