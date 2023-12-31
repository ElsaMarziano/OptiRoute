import React from "react";

import { InputBase, Paper } from "@mui/material";

import { usePlacesWidget } from "react-google-autocomplete";
const GOOGLE_API_KEY = "AIzaSyAMuN4NytblrM7MdkXlVu9-j2kt_dFVG4Y";

function PrettyAutocomplete(props: {
  onSelect: Function;
  onEnter: Function;
  country?: string;
}): JSX.Element {

  const { onSelect, onEnter, country } = props;
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: GOOGLE_API_KEY,
    onPlaceSelected: (selected: any) => {
      if (selected) onSelect(selected);
    },
    options: { 
      types: [],  //Ensure that not just cities are rendered
      componentRestrictions: { country: country ? country : [] } 
    }
  });


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
        inputProps={{ "aria-label": "search google maps" }}
        inputRef={ref}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key == "Enter") {
            event.preventDefault();
            if (
              autocompleteRef.current &&
              autocompleteRef.current.getPlace() &&
              autocompleteRef.current.getPlace().formatted_address
            ) {
              onSelect(autocompleteRef.current.getPlace());
              onEnter();
            }
          }
        }}
      />
      {/* <SearchIcon sx={{ p: "10px" }} />  */}
    </Paper>
  );
}
export default PrettyAutocomplete;
