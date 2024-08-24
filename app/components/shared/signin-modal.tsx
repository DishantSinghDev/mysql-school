import Modal from "./modal";
import {
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import LoadingDots from "./icons/loading-dots";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"

const SignInModal = ({
    showSignInModal,
    setShowSignInModal,
}: {
    showSignInModal: boolean;
    setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const [loginClicked, setLoginClicked] = useState(false);
    const [stLoginClicked, setStLoginClicked] = useState(false);
    const router = useRouter();
    const pageName = router.pathname;







    return (
        <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
            <div className="overflow-hidden w-full shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col justify-center items-center px-4 py-6 pt-8 space-y-3 text-center bg-white border-b border-gray-200 md:px-16">

                    <h3 className="text-2xl font-bold font-display">Sign In</h3>
                    <p className="text-sm text-gray-500">
                        We will fetch every data of you from our database to provide best experience.
                    </p>
                </div>
                <form className="mx-auto">
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
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