import { toast, Bounce } from "react-toastify";

const OPTS = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "dark",
  transition: Bounce,
};

export const toastSuccess = (message) => {
  toast.dismiss();
  toast.success(message, OPTS);
};

export const toastError = (message) => {
  toast.dismiss();
  toast.error(message, { ...OPTS, autoClose: 3000 });
};

export const toastInfo = (message) => {
  toast.dismiss();
  toast.info(message, OPTS);
};
