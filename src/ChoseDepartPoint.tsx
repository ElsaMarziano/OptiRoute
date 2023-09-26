import React from "react";

import { Button } from "@mui/material";

import PrettyAutocomplete from "./PrettyAutocomplete.tsx";

function ChoseDepartPoint(props: {
  goToNextStep: Function;
  handlePlaceSelected: Function;
  disabled: boolean;
}): JSX.Element {
  const { goToNextStep, handlePlaceSelected, disabled } = props;

  return (
    <div className="main">
      <div className="overlay"></div>
      <video src={require("./media/video-bg.mp4")} autoPlay loop muted />
      <div className="content">
        <h1 className="element">Welcome to OptiRoute</h1>
        <p className="element">
          Let's help you plan your trip! Please enter the address of your
          departure point.
        </p>

        <PrettyAutocomplete onSelect={handlePlaceSelected} onEnter={goToNextStep}/>

          <Button
          style={{visibility: disabled? "hidden" : "visible"}}
            variant="contained"
            color="success"
            size="large"
            onClick={() => {if(!disabled) goToNextStep()}}
          >
            Let's go!
          </Button>

      </div>
    </div>
  );
}

export default ChoseDepartPoint;
