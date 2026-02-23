import {
  ComponentMeta,
  ComponentProps,
  PComponent,
  PropertyTree,
  SizeObject,
} from "@inductiveautomation/perspective-client";
import { ToastSileoView } from "./ToastSileo/ToastSileoView";

export const COMPONENT_TYPE = "rad.display.toastsileo";

type ToastSileoType = "success" | "info" | "warning" | "error" | "show";
type ToastSileoPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
type ToastSileoTheme = "dark" | "light";

interface ToastSileoProps {
  trigger: boolean;
  type: ToastSileoType;
  title: string;
  description: string;
  position: ToastSileoPosition;
  duration: number;
  theme: ToastSileoTheme;
}

export const ToastSileoComponent = (props: ComponentProps<ToastSileoProps>) => {
  return (
    <ToastSileoView
      trigger={props.props.trigger}
      type={props.props.type}
      title={props.props.title}
      description={props.props.description}
      position={props.props.position}
      duration={props.props.duration}
      theme={props.props.theme}
    />
  );
};

export class ToastSileoComponentMeta implements ComponentMeta {
  getComponentType(): string {
    return COMPONENT_TYPE;
  }

  getDefaultSize(): SizeObject {
    return {
      width: 300,
      height: 300,
    };
  }

  getViewComponent(): PComponent {
    return ToastSileoComponent as PComponent;
  }

  getPropsReducer(tree: PropertyTree): ToastSileoProps {
    return {
      trigger: tree.read("trigger", false),
      type: tree.read("type", "info"),
      title: tree.read("title", "title"),
      description: tree.read("description", "description"),
      position: tree.read("position", "bottom-right"),
      duration: tree.read("duration", 4000),
      theme: tree.read("theme", "light"),
    };
  }
}
