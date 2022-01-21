import {
  IonContent,
  IonHeader,
  IonImg,
  IonModal,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import React from "react";
import "./ExploreContainer.css";
import { initScene } from "./map";
import { target$$ } from "./source";

export class OverviewZone extends React.PureComponent {
  canvas?: any | null;
  state = {
    target: null as any,
    showFloor: 0,
  };
  componentDidMount() {
    const { change$$ } = initScene(this.canvas!);
    change$$.subscribe((v) => {
      switch (v.action) {
        case "pick":
          console.log(v.data);
          if (v.data?.type === "baoan") target$$.next(v.data);
          if (v.data?.type === "floor")
            this.setState({ showFloor: v.data.level });
          break;
        case "reset":
        case "":
          target$$.next(null);
          this.setState({ target: null, showFloor: 0 });
          break;
        default:
          break;
      }
    });
  }
  render(): React.ReactNode {
    console.log("render -------------- ");
    return (
      <div className="container">
        <canvas
          key="canvs"
          style={{ width: "10vw", height: "100vh" }}
          ref={(el) => (
            console.log(el === this.canvas),
            el && (this.canvas = el),
            console.log(el)
          )}
        ></canvas>
        {/* <GuardInfoPanel target={this.state.target}></GuardInfoPanel> */}
        {/* */}
        <IonModal onDidDismiss={()=>{}} isOpen={!!this.state.showFloor}>
          <IonHeader>
            <IonTitle>{this.state.showFloor}</IonTitle>
          </IonHeader>
          <IonContent>
            <div style={{ display: "flex", alignItems: "center" ,height:'100%'}}>
              <IonImg src="/assets/img/demo-floor.jpg"></IonImg>
            </div>
          </IonContent>
        </IonModal>
      </div>
    );
  }
}

export default OverviewZone;
