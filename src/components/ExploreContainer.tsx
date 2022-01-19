import { useIonToast } from "@ionic/react";
import React from "react";
import "./ExploreContainer.css";
import { initScene } from "./map";
// import { initScene } from "./sim1";
import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonItem,
} from "@ionic/react";
interface ContainerProps {}

const GuardInfoPanel = (props: any) => {
  if (!props.target) {
    return null;
  }
  return (
    <IonCard style={{ position: "fixed", top: 20, left: 20 }}>
      <IonCardHeader>
        <IonCardTitle>人员信息</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem>
          姓名：
        {props.target.name}
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export class ExploreContainer extends React.PureComponent {
  canvas?: any | null;
  state = {
    target: null as any,
  };
  componentDidMount() {
    const {  change$$ } = initScene(this.canvas!);
    change$$.subscribe((v) => {
      switch (v.action) {
        case "pick":
          console.log(v.data);
          this.setState({ target: v.data });
          break;
        case "reset":
        case "":
          this.setState({ target: null });
          break;
        default:
          break;
      }
    });
  }
  render(): React.ReactNode {
    console.log('render -------------- ')
    return (
      <div className="container">
        <div  ref={(el) => (this.canvas = el)}></div>
        <GuardInfoPanel target={this.state.target}></GuardInfoPanel>
      </div>
    );
  }
}

export default ExploreContainer;
