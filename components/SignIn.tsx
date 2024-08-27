import { useState } from "react";
import { Popover, Avatar, Spinner } from "flowbite-react";
import { Home, LayoutDashboard, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSignInModal } from "./shared/signin-modal";
import LoadingDots from "./shared/icons/loading-dots";
import Link from "next/link";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [logOutClicked, setLogOutClicked] = useState(false);
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const [dashboardClicked, setDashboardClicked] = useState(false);
  const [homeClicked, setHomeClicked] = useState(false);

  const { email, name, role } = session?.user || {};

  const logOutUser = async () => {
    setLogOutClicked(true);
    try {
      await signOut({ redirect: false });
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
      <div className="absolute z-[100000] right-2 top-5">
        {session ? (
          <Popover
            trigger="click"
            placement="bottom-end"
            content={
              <div className="w-full rounded-md bg-white p-2 md:w-56">
                <div className="relative text-start space-y-2 p-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {name} <span className="text-xs">
                      ({role})
                    </span>
                  </p>
                  <p className="text-xs m-0">
                    {email}
                  </p>
                </div>
                <Link href="/">
                  <button
                    className="relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                  >
                    <>
                      <Home className="h-4 w-4" />
                      <p className="text-sm">Home</p>
                    </>
                  </button>
                </Link>
                {role === "admin" || role === "manager" ? (
                  <Link href="/dashboard">
                    <button
                    disabled={dashboardClicked}
                      className="relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                    >
                      <>
                        <LayoutDashboard className="h-4 w-4" />
                        {dashboardClicked ?  <LoadingDots className="py-2"/> : <p className="text-sm">Dashboard</p>}
                      </>
                    </button>
                  </Link>
                ):(
                  <></>
                )}
                <button
                  className="relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                  onClick={logOutUser}
                >
                  {logOutClicked ? (
                    <div className="relative flex items-center justify-center">
                      <LoadingDots className="py-2"/>
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
                img={`https://i.ibb.co/r0hNXqW/image.png`}
                rounded
                alt={email || "User"}

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
