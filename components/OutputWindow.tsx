import React from "react";

const getOutput = (outputDetails: any) => {
  if (outputDetails?.code) {
    // MySQL Error Handling
    return (
      <pre className="px-2 py-1 font-normal text-xs text-red-500">
        {`Error: ${outputDetails?.sqlMessage || outputDetails?.message}`}
      </pre>
    );
  } else if (Array.isArray(outputDetails) && outputDetails.length > 0) {
    // Display data in a table format with provided Tailwind CSS
    const headers = Object.keys(outputDetails[0]);

    return (
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {outputDetails.map((row: any, rowIndex: number) => (
              <tr
                key={rowIndex}
                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                  rowIndex === outputDetails.length - 1 ? 'dark:bg-gray-800' : ''
                }`}
              >
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    // Handle any other case (empty data)
    return (
      <pre className="px-2 py-1 font-normal text-xs text-gray-500">
        No data available.
      </pre>
    );
  }
};

const OutputWindow = ({ outputDetails }: any) => {
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full h-56  text-white font-normal text-sm overflow-auto">
        {outputDetails ? getOutput(outputDetails) : null}
      </div>
    </>
  );
};

export default OutputWindow;
