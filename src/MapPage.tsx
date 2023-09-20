import React, { useRef, useState } from "react";
import "./App.css";

import GoogleMapReact from "google-map-react";
import Autocomplete from "react-google-autocomplete"
import { Button, Grid } from "@mui/material";

const GOOGLE_API_KEY = 'AIzaSyAMuN4NytblrM7MdkXlVu9-j2kt_dFVG4Y';

function MapPage(): JSX.Element {
  const [locations, setLocations] = useState([])

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };


  return (
    // Important! Always set the container height explicitly ( required by the google-map-react library)
    <Grid container style={{ height: "100vh", width: "100%" }}>
      
      <Grid item xs={4}>
        Let's help you plan your trip! Please enter your departure point.
        <Autocomplete
        style={{width: "60%", height:"3vh",margin:"1vh"}}
          apiKey={GOOGLE_API_KEY}
          onPlaceSelected={(place) => console.log(place)}
        />
        <Button>Add location</Button>
        <Button>Generate path</Button>
      </Grid>


      <Grid item xs={8}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY, libraries:['places']
        }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
           {/* <ReactComponent
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
          />   */}
        </GoogleMapReact>
      </Grid>
    </Grid>
  );
}

export default MapPage;
