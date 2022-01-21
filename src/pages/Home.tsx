import { IonContent, IonPage } from "@ionic/react";
import { LeftPanel, RightPanel } from "../components/Panel";
import OverviewZone from "../components/OverviewZone";
import "./Home.css";
import {
  TodaySummary1,
  TodaySummary2,
  TodaySummary3,
  TodaySummary4,
  TodaySummary5,
  TodaySummary6,
} from "../components/MainSummary";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <LeftPanel>
          <TodaySummary1></TodaySummary1>
          <TodaySummary2></TodaySummary2>
          <TodaySummary3></TodaySummary3>
        </LeftPanel>
        <OverviewZone />
        <RightPanel>
          <TodaySummary5></TodaySummary5>
          <TodaySummary4></TodaySummary4>
          <TodaySummary6></TodaySummary6>
        </RightPanel>
      </IonContent>
    </IonPage>
  );
};

export default Home;
