import React, { useRef, useState } from "react";
import "./App.css";
import MapPage from "./MapPage.tsx";
import ChoseDepartPoint from "./ChoseDepartPoint.tsx"



function App(): JSX.Element {
  const [isDepartChosen, setIsDepartChosen] = useState(false)
  const [departPoint, setDepartPoint] = useState()


  return (
    isDepartChosen ? <MapPage /> : <ChoseDepartPoint />
  )
}

export default App;
