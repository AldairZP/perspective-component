export type ToastType = "success" | "info" | "warning" | "error" | "show";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastTheme = "dark" | "light";

export interface ToastSileoProps {
  trigger: boolean;
  type: ToastType;
  title: string;
  description: string;
  position: ToastPosition;
  duration: number;
  theme: ToastTheme;
}
