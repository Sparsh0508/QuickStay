import toast from "react-hot-toast";

export const handleSuccess = (message) => {
    toast.success(message, {
        duration: 4000,
        position: "top-right",
        style: {
            background: "#4BB543",
            color: "#fff",
        },
    });
};

export const handleError = (message) => {
    toast.error(message, {
        duration: 4000,
        position: "top-right",
        style: {
            background: "#FF3333",
            color: "#fff",
        },
    });
};

export const handleInfo = (message) => {
    toast(message, {
        duration: 4000,
        position: "top-right",
        style: {
            background: "#3333FF",
            color: "#fff",
        },
    });
};

export const handleLoading = (message) => {
    const toastId = toast.loading(message, {
        position: "top-right",
        style: {
            background: "#FFA500",
            color: "#fff",
        },
    });
    return toastId;
};

export const updateLoadingToast = (toastId, message, type = "success") => {
    if (type === "success") {
        toast.success(message, {
            id: toastId,
            duration: 4000,
            position: "top-right",
            style: {
                background: "#4BB543",
                color: "#fff",
            },
        });
    } else if (type === "error") {
        toast.error(message, {
            id: toastId,
            duration: 4000,
            position: "top-right",
            style: {
                background: "#FF3333",
                color: "#fff",
            },
        });
    }
};