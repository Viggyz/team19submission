import React from "react";

import { TextField, Autocomplete, Grid, Typography } from "@mui/material";
import axios from "axios";

function SearchBar({ setUserCoords}) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  const debounce = (func) => {
    let  timer;
    return function (...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
        }, 600);
    };
  };
  
  function callSearchAPI(inputText) {
      if (inputText.length > 3) {
        inputText = new URLSearchParams(inputText);
        axios
          .get(
            `http://localhost:8000/api/search?q=${inputText}`
          )
          .then(({ data }) => {
            // handle its a bad request
            setOptions(data);
            // setUserCoords(coords);
          });
      }
    }

  const debouncedCallSearchAPI = React.useCallback(debounce(callSearchAPI), []);

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
            <TextField 
                {...params} 
                sx={{margin: '1rem', backgroundColor: 'white' }} 
                label="Add a location" 
                InputLabelProps={{ disabled: true}}
            />
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
