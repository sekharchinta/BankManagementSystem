import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    return (
        <header className="flex items-center justify-between bg-white p-4 shadow">

            <h1 className="text-xl font-bold">
                Dashboard
            </h1>

            <div className="flex items-center gap-5">

                <FaBell size={20} />

                <div className="flex items-center gap-2">

                    <FaUserCircle size={28} />

                    <span>Admin</span>

                </div>

            </div>

        </header>
    );
}