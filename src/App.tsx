import React from 'react';
import GoogleMapReact from 'google-map-react';
import './App.css';

import {Card, Box, Typography, CardContent, CardActions, Button} from '@mui/material';



function App(): JSX.Element {

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };


  return (
    

    // Important! Always set the container height explicitly ( required by the google-map-react library)
    <div style={{ height: '100vh', width: '100%' }}>
      <Box sx={{ minWidth: 275 }}>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>    </Box>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {/* <ReactComponent
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
        />  */}
      </GoogleMapReact>
    </div>
  );
}

export default App;
