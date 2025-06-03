import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-gradient-to-br from-raisin-black-100 to-rich-black-300 text-anti-flash-white-900 shadow-[0px_4px_25px_0px_#080815] transition-all">
            <Link to="/home">
                <img className="h-9 invert" src="logo.png" />
            </Link>

            <ul className="md:flex hidden items-center gap-10">
                <li>
                    <Link
                        className="hover:text-gray-500/80 transition"
                        to="/home"
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <a className="hover:text-gray-500/80 transition" href="#">
                        Services
                    </a>
                </li>
                <li>
                    <a className="hover:text-gray-500/80 transition" href="#">
                        Portfolio
                    </a>
                </li>
                <li>
                    <Link
                        className="hover:text-gray-500/80 transition"
                        to="/pricing"
                    >
                        Pricing
                    </Link>
                </li>
            </ul>

            <Link
                to="/auth"
                className="font-semibold bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 text-sm hover:bg-gray-50 active:scale-95 transition-all w-40 h-11 rounded-full hidden md:flex items-center justify-center"
            >
                Get started
            </Link>

            <button
                aria-label="menu-btn"
                type="button"
                className="menu-btn inline-block md:hidden active:scale-90 transition"
                onClick={toggleMobileMenu}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="#FFF"
                >
                    <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
                </svg>
            </button>

            <div
                className={`mobile-menu absolute top-[70px] left-0 w-full bg-rich-black-300 p-6 ${
                    isMobileMenuOpen ? "block" : "hidden"
                } md:hidden`}
            >
                <ul className="flex flex-col space-y-4 text-lg">
                    <li>
                        <Link to="/home" className="text-sm">
                            Home
                        </Link>
                    </li>
                    <li>
                        <a href="#" className="text-sm">
                            Services
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-sm">
                            Portfolio
                        </a>
                    </li>
                    <li>
                        <Link to="/pricing" className="text-sm">
                            Pricing
                        </Link>
                    </li>
                </ul>

                <Link
                    to="/auth"
                    className="font-semibold bg-gradient-to-r from-dark-orange-500 to-goldenrod-500 text-rich-black-400 mt-6 text-sm hover:bg-gray-50 active:scale-95 transition-all w-40 h-11 rounded-full flex items-center justify-center"
                >
                    Get started
                </Link>
            </div>
        </nav>
    );
}
