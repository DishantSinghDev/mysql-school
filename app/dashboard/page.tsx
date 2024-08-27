"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Ellipsis, Eye, EyeOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, Popover, Table } from "flowbite-react";
import { delUser, getLogs, getUsers, updateUser } from "../api/db-api"; // Assume updateUser is your API to save data
import LoadingDots from "@/components/shared/icons/loading-dots";
import SignIn from "@/components/SignIn";
import Balancer from "react-wrap-balancer";
import AddUser from "@/components/shared/user-add-modal";

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    db_name: string;
    role: string;
}
interface Log {
    id: number;
    db_name: string;
    message: string;
    created_at: string; // Using string for ISO timestamp; you can convert it to Date if necessary
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const { role, email } = session?.user || {};
    const [saving, setSaving] = useState(false)
    const [users, setUsers] = useState<User[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});
    const [showAddUser, setShowAddUser] = useState(false)
    const [visiblePasswords, setVisiblePasswords] = useState<boolean[]>([]);
    const [deleting, setDeleting] = useState(false)

    // Toggle the visibility of the password at the given index
    const togglePasswordVisibility = (index: number) => {
        setVisiblePasswords((prev) =>
            prev.map((isVisible, i) => (i === index ? !isVisible : isVisible))
        );

        // Automatically hide the password after 5 seconds
        setTimeout(() => {
            setVisiblePasswords((prev) =>
                prev.map((isVisible, i) => (i === index ? false : isVisible))
            );
        }, 5000);
    };
    useEffect(() => {
        setVisiblePasswords(new Array(users.length).fill(false))
    }, [users])



    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const users = await getUsers();
            setLoadingUsers(false);
            if (users.userFound) {
                setUsers(users.user);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error occurred while fetching users", error);
            setLoadingUsers(false);
        }
    };
    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const logs = await getLogs();
            setLoadingLogs(false);
            if (logs.logsFound) {
                setLogs(logs.logs);
            } else {
                setLogs([]);
            }
        } catch (error) {
            console.error("Error occurred while fetching logs", error);
            setLoadingLogs(false);
        }
    };
    useEffect(() => {

        if (status === "authenticated" && (role === "manager" || role === "admin")) {
            fetchLogs();
            fetchUsers();
        }
    }, [status, role]);

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id);
        setEditedUser(user);
    };

    const handleSaveClick = async () => {
        setSaving(true)
        if (editingUserId && editedUser) {
            try {
                const updatedUser = await updateUser(editingUserId, editedUser); // updateUser is a placeholder for your update API
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === editingUserId ? { ...user, ...editedUser } : user
                    )
                );
                setEditingUserId(null);
                setSaving(false)
                setEditedUser({});
            } catch (error) {
                setSaving(false)
                console.error("Error saving user data", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSuccess = (bool: boolean) => {
        if (bool) {
            fetchUsers();
        }
    }

    const handleUserDelete = async (email: string) => {
        setDeleting(true)
        try {
            const response = await delUser(email);
            if (response.userDeleted) {
                fetchUsers();
            }
        } catch (error) {
            console.log("Error while deleting the user")
        } finally {
            setDeleting(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="w-full flex items-center h-[100vh] justify-center">
                <LoadingDots />
            </div>
        );
    }


    if (status === "authenticated" && (role === "manager" || role === "admin")) {
        return (
            <div className="w-full flex z-[1000] justify-center">
                <AddUser showAddUser={showAddUser} setShowAddUser={setShowAddUser} addSuccess={handleAddSuccess} />
                <SignIn />
                <div className="container my-20">
                    <motion.div
                        className="z-10 mb-20 flex flex-col"
                        initial="hidden"
                        whileInView="show"
                        animate="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.8,
                                },
                            },
                        }}
                    >
                        <motion.h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
                            <Balancer>Manage</Balancer>
                        </motion.h2>
                        <motion.p className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-md font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-lg">
                            <Balancer>Manage database students and logs from this dashboard</Balancer>
                        </motion.p>
                    </motion.div>

                    <div className="flex flex-col items-center w-full gap-5 justify-center">
                        <div className="border bg-gray-50 rounded-md p-3 md:w-fit min-w-[33%] w-full border-gray-100">
                            <div className="w-full flex flex-row justify-between">
                                <h1 className="font-bold text-xl mb-4 w-full">
                                    Users
                                </h1>
                                <button className=" hover:bg-gray-100 mb-3 transition duration-100 rounded-sm py-0.5 px-1" onClick={() => setShowAddUser(true)}>
                                    <Plus />
                                </button>
                                <button disabled={loadingUsers} className=" hover:bg-gray-100 mb-3 transition duration-100 rounded-sm py-0.5 px-1" onClick={() => fetchUsers()}>
                                    <RefreshCw />
                                </button>
                            </div>
                            {loadingUsers ? (
                                <div className="flex w-full justify-center items-center">
                                    <LoadingDots />
                                </div>
                            ) : users.length > 0 ? (
                                <Table className="bg-transparent">
                                    <Table.Head>
                                        <Table.HeadCell>Username</Table.HeadCell>
                                        <Table.HeadCell>Email</Table.HeadCell>
                                        <Table.HeadCell>Role</Table.HeadCell>
                                        <Table.HeadCell>Password</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {users.map((user, i) => (
                                            <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                {editingUserId === user.id ? (
                                                    <>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="username"
                                                                    value={editedUser.username || ""}
                                                                    onChange={handleInputChange}
                                                                    className="p-2"
                                                                />
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="email"
                                                                    value={editedUser.email || ""}
                                                                    onChange={handleInputChange}
                                                                    className="p-2"
                                                                />
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <select
                                                                    name="role"
                                                                    disabled={role !== "admin"}
                                                                    value={editedUser.role || ""}
                                                                    onChange={handleInputChange}
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                >
                                                                    <option value="student">Student</option>
                                                                    <option value="manager">Manager</option>
                                                                    <option disabled={role !== "admin"} value="admin">Admin</option>
                                                                </select>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        name="password"
                                                                        value={editedUser.password || ""}
                                                                        onChange={handleInputChange}
                                                                        className="p-2"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <button
                                                                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                                                    onClick={handleSaveClick}
                                                                    disabled={saving}
                                                                >
                                                                    {saving ? <LoadingDots className="p-2" /> : "Save"}
                                                                </button>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <button onClick={() => setEditingUserId(null)} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200">
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </Table.Cell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            <div className="relative">
                                                                {user.username}{user.role == "admin" ? "**" : user.role === "manager" ? "*" : ""}
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">{user.role === "admin" && role !== 'admin' ? "not allowed" : user.email}</div></Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">{user.role}</div></Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <span
                                                                    onClick={() => togglePasswordVisibility(i)}
                                                                    className="text-[10px] cursor-pointer hover:bg-gray-100 rounded-md px-1 py-0.5 text-gray-600 w-full duration-100 transition">
                                                                    {user.role === "admin" && role !== "admin" ? "•".repeat(user.password.length) : visiblePasswords[i] ? user.password : "•".repeat(user.password.length)}
                                                                </span>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => handleEditClick(user)}
                                                                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                                                    disabled={user.role === "admin" && role !== "admin"}
                                                                >
                                                                    <Edit3 />
                                                                </button>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="relative">
                                                                <Popover
                                                                    trigger="click"
                                                                    placement="auto"
                                                                    content={
                                                                        <div className=" w-full rounded-md bg-white p-2 md:w-56">
                                                                            <div className="relative text-start space-y-2 p-2">
                                                                                <p className="text-sm font-semibold text-gray-900">
                                                                                    Are you sure you want to Delete the User?
                                                                                </p>
                                                                            <button disabled={deleting} onClick={() => handleUserDelete(user.email)} className="inline-flex w-full text-center items-center transition duration-100 rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-red-200">
                                                                                {deleting ? <LoadingDots className="py-2"/> : "Delete"}
                                                                            </button>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                >

                                                                    <button
                                                                        disabled={user.role === "admin" && role !== "admin" || user.email === email}
                                                                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                                                    >
                                                                        <Trash2 />
                                                                    </button>
                                                                </Popover>
                                                            </div>
                                                        </Table.Cell>
                                                    </>
                                                )}
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <span>No users found</span>
                                </div>
                            )}
                        </div>

                        <div className="border bg-gray-50 rounded-md w-full md:w-1/3 p-3 border-gray-100">
                            <div className="w-full flex flex-row justify-between">
                                <h1 className="font-bold text-xl mb-4 w-full">
                                    Logs
                                </h1>
                                <button disabled={loadingLogs} className=" hover:bg-gray-100 mb-3 transition duration-100 rounded-sm py-0.5 px-1" onClick={() => fetchLogs()}>
                                    <RefreshCw />
                                </button>
                            </div>
                            {loadingLogs ? (
                                <div className="flex w-full justify-center items-center">
                                    <LoadingDots />
                                </div>
                            ) : logs.length > 0 ? (
                                <Table className="bg-transparent">
                                    <Table.Head>
                                        <Table.HeadCell>Time</Table.HeadCell>
                                        <Table.HeadCell>Error</Table.HeadCell>
                                        <Table.HeadCell>DB Name</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {logs.map((log) => (
                                            <Table.Row key={log.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {new Date(log.created_at).toLocaleTimeString()}
                                                </Table.Cell>
                                                <Table.Cell>{log.message}</Table.Cell>
                                                <Table.Cell>{log.db_name}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            ) : (
                                <p className="text-center text-gray-500">No logs found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <div>NOT ALLOWED</div>;
}
