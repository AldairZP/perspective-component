import { ToastSileoView } from "../custom";

export const ToastSileoReference = () => {
  return (
    <ToastSileoView
      trigger={false}
      type={"info"}
      title={"title"}
      description={"description"}
      position={"bottom-right"}
      duration={4000}
      theme={"light"}
    />
  );
};
