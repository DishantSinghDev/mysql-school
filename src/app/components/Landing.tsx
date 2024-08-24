import React, { useEffect, useState } from "react";
import BashEditorWindow from "./BashEditor";
import PopUpToast, { showSuccessToast, showErrorToast } from "./PopUpToast";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "@/app/hooks/useKyePress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import SignIn from "./SignIn";
import { useSession } from "next-auth/react";
import { OnChange } from "@monaco-editor/react";
import { SingleValue } from "react-select";

// Default code for a new file
const SQL = `CREATE TABLE Students (
  ID int NOT NULL,
  LastName varchar(255) NOT NULL,
  FirstName varchar(255),
  Age int,
  PRIMARY KEY (ID)
);`;

const Landing = () => {
  const { data: session, status } = useSession(); // Access user session
  const [code, setCode] = useState(SQL);
  const [theme, setTheme] = useState("cobalt");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  // Handle theme change
  const handleThemeChange = (selectedOption: SingleValue<{ value: string }>) => {
    if (selectedOption) {
      const themeId = selectedOption.value;
      if (["light", "vs-dark"].includes(themeId)) {
        setTheme(themeId);
      } else {
        defineTheme(themeId).then(() => setTheme(themeId));
      }
    }
  };

  // Handle key press events
  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleQuery();
    }
  }, [ctrlPress, enterPress]);

  // Handle code changes
  const handleEditorChange: OnChange = (value, event) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  // Handle query execution
  const handleQuery = async () => {
    if (!session?.user) {
      showErrorToast("You need to sign in to run the query!");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setOutputDetails(data);
      showSuccessToast("Query executed successfully!");
    } catch (error) {
      showErrorToast("Error executing query!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PopUpToast />
      <SignIn />
      <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <BashEditorWindow
            code={code}
            onChange={handleEditorChange} // Pass the updated handler
            theme={theme}
          />
        </div>
        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <button
              onClick={handleQuery}
              disabled={!code || !session?.user || processing}
              className={`mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0
                ${!code || !session?.user || processing ? "opacity-50" : ""}`}
            >
              {processing ? "Processing..." : "Run Query"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
