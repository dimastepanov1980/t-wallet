import { APP_IS_DEMO } from '../config';

export const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#ffe01a]">
    <div className="flex-1 flex items-center justify-center w-full">
      <img
        src={APP_IS_DEMO === 'true' ? '/logos/Tb-Logo_white.png' : '/logos/tbank_tr.svg'}
        alt="T Logo"
        className="w-10 h-10"
        style={{ minWidth: 100, minHeight: 100 }}
      />
    </div>
  </div>
);

export default SplashScreen;