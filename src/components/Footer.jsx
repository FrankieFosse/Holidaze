import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-blackBackground px-16 py-10">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        {/* Info Links */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-md font-semibold mb-2">Links</h3>
          <ul className="text-center sm:text-left space-y-1 text-grayPrimary cursor-pointer">
            <li className="hover:underline">About</li>
            <li className="hover:underline">Contact</li>
            <li className="hover:underline">Terms & Conditions</li>
            <li className="hover:underline">Support</li>
            </ul>
        </div>

        {/* Socials */}
        <div className="flex flex-col justify-between">
          <h3 className="text-md font-semibold mb-2">Socials</h3>
          <div className="flex gap-4 text-2xl text-grayPrimary justify-center items-center sm:mb-10">
            <FaInstagram />
            <FaFacebookF />
            <FaXTwitter />
          </div>
        </div>

        {/* Logo & Copyright */}
        <div className="flex flex-col sm:items-end sm:text-end justify-start items-center h-full">
          <img src="/images/Holidaze Logo v1.png" alt="Logo" className="w-24 mb-2" />
          <p className="text-xs text-grayPrimary/75">&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
