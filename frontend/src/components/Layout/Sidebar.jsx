import {
    FaHome,
    FaUsers,
    FaUniversity,
    FaExchangeAlt,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const menus = [
        {
            name: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard",
        },
        {
            name: "Customers",
            icon: <FaUsers />,
            path: "/customers",
        },
        {
            name: "Accounts",
            icon: <FaUniversity />,
            path: "/accounts",
        },
        {
            name: "Transactions",
            icon: <FaExchangeAlt />,
            path: "/transactions",
        },
        {
            name: "Settings",
            icon: <FaCog />,
            path: "/settings",
        },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen">

            <div className="p-6 text-center border-b">

                <h2 className="text-xl font-bold">
                    BankMS
                </h2>

            </div>

            <nav className="mt-6">

                {menus.map((menu) => (

                    <NavLink
                        key={menu.path}
                        to={menu.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-4 hover:bg-slate-700 ${
                                isActive ? "bg-blue-600" : ""
                            }`
                        }
                    >
                        {menu.icon}

                        {menu.name}

                    </NavLink>

                ))}

                <button className="flex w-full items-center gap-3 px-6 py-4 hover:bg-red-600">
                    <FaSignOutAlt />
                    Logout
                </button>

            </nav>

        </aside>
    );
}