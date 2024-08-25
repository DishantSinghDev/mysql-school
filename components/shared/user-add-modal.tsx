import Modal from "./modal";
import { useState, Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { signIn } from "next-auth/react";

const SignInModal = ({
    showSignInModal,
    setShowSignInModal,
}: {
    showSignInModal: boolean;
    setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(""); // Reset error

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                // Other options if needed
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // On success:
            setShowSignInModal(false); // Close modal or redirect
        } catch (err) {
            setError("Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
            <div className="overflow-hidden w-full shadow-xl md:max-w-lg md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col justify-center items-center px-4 py-6 pt-8 space-y-3 text-center bg-white border-b border-gray-200 md:px-16">
                    <h3 className="text-2xl font-bold font-display">Add User</h3>
                    <p className="text-sm text-gray-500">
                        It is used add user to the database.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col px-4 py-8 space-y-4 bg-gray-50 dark:bg-gray-500 md:px-16">
                    <div className="mb-5">
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
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                            />
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`text-white ${error ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800`}
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export function useSignInModal() {
    const [showSignInModal, setShowSignInModal] = useState(false);

    const SignInModalCallback = useCallback(() => {
        return (
            <SignInModal
                showSignInModal={showSignInModal}
                setShowSignInModal={setShowSignInModal}
            />
        );
    }, [showSignInModal, setShowSignInModal]);

    return useMemo(
        () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
        [setShowSignInModal, SignInModalCallback],
    );
}
