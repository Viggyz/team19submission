import { useState, useCallback } from "react";

import {
  Paper,
  InputBase,
  Autocomplete,
  Grid,
  Typography,
} from "@mui/material";

import { searchPlaces } from "../api.service";

import { debouncedAPICall } from "../utils";

function SearchBar({ setUserCoords, setUserCity, setCurrentLocation }) {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  function callSearchAPI(inputText) {
    if (inputText.length > 3) {
      searchPlaces(inputText).then(({ data }) => {
        setOptions(data);
      });
    }
  }

  const debouncedCallSearchAPI = useCallback(
    debouncedAPICall(callSearchAPI),
    []
  );

  return (
    <div id="search-bar">
      <Autocomplete
        id="basic-search"
        sx={{
          width: { xs: "100vw", md: "20vw" },
          position: "absolute",
          top: { xs: "2.5rem", md: "1rem" },
          margin: { xs: "0 1rem 0 0 ", md: "0" },
          left: { xs: "0rem", md: "1rem" },
        }}
        options={options}
        getOptionLabel={(option) => (option && option.display_name) || ""}
        isOptionEqualToValue={(option, value) =>
          option.display_name === value.display_name
        }
        filterOptions={(x) => x}
        autoComplete
        value={value}
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue);
            setUserCity(newValue.address.city);
            setUserCoords({ longitude: newValue.lon, latitude: newValue.lat });
            setCurrentLocation(null);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          if (event.type === "change") {
            debouncedCallSearchAPI(newInputValue);
          }
        }}
        onKeyDown={(evt) => evt}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;

          return (
            <Paper
              component="form"
              elevation={4}
              sx={{
                width: { xs: "100vw", md: "20vw" },
                left: 0,
              }}
            >
              <InputBase
                sx={{ p: 1 }}
                {...params.InputProps}
                {...rest}
                placeholder="Enter a location to get started.."
              />
            </Paper>
          );
        }}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {option.display_name}
                </Typography>
              </Grid>
            </li>
          );
        }}
      />
    </div>
  );
}

export default SearchBar;
