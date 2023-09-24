import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import GoogleMap from "google-maps-react-markers";
import { Button, Chip, Grid } from "@mui/material";
import {
  NorthWestSharp as NorthWestSharpIcon,
  WhereToVote as WhereToVoteIcon,
} from "@mui/icons-material";

import PrettyAutocomplete from "./PrettyAutocomplete.tsx";
import { GOOGLE_API_KEY, place } from "./Consts.tsx";

function MapPage(props: { departPoint: any }): JSX.Element {
  const [locations, setLocations] = useState({});
  const { departPoint } = props;
  const [center, setCenter] = useState({
    lat: departPoint.geometry.location.lat(),
    lng: departPoint.geometry.location.lng(),
  });

    useEffect(() => {
  console.log("locations", locations)
    }, [locations])

  const addLocation = (location: place) => {
    console.log(locations)
    setLocations({ ...locations, [location.place_id]: location });
  };

  if (departPoint) {
    return (
      // Important! Always set the container height explicitly ( required by the google-map-react library)
      <Grid container style={{ height: "100vh", width: "100%" }}>
        {/* Add locations */}
        <Grid
          item
          xs={4}
          style={{
            padding: "2vh",
            backgroundImage: `url('./media/image-bg.jpg')`,
            backgroundSize: "cover",
          }}
        >
          <p className="element">
            Enter the locations you would like to visit. When you're done, click
            "Generate path".
          </p>
          <PrettyAutocomplete onSelect={(place: any) => addLocation(place)} onEnter={(place: any) => addLocation(place)} />
          <Button>Add location</Button>
          <div>
            {(Object.values(locations) as place[]).map((value) => (
              <Chip
                key={value.place_id}
                label={value.formatted_address}
                onDelete={addLocation}
                onClick={(event) => setCenter({ lat: 0, lng: 0 })}
                color={"success"}
              />
            ))}
          </div>
          <Button>Generate path</Button>
        </Grid>

        {/* Map */}
        <Grid item xs={8}>
          <GoogleMap
            apiKey={GOOGLE_API_KEY}
            defaultCenter={center}
            defaultZoom={13}
          >
            <MyWhereToVoteIcon
              lat={departPoint.geometry.location.lat()}
              lng={departPoint.geometry.location.lng()}
            />

            {(Object.values(locations) as place[]).map((value) => (
              <MyWhereToVoteIcon
                key={value.place_id} // Add a unique key if necessary
                lat={value.geometry.location.lat()}
                lng={value.geometry.location.lng()}
              />
            ))}
          </GoogleMap>
        </Grid>
      </Grid>
    );
  } else return <div />;
}

const MyWhereToVoteIcon = (props: any) => {
  return <NorthWestSharpIcon color="warning" fontSize="large" />;
};

export default MapPage;
