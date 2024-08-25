"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, Popover, Table } from "flowbite-react";
import { getLogs, getUsers, updateUser } from "../api/db-api"; // Assume updateUser is your API to save data
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
    const role = session?.user?.role;
    const [saving, setSaving] = useState(false)
    const [users, setUsers] = useState<User[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});
    const [isVisible, setIsVisible] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false)

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    const fetchLogsNUsers = async () => {
        setLoadingUsers(true);
        setLoadingLogs(true);
        try {
            const users = await getUsers();
            setLoadingUsers(false);
            if (users.userFound) {
                setUsers(users.user);
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
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error occurred while fetching users", error);
            setLoadingUsers(false);
        }
    };
    useEffect(() => {

        if (status === "authenticated" && (role === "manager" || role === "admin")) {
            fetchLogsNUsers();
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSuccess = (bool: boolean) => {
        if (bool) {
            fetchLogsNUsers();
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

                    <div className="flex flex-col md:flex-row w-full gap-5 justify-center">
                        <div className="border bg-gray-50 rounded-md p-3 md:w-fit w-full border-gray-100">
                            <div className="w-full flex flex-row justify-between">
                                <h1 className="font-bold text-xl mb-4 w-full">
                                    Users
                                </h1>
                                <button className=" hover:bg-gray-100 mb-3 transition duration-100 rounded-sm py-0.5 px-1" onClick={() => setShowAddUser(true)}>
                                    <Plus />
                                </button>
                            </div>
                            {loadingUsers ? (
                                <div className="flex w-full justify-center items-center">
                                    <LoadingDots />
                                </div>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <Card key={user.id} className="w-full mb-3 dark:bg-white">
                                        <div className="flex flex-row gap-5 items-center py-2 px-3">
                                            {editingUserId === user.id ? (
                                                <>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={editedUser.username || ""}
                                                            onChange={handleInputChange}
                                                            className="text-xl font-medium text-gray-900 p-2 max-w-fit"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="role"
                                                            value={editedUser.role || ""}
                                                            onChange={handleInputChange}
                                                            className="text-sm text-gray-500 p-2 w-fit"
                                                        />
                                                    </div>

                                                    <div>
                                                        {saving ? (

                                                            <button
                                                                disabled
                                                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200  "
                                                            >
                                                                <LoadingDots />
                                                            </button>
                                                        ) : (

                                                            <button
                                                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 "
                                                                onClick={handleSaveClick}
                                                            >
                                                                Save
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div>
                                                        <h5 className="text-xl font-medium text-gray-900 ">
                                                            {user.username}
                                                        </h5>
                                                        <span className="text-sm text-gray-500 ">
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-base text-gray-700 ">
                                                            {user.email}
                                                        </h5>
                                                        <div className="relative">
                                                            <span className="text-[10px] text-gray-500">
                                                                {isVisible ? user.password : '•'.repeat(user.password.length)}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={toggleVisibility}
                                                                className="absolute right-0 top-0 mt-1.5 mr-2"
                                                            >
                                                                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button
                                                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 "
                                                            onClick={() => handleEditClick(user)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex justify-center items-center">
                                                <Popover
                                                    trigger="click"
                                                    placement="bottom-end"
                                                    content={
                                                        <div className="w-full rounded-md bg-white p-2 md:w-56">
                                                            <button
                                                                className="relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                                                            >
                                                                <>
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <p className="text-sm">Delete</p>
                                                                </>
                                                            </button>
                                                        </div>
                                                    }
                                                >
                                                    <button className="flex h-8 w-8 items-center justify-center border border-gray-100 rounded-sm transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9">
                                                        <Ellipsis />
                                                    </button>
                                                </Popover>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No users found</p>
                            )}
                        </div>

                        <div className="border bg-gray-50 rounded-md w-full md:w-1/3 p-3 border-gray-100">
                            <h1 className="font-bold text-xl mb-4 w-full text-center">
                                Logs
                            </h1>
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
