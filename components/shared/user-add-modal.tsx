import Modal from "./modal";
import { useState, Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { addUser } from "@/app/api/db-api";
import LoadingDots from "./icons/loading-dots";

interface User {
    username: string;
    email: string;
    password: string;
    db_name: string;
    role: string;
    pin?: string;
}

const AddUser = ({
    showAddUser,
    setShowAddUser,
    addSuccess
}: {
    showAddUser: boolean;
    setShowAddUser: Dispatch<SetStateAction<boolean>>;
    addSuccess: (bool: boolean) => void;
}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dbName, setDbName] = useState("");
    const [role, setRole] = useState("student"); // Default value for role
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pin, setPin] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(""); // Reset error

        const userData: User = {
            username,
            email,
            password,
            db_name: dbName,
            role,
            pin
        };

        try {
            const result = await addUser(userData);
            if (result.userAdded) {
                setShowAddUser(false); // Close modal or redirect
                addSuccess(true)
            }
            // On success:
        } catch (err) {
            setError("Failed to Add user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal showModal={showAddUser} setShowModal={setShowAddUser}>
            <div className="overflow-hidden w-full shadow-xl md:max-w-lg md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col justify-center items-center px-4 py-6 pt-8 space-y-3 text-center bg-white border-b border-gray-200 md:px-16">
                    <h3 className="text-2xl font-bold font-display">Add User</h3>
                    <p className="text-sm text-gray-500">
                        It is used to add a user to the database.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col px-4 py-8 space-y-4 bg-gray-50 dark:bg-gray-500 md:px-8">
                    <div className="flex flex-row gap-3">
                        <div className="w-full">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Your username"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@flowbite.com"
                                required
                            />
                        </div>
                        <div className="w-2/3">
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            >
                                <option value="student">Student</option>
                                <option value="manager">Manager</option>
                                <option disabled value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 w-full">
                        <div className="w-full">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="dbName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Database Name</label>
                            <input
                                type="text"
                                id="dbName"
                                value={dbName}
                                onChange={(e) => setDbName(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>
                        {role === "student" ? (
                            <></>
                        ) : (
                            <div className="w-full">
                                <label htmlFor="pin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PIN</label>
                                <input
                                    type="text"
                                    id="pin"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`text-white ${error ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800`}
                    >
                        {loading ? <LoadingDots /> : "Submit"}
                    </button>
                </form>
            </div>
        </Modal>
    );
};
export default AddUser;