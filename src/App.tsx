import React, { useRef, useState } from "react";
import "./App.css";
import MapPage from "./MapPage.tsx";
import ChoseDepartPoint from "./ChoseDepartPoint.tsx";

function App(): JSX.Element {
  const [isDepartChosen, setIsDepartChosen] = useState(false);
  const [departPoint, setDepartPoint] = useState({});

  return isDepartChosen ? (
    <MapPage departPoint={departPoint} />
  ) : (
    <ChoseDepartPoint
      goToNextStep={() => {setIsDepartChosen(true)}}
      handlePlaceSelected={(place:any) => { setDepartPoint(place)}}
      disabled={Object.keys(departPoint).length == 0}
    />
  );
}

export default App;
