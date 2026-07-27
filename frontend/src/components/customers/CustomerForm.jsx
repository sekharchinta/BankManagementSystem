import { useState } from "react";

export default function CustomerForm({ onSubmit }) {

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        phnno: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);

        setFormData({
            fullname: "",
            username: "",
            email: "",
            phnno: "",
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6 mb-6"
        >

            <h2 className="text-xl font-bold mb-5">
                Add Customer
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <input
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="border rounded p-3"
                    required
                />

                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border rounded p-3"
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded p-3"
                    required
                />

                <input
                    name="phnno"
                    placeholder="Phone Number"
                    value={formData.phnno}
                    onChange={handleChange}
                    className="border rounded p-3"
                    required
                />

            </div>

            <button
                className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
            >
                Save Customer
            </button>

        </form>
    );
}