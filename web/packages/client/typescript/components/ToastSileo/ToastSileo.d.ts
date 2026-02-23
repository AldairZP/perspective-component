declare module "*.module.css";

type typeToast = "success" | "info" | "warning" | "error" | "show";

type position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type theme = "dark" | "light";

interface Props {
  trigger: boolean;
  type: typeToast;
  title: string;
  description: string;
  position: position;
  duration: number;
  theme: theme;
}