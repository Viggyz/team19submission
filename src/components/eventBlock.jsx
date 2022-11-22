import React from 'react';

import moment from 'moment/moment';

import {
    IconButton,
    Fab, 
    Box, 
    Paper, 
    Divider, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemButton, 
    ListItemSecondaryAction,
    Button,
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import AddIcon from '@mui/icons-material/Add';

import { Locations  } from "../api.service";
import EventDetailModal from './EventDetailModal';

function EventsBlock({
    location,
    setUserCoords,
    setCurrentEvents,
    currentEvents,
    handleEventOpen,
    openAuthModal, 
    isUserLoggedIn
}) {
    const [openEventDetailModal, setOpenEventDetailModal] = React.useState(false);

    const handleEventDetailModalOpen = () => setOpenEventDetailModal(true);
    const handleEventDetailModalClose = () => setOpenEventDetailModal(false);

    const [eventDetailID, setEventDetailID] = React.useState(null)

    const passEventID = (id) => {setEventDetailID(id)}

    return (
        <Box id='events-block' sx={{
            zIndex: 1, 
            position: 'absolute', 
            right: "1rem", 
            bottom: '1.5rem',
            minWidth: '250px',
        }}
        elevation={3}
        >
            <Paper 
                sx={{ 
                    height: '85vh',
                    width: '20vw',
                    minWidth: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    p: 2,
                }}
            >
                <Typography variant='h5'>{location?location.name: "Nearby events"}</Typography>
                { location &&
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant='subtitle1' sx={{textTransform: 'capitalize', color: 'text.secondary'}}>{location.type.replace("_", " ") || ""}</Typography>
                        </Box>
                        <Fab 
                            color='primary' 
                            sx={{position: 'absolute', bottom: '1.5rem', right: '1rem'}}
                            onClick = {handleEventOpen}
                        >
                            <AddIcon />
                        </Fab>
                    </Box>
                }
                <Divider />
                    <Box sx={{height: '100%', overflow: 'auto'}}>
                        <List>
                            {
                                currentEvents && currentEvents.length ? currentEvents.map(event => {
                                    return (
                                        <ListItem 
                                            key={event.id} 
                                            sx={{display: 'flex', justifyContent: 'end', padding: '0.1rem'}}
                                            secondaryAction={
                                                <IconButton 
                                                sx ={{size: 'small'}}
                                                onClick={() => {
                                                    setUserCoords({longitude: event.location.lon, latitude: event.location.lat})
                                                }}
                                            > <RoomIcon/> </IconButton>     
                                            }
                                        >
                                            <ListItemButton sx={{flexGrow: 40, textAlign:'left'}}
                                                onClick={() => {
                                                    passEventID(event.id);
                                                    handleEventDetailModalOpen();
                                                }}>
                                                {/* <ListItemText
                                                    primary={event.name}
                                                    secondary={event.description}
                                                /> */}
                                                <Box>
                                                    <Typography variant="body1">{event.name}</Typography>
                                                    <Typography variant="caption">{moment(event.start_time).fromNow()}</Typography>
                                                </Box>
                                            </ListItemButton>
                                        </ListItem>
                                        )
                                    })
                                    :
                                    location && (
                                        <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center', mt: 2, mx: 2}}>Click "Add Event" to create a new event here!</Typography>
                                    )
                            }
                        </List>
                    </Box>
            </Paper>
            <EventDetailModal
                openEventDetailModal={openEventDetailModal}
                handleEventDetailModalClose={handleEventDetailModalClose}
                eventDetailID={eventDetailID}
            />
        </Box>
    )
}

export default EventsBlock;