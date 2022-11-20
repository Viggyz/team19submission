import React from "react";

import {Paper, TextField, Autocomplete, Grid, Typography } from "@mui/material";

import {searchPlaces} from "../api.service";

import {debouncedAPICall} from "../utils";

function SearchBar({ setUserCoords}) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  function callSearchAPI(inputText) {
      if (inputText.length > 3) {
        searchPlaces(inputText)
        .then(({ data }) => {
          // handle its a bad request
          setOptions(data);
        });
      }
    }

  const debouncedCallSearchAPI = React.useCallback(debouncedAPICall(callSearchAPI), []);

  return (
    <div id="search-bar">
      <Autocomplete
        id="basic-search"
        sx={{ width: 300 }}
        options={options}
        getOptionLabel={(option) =>
          option && option.display_name || ""
        }
        isOptionEqualToValue={(option, value) => option.display_name === value.display_name}
        filterOptions={(x) => x}
        autoComplete
        // includeInputInList
        // filterSelectedOptions
        value={value}
        onChange={(event, newValue) => {
            if(newValue) {
                setValue(newValue);
                setUserCoords({longitude: newValue.lon,latitude: newValue.lat})
            }
        }}
        onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            if(event.type === 'change') {
                debouncedCallSearchAPI(newInputValue);
            }
        }}
        renderInput={(params) => (
            <Paper elevation={5} sx = {{
              minWidth: '500px'
            }}>
              <TextField 
                {...params} 
                sx={{margin: '1rem', backgroundColor: 'white' }} 
                label="Add a location" 
                InputLabelProps={{ disabled: true}}
            />
            </Paper>
        )}
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
