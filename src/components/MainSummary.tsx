import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { useTarget } from "./source";

export const TodaySummary1 = (props: any) => {
  const target = useTarget();
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>人员信息</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {target ? (
          <IonItem>
            姓名：
            {target.name}
          </IonItem>
        ) : (
          <IonText>请选择人员查看信息</IonText>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export const TodaySummary2 = (props: any) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonList className="col">
          {[1, 2, 3, 4].map((v) => (
            <IonItem key={v}>{v}</IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};
export const TodaySummary3 = (props: any) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonList className="col">
          {[31, 2, 3, 4].map((v) => (
            <IonItem key={v}>{v}</IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export const TodaySummary4 = (props: any) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonList className="col">
          {[41, 2, 3, 4].map((v) => (
            <IonItem key={v}>{v}</IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};
export const TodaySummary5 = (props: any) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonList className="col">
          {[51, 2, 3, 4].map((v) => (
            <IonItem key={v}>{v}</IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};
export const TodaySummary6 = (props: any) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonList className="col">
          {[61, 2, 3, 4].map((v) => (
            <IonItem key={v}>{v}</IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};
