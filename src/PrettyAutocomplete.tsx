import React, { useRef, useState } from "react";

import { Button, IconButton, InputBase, Paper } from "@mui/material";

import Autocomplete from "react-google-autocomplete";
import SearchIcon from "@mui/icons-material/Search";
const GOOGLE_API_KEY = "AIzaSyAMuN4NytblrM7MdkXlVu9-j2kt_dFVG4Y";

function PrettyAutocomplete(props: {onSelect: Function}): JSX.Element {
  const { onSelect } = props;
  return (
    <Paper
      component="form"
      sx={{
        p: "10px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
      }}
      className="element"
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Google Maps"
        //inputProps={{ "aria-label": "search google maps" }}
        inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
          <Autocomplete
            apiKey={GOOGLE_API_KEY}
            {...props}
            onPlaceSelected={(selected) => {if(selected) onSelect(selected)}}
            options={{types:[]}} //Ensute that not just cities are rendered when 
          />
        )}
      />
      {/* <SearchIcon sx={{ p: "10px" }} />  */}
    </Paper>
  );
}
export default PrettyAutocomplete;
