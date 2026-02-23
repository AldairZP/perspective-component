import {
  ComponentMeta,
  ComponentRegistry,
} from "@inductiveautomation/perspective-client";

import "./css/main.css";

export * from "./components";

import { ToastSileoComponentMeta } from "./components";

const components: Array<ComponentMeta> = [new ToastSileoComponentMeta()];

components.forEach((component: ComponentMeta) =>
  ComponentRegistry.register(component),
);
