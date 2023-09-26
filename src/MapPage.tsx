import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import BackgroundImage from "./media/image-bg.jpg";

import GoogleMap from "google-maps-react-markers";
import { Button, Chip, Grid } from "@mui/material";
import {
  NorthWestSharp as NorthWestSharpIcon,
  WhereToVote as WhereToVoteIcon,
} from "@mui/icons-material";

import PrettyAutocomplete from "./PrettyAutocomplete.tsx";
import { GOOGLE_API_KEY, place } from "./Consts.tsx";

const styles = {
  gridContainer: {
    backgroundImage: `url(${BackgroundImage})`,
    padding: "2vh",
    backgroundSize: "cover",
  },
};

function MapPage(props: { departPoint: any }): JSX.Element {
  const [locations, setLocations] = useState<{ [key: string]: place }>({});
  const mapRef = useRef<any | null>(null); // Type any because can't resolve google.map.Maps
  const { departPoint } = props;
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  function addLocation(location: place) {
    setLocations((prev_locations) => ({
      ...prev_locations,
      [location.place_id]: location,
    }));
  }

  function deleteLocation(location: place) {
    let new_locations = { ...locations };
    delete new_locations[location.place_id];
    setLocations(new_locations);
  }
  

  function generatePath() {
    if (Object.keys(locations).length == 0) return;
    let current: place = departPoint;
    let not_visited: { [key: string]: place } = { ...locations }; // Places we haven't visited yet, update while we go through loop
    while (Object.keys(not_visited).length > 0) {

      let distances: { [key: string]: number} = {};
      
      (Object.values(not_visited) as place[]).forEach((value) => {
      directionsService.route(
        {
          origin: {lat: current.geometry.lat(), lng: current.geometry.lng()},
          destination: {lat: value.geometry.lat(), lng: value.geometry.lng()},
          // travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // directionsRenderer.setDirections(result);
            distances[value.place_id] = result.routes[0].legs[0].distance.value
            console.log(value.formatted_address, distances[value.place_id])
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
      })
not_visited={}
    }
  }

  if (departPoint) {
    return (
      // Important! Always set the container height explicitly ( required by the google-map-react library)
      <Grid container style={{ height: "100vh", width: "100%" }}>
        {/* Add locations */}

        <Grid item xs={4} style={styles.gridContainer}>
          <div className="overlay"></div>
          <div className="functional-content">
            <p className="element">
              Enter the locations you would like to visit. When you're done,
              click "Generate path".
            </p>
            <PrettyAutocomplete
              onSelect={(place: any) => {
                addLocation(place);
              }}
              onEnter={(place: any) => addLocation(place)}
            />

            <div style={{ overflowY: "auto", height: "50vh" }}>
              {(Object.values(locations) as place[]).map((value) => (
                <Chip
                  key={value.place_id}
                  label={value.formatted_address}
                  onDelete={(e) => deleteLocation(value)}
                  onClick={(
                    e // Center map on corresponding marker
                  ) =>
                    mapRef.current &&
                    mapRef.current.setCenter({
                      lat: value.geometry.location.lat(),
                      lng: value.geometry.location.lng(),
                    })
                  }
                  color={"success"}
                  style={{ margin: "1vh", maxWidth: "30%" }}
                />
              ))}
            </div>
            <Button
              onClick={generatePath}
              variant={"contained"}
              color={"success"}
              style={{ position: "absolute", bottom: "0" }}
            >
              Generate path
            </Button>
          </div>
        </Grid>

        {/* Map */}
        <Grid item xs={8}>
          <GoogleMap
            apiKey={GOOGLE_API_KEY}
            defaultCenter={{
              lat: departPoint.geometry.location.lat(),
              lng: departPoint.geometry.location.lng(),
            }}
            defaultZoom={13}
            onGoogleApiLoaded={({ map, maps }: any) => (mapRef.current = map)}
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
