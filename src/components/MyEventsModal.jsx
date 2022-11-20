import React from 'react';

import {
  Modal, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  ButtonGroup,
  IconButton,
  ListItemButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Events } from '../api.service';

function MyEventsModal({openMyEventsModal, handleMyEventsClose, setsnackbarState}) {
  const [myEvents, setMyEvents] = React.useState([]);

  React.useEffect(()=> {
    if(openMyEventsModal) {
      Events.getMyEvents()
      .then(({data}) => {
        setMyEvents(data)
      })
      .catch((err) => setsnackbarState({open: true, message: "Could not retrieve own events", severity: "error"}))
    }
  }, [openMyEventsModal])

  return(
    <Modal
      open={openMyEventsModal}
      onClose={handleMyEventsClose}
    >
            <Paper
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                boxShadow: 24,
                padding: '1rem',
            }}
            >
              <Typography variant="h5">My Events</Typography>
              <List style={{height: "80vh",overflow: 'auto'}}>
                {
                  myEvents && myEvents.map((event) => {
                    return (
                      <ListItem 
                        key={event.id} 
                        sx={{display: 'flex', justifyContent: 'end'}}
                      >
                        <ListItemText 
                          primary={event.name}
                          secondary={event.description}
                          sx={{flexGrow: 40}}
                        >
                        </ListItemText>
                          <ListItemButton sx={{flexShrink: 15}}>
                            <IconButton aria-label="delete" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemButton>
                          <ListItemButton sx={{flexShrink: 15}}>
                            <IconButton aria-label="delete" color="info">
                              <EditIcon />
                            </IconButton>
                          </ListItemButton>
                      </ListItem>
                    )
                  })
                }
              </List>
            </Paper>
    </Modal>
  )
}

export default MyEventsModal