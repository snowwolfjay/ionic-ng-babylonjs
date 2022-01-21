import React, { useState } from "react";
import { IonContent, IonCard, IonCardContent } from "@ionic/react";
import asideStyle from "./aside.module.scss";

const PanelFixed: React.FC<any> = (props: any, { slots }) => {
  return (
    <aside
      {...props}
      className={asideStyle.panel + " " + props.className}
    ></aside>
  );
};
export const LeftPanel: React.FC<any> = (props: any, { slots }) => {
  const [open, setState] = useState(false);
  return (
    <PanelFixed
      className={open ? asideStyle.panel_left_open : asideStyle.panel_left}
      onClick={() => setState(!open)}
    >
      {props.children}
    </PanelFixed>
  );
};

export const RightPanel: React.FC<any> = (props: any, { slots }) => {
  const [open, setState] = useState(false);
  return (
    <PanelFixed
      className={open ? asideStyle.panel_right_open : asideStyle.panel_right}
      onClick={(ev: PointerEvent) => {
        setState(!open);
        console.error(ev);
        ev.stopPropagation();
      }}
    >
      {props.children}
    </PanelFixed>
  );
};
