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

function MapPage(props: { departPoint: place }): JSX.Element {
  const { departPoint } = props;

  const [locations, setLocations] = useState<{ [key: string]: place }>({});
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const mapRef = useRef<any | null>(null); // Type any because can't resolve google.map.Maps
  const waypoints: google.maps.DirectionsWaypoint[] = [];

  const country = departPoint.address_components.find((component: {types: string[]}) =>
    component.types.some(type => type === 'country'))?.short_name;


  function initialize_map(map: google.maps.Map) {
    // Create directions service and renderer upon loading
    setDirectionsService(new google.maps.DirectionsService());
    setDirectionsRenderer(new google.maps.DirectionsRenderer());
    mapRef.current = map;
    directionsRenderer?.setMap(map);
  }

  useEffect(() => { // Make sure directionsRenderer.getMap() is never null
    if (directionsRenderer && mapRef.current) {
      directionsRenderer.setMap(mapRef.current);
    }
  }, [directionsRenderer, mapRef.current]);


  // Add location to location state
  function addLocation(location: place) {
    setLocations((prev_locations) => ({
      ...prev_locations,
      [location.place_id]: location,
    }));
  }

  // Delete location from location state
  function deleteLocation(location: place) {
    let new_locations = { ...locations };
    delete new_locations[location.place_id];
    setLocations(new_locations);
  }

  // Choose closest location
  async function choose_next_location(
    current: place,
    not_visited: { [key: string]: place }
  ) {
    let shortest_result: google.maps.DirectionsResult | null = null;
    let shortest_id: string = "";

    // Async request to get path from origin to destination
    const fetchDirections = async (value: place) => {
      if(!current) return
      return new Promise<void>((resolve) => {
        directionsService?.route(
          {
            origin: {
              lat: current.geometry.location.lat(),
              lng: current.geometry.location.lng(),
            },
            destination: {
              lat: value.geometry.location.lat(),
              lng: value.geometry.location.lng(),
            },
            travelMode: google.maps.TravelMode.WALKING
            },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              if (
                !shortest_result ||
                shortest_result.routes[0].legs[0].distance.value >
                  result.routes[0].legs[0].distance.value
              ) {
                shortest_result = result;
                shortest_id = value.place_id;
              }
            }
            resolve();
          }
        );
      });
    };

    // Calling function to fetch directions for every element in not_visited
    await Promise.all(
      Object.values(not_visited).map(async (value: place) => {
        await fetchDirections(value);
      })
    );
    return { shortest_id, shortest_result };
  }

  // BFS algorithm to get shortest path
  async function generatePath() {
    // Check the user entered locations
    if (Object.keys(locations).length === 0) return;
    let current: place = { ...departPoint };
    let not_visited: { [key: string]: place } = { ...locations };

    while (Object.keys(not_visited).length > 0) {
      // Get next location, add it to waypoints and delete it from not_visited
      let response = await choose_next_location(current, not_visited);
      current = { ...not_visited[response.shortest_id] };
      waypoints.push({location: current.formatted_address})
      delete not_visited[response.shortest_id];
    }

    waypoints.pop()
    
    // Trace route in the correct order
    directionsService?.route(
      {
        origin: {
          lat: departPoint.geometry.location.lat(),
          lng: departPoint.geometry.location.lng(),
        },
        destination: {
          lat: current.geometry.location.lat(),
          lng: current.geometry.location.lng(),
        },
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING
        },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer?.setDirections(result);  // Trace route      
        }
      }
    );
 
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
              onSelect={(place: place) => place && addLocation(place)}
              onEnter={(place: place) => place && addLocation(place)}
              country={country}
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
            onGoogleApiLoaded={({ map, maps }: any) => initialize_map(map)}
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
