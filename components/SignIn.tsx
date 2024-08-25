import { useState } from "react";
import { Popover, Avatar, Spinner } from "flowbite-react";
import { LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSignInModal } from "./shared/signin-modal";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [logOutClicked, setLogOutClicked] = useState(false);
   const { SignInModal, setShowSignInModal } = useSignInModal();

  const logOutUser = async () => {
    try {
      setLogOutClicked(true);
      await signOut();
    }
    catch (error) {
      console.error("Failed to log out:", error);
    }
    finally {
      setLogOutClicked(false);
    }
  };


  return (
    <>
    <SignInModal />
    <div className="absolute right-2 top-5">
      {session ? (
        <Popover
          trigger="click"
          placement="bottom-end"
          content={
            <div className="w-full rounded-md bg-white p-2 md:w-56">
              <button
                className="relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                onClick={logOutUser}
              >
                {logOutClicked ? (
                  <div className="relative flex items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <p className="text-sm">Logout</p>
                  </>
                )}
              </button>
            </div>
          }
        >
          <button className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9">
            <Avatar
              img={session.user?.image || `https://avatars.dicebear.com/api/micah/${session.user?.email}.svg`}
              rounded
              alt={session.user?.email || "User"}
            />
          </button>
        </Popover>
      ) : (
        <button
          onClick={() => setShowSignInModal(true)}
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          aria-label="SignIn"
        >
          Sign In
        </button>
      )}
    </div>
    </>
  );
}
