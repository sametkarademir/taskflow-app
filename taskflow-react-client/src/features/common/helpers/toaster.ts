import { toast } from "react-toastify";

export function showToast(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration: number = 3000,
  position:
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center" = "top-center",
): void {
  switch (type) {
    case "success":
      toast.success(message, {
        position: position,
        autoClose: duration,
      });
      break;
    case "error":
      toast.error(message, {
        position: position,
        autoClose: duration,
      });
      break;
    case "info":
      toast.info(message, {
        position: position,
        autoClose: duration,
      });
      break;
    case "warning":
      toast.warn(message, {
        position: position,
        autoClose: duration,
      });
      break;
    default:
      toast(message, {
        position: position,
        autoClose: duration,
      });
  }
}
