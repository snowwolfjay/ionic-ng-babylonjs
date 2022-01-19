import { Route } from "react-router-dom";
import Home from "./pages/Home";
export default function () {
  return (
    <>
      <Route exact path="/home">
        <Home />
      </Route>
    </>
  );
}
