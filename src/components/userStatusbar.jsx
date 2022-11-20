import React from 'react';

import {
    Box,
    Paper,
    Button,
    Typography,
    Divider
} from "@mui/material";

import MyEventsModal from "./MyEventsModal";


function userStatusBar({ isUserLoggedIn, removeTokens, handleAuthOpen}) {
  const [openMyEventsModal, setOpenMyEventsModal] = React.useState(false);
  
  const handleMyEventsOpen = () => setOpenMyEventsModal(true);
  const handleMyEventsClose = () => setOpenMyEventsModal(false);
  
  return (
    <Box
      id="logged-in-bar"
      sx={{ position: "absolute", top: 0, right: "1rem" }}
    >
      {isUserLoggedIn ? (
        <div>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
            }}
          >
            <Button
              onClick={handleMyEventsOpen}
            >My Events</Button>
            <Divider orientation='vertical' flexItem sx={{maxHeight:'80%', mx:'8px'}}/>
            <Button
              color="error"
              onClick={removeTokens}
            >
              Log out
            </Button>
          </Paper>
          <MyEventsModal
           openMyEventsModal={openMyEventsModal}
           handleMyEventsClose={handleMyEventsClose} 
          >
          </MyEventsModal>
        </div>
      ) : (
        <Button
          variant="contained"
          size="small"
          color="success"
          type="out"
          onClick={() => {
            handleAuthOpen(true);
          }}
        >
          Login
        </Button>
      )}
    </Box>
  );
}

export default userStatusBar;
