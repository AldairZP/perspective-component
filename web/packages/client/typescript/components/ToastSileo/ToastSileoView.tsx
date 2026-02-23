import "./ToastSileoView.module.css"
import { useState } from "react";
import { sileo, Toaster } from "sileo";
import type { SileoOptions } from "sileo";
import {toastSileoView_description_dark, toastSileoView_description_light} from "./ToastSileoView.module.css"
import { HtmlText } from "./HtmlText";

export const ToastSileoView = ({
  type,
  trigger,
  title,
  description,
  position,
  duration,
  theme
}: Props) => {
  const [prevTrigger, setPrevTrigger] = useState(trigger);
  const handleToast = () => {
    const options: SileoOptions = {
      title,
      description: <HtmlText html={description}/>,
      position,
      duration,
      fill: theme === "dark" ? "#171717" : "#E7E7E7",
      styles:{
        description: theme === "dark" ? toastSileoView_description_dark : toastSileoView_description_light
      }
    };

    switch (type) {
      case "success":
        sileo.success(options);
        break;
      case "info":
        sileo.info(options);
        break;
      case "warning":
        sileo.warning(options);
        break;
      case "error":
        sileo.error(options);
        break;
      default:
        sileo.show(options);
        break;
    }
  };

  if (trigger != prevTrigger) {
    handleToast();
    setPrevTrigger(trigger);
  }
  return (
      <Toaster />
  );
};
