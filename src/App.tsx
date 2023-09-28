import React, { useState } from "react";
import "./App.css";
import MapPage from "./MapPage.tsx";
import ChoseDepartPoint from "./ChoseDepartPoint.tsx";
import {place} from "./Consts.tsx"

function App(): JSX.Element {
  const [isDepartChosen, setIsDepartChosen] = useState(false);
  const [departPoint, setDepartPoint] = useState<place | null>(null);

  return isDepartChosen  && departPoint ? (
    <MapPage departPoint={departPoint} />
  ) : (
    <ChoseDepartPoint
      goToNextStep={() => {setIsDepartChosen(true)}}
      handlePlaceSelected={(place:place) => { setDepartPoint(place)}}
      disabled={departPoint == null}
    />
  );
}

export default App;
