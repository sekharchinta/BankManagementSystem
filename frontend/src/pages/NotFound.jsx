import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">

            <h1 className="text-6xl font-bold">404</h1>

            <p className="my-4 text-gray-600">
                Page Not Found
            </p>

            <Link
                to="/"
                className="bg-blue-600 text-white px-5 py-2 rounded"
            >
                Go Home
            </Link>

        </div>
    );
}