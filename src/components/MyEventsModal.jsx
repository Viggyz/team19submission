import React, { useEffect } from "react";

import {
  Modal,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  ButtonGroup,
  IconButton,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventForm from "./EventForm";
import moment from "moment/moment"; 
import AddEventForm from "./addEventForm";
import { User, Events } from "../api.service";

function MyEventsModal({
  openMyEventsModal,
  handleMyEventsClose,
  setsnackbarState,
  refreshUserEvents,
}) {
  const [myEvents, setMyEvents] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [openEventModal, setOpenEventModal] = React.useState(false);
  const [currentEvent, setCurrentEvent] = React.useState();
  function setCreatedEvents() {
    User.createdEvents()
    .then(({ data }) => {
      setMyEvents(data);
    })
    .catch((err) =>
      setsnackbarState({
        open: true,
        message: "Could not retrieve own events",
        severity: "error",
      })
    );
  }
  useEffect(() => {
    if (selectedEvent) {
      Events.get(selectedEvent.id)
        .then(({ data }) => {
          setCurrentEvent(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedEvent]);
  React.useEffect(() => {
    if (openMyEventsModal) {
      setCreatedEvents();
    }
  }, [openMyEventsModal]);

  return openMyEventsModal ? (
    <div
      style={{
        height: "100vh",
        minWidth: "100vw",
        position: "fixed",
        left: "0",
        top: "0",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        handleMyEventsClose();
      }}
    >
      <Paper
        style={{
          // position: "relative",
          backgroundColor: "white",
          // top: "50%",
          // left: "50%",
          // transform: "translate(-50%, -25%)",
          width: "80%",
          boxShadow: 24,
          padding: "1rem",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Typography variant="h5">My Events</Typography>
        <List style={{ height: "80vh", overflow: "auto" }}>
          {myEvents.length ? (
            myEvents.map((event) => {
              return (
                <ListItem
                  key={event.id}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <ListItemText
                    primary={event.name}
                    secondary={event.description}
                    sx={{ flexGrow: 40, color: new Date(event.start_time) > new Date()?'text.primary': 'text.secondary' }}
                  >
                  </ListItemText>
                  {
                    new Date(event.start_time) > new Date() && 
                    (   
                      <>
                        <ListItemButton 
                          sx={{ flexShrink: 15 }}
                          onClick={() => {
                            setOpenModal(true);
                            setSelectedEvent(event);
                          }}
                          >
                          <IconButton
                            aria-label="delete"
                            color="error"
                            >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemButton>
                        <ListItemButton 
                          sx={{ flexShrink: 15 }}
                          onClick={() => {
                            setOpenEventModal(true);
                            setSelectedEvent(event);
                          }}
                        >
                          <IconButton
                            aria-label="delete"
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                        </ListItemButton>
                      </>
                    )
                  }
                </ListItem>
              );
            })
          ) : (
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Nothing to show here
            </Typography>
          )}
        </List>
      </Paper>

      {/* {eventLocation?(<Modal
        open={openEventModal}
        onClose={() => {
          setOpenEventModal(false);
        }}

        // style={{width:"fit-content"}}
      > */}
      {/* <div>da</div> */}
      {/* <EventForm location={eventLocation} setsnackbarState={setsnackbarState} handleEventClose={()=>{setOpenEventModal(false)}} userCity={`pass`} /> */}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AddEventForm
          openEventModal={openEventModal}
          handleEventClose={() => {
            refreshUserEvents();
            setCreatedEvents();
            setOpenEventModal(false);
          }}
          useCity={"pass"}
          setsnackbarState={setsnackbarState}
          currentEvent={currentEvent}
        />
      </div>
      {/* </Modal>):null}  */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}

        // style={{width:"fit-content"}}
      >
        <Paper
          style={{
            position: "relative",
            backgroundColor: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -25%)",
            width: "fit-content",
            padding: "1em",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Typography>Are you sure you want to delete?</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "0.5em",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                Events.delete(selectedEvent.id)
                .then(() => {
                    refreshUserEvents();
                    setCreatedEvents();
                    setOpenModal(false);
                  })
                  .catch(() => {
                    console.log("err");
                  });
              }}
            >
              DELETE
            </Button>
          </div>
        </Paper>
      </Modal>
    </div>
  ) : null;
}

export default MyEventsModal;
