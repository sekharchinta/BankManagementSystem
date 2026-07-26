import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUniversity } from "react-icons/fa";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const response = await loginUser(data);

            login(response.access, response.refresh);

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (error) {
            toast.error("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <div className="flex flex-col items-center mb-6">
                    <FaUniversity className="text-5xl text-blue-600 mb-3" />
                    <h1 className="text-2xl font-bold">
                        Bank Management System
                    </h1>
                    <p className="text-gray-500">
                        Sign in to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            {...register("username", {
                                required: "Username is required",
                            })}
                            className="w-full rounded-lg border p-3"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                            className="w-full rounded-lg border p-3 pr-12"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-4 top-4"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
                    >
                        {loading ? "Signing In..." : "Login"}
                    </button>

                </form>

            </div>
        </div>
    );
}