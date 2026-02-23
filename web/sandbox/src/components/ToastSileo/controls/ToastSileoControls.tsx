import { useState } from "react";
import {
  ToastSileoView,
  type ToastPosition,
  type ToastTheme,
  type ToastType,
} from "../custom";

export const ToastSileoControls = () => {
  const [trigger, setTrigger] = useState(false);
  const [type, setType] = useState<ToastType>("error");
  const [title, setTitle] = useState("Error de carga");
  const [description, setDescription] = useState(
    "No se pudo inicializar Sileo",
  );
  const [position, setPosition] = useState<ToastPosition>("top-right");
  const [duration, setDuration] = useState(40000);
  const [theme, setTheme] = useState<ToastTheme>("light");

  const handleTrigger = () => {
    setTrigger(!trigger);
  };

  return (
    <>
      <div>
        <label>
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ToastType)}
          >
            <option value="success">success</option>
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="error">error</option>
            <option value="show">show</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Position
          <select
            value={position}
            onChange={(event) =>
              setPosition(event.target.value as ToastPosition)
            }
          >
            <option value="top-left">top-left</option>
            <option value="top-center">top-center</option>
            <option value="top-right">top-right</option>
            <option value="bottom-left">bottom-left</option>
            <option value="bottom-center">bottom-center</option>
            <option value="bottom-right">bottom-right</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Duration (ms)
          <input
            type="number"
            min={0}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value) || 0)}
          />
        </label>
      </div>
      <div>
        <label>
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as ToastTheme)}
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Trigger
          <input
            type="checkbox"
            checked={trigger}
            onChange={(event) => setTrigger(event.target.checked)}
          />
        </label>
      </div>
      <button onClick={handleTrigger}>Disparar toast</button>
      <ToastSileoView
        trigger={trigger}
        type={type}
        title={title}
        description={description}
        position={position}
        duration={duration}
        theme={theme}
      />
    </>
  );
};
