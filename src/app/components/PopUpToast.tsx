
import { ToastContainer, toast } from "react-toastify";

const toastConfig = {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const showSuccessToast = (msg: any) => {
    toast.success(msg || `Compiled Successfully!`, {
        ...toastConfig,
        position: "top-right",
        autoClose: 1000,
    });
};

export const showErrorToast = (msg: any) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
        ...toastConfig,
        position: "top-right",
        autoClose: 1000,
    });
};
export default function PopUpToast() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
}