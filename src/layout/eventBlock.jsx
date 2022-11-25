import {useState} from 'react';

import moment from 'moment';
import {
    IconButton,
    Fab, 
    Box,
    Paper, 
    Divider, 
    Typography, 
    List, 
    ListItem, 
    ListItemButton, 
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import AddIcon from '@mui/icons-material/Add';

import EventDetailModal from '../components/EventDetailModal';

function EventsBlock({
    location,
    setUserCoords,
    currentEvents,
    handleEventOpen,
    handleAuthOpen, 
    isUserLoggedIn
}) {
    const [openEventDetailModal, setOpenEventDetailModal] = useState(false);
    const [eventDetailID, setEventDetailID] = useState(null)

    const handleEventDetailModalOpen = () => setOpenEventDetailModal(true);
    const handleEventDetailModalClose = () => setOpenEventDetailModal(false);
    const passEventID = (id) => {setEventDetailID(id)}

    return (
        <Box id='events-block' sx={{
            zIndex: 1, 
            position: 'absolute', 
            right: {xs: '0', md: "1.5rem"}, 
            bottom: {xs: '0', md: '1.5rem'},
            minWidth: '250px',
            boxSizing: 'border-box'
        }}
        elevation={3}
        >
            <Paper 
                sx={{ 
                    height: {xs: '35vh', md: '85vh'},
                    width: {xs: '100vw', md: '20vw'},
                    minWidth: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    p: {xs: 1, md: 2},
                    boxSizing: 'border-box'
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
                                                <Box>
                                                    <Typography variant="body1">{event.name}</Typography>
                                                    <Typography variant="caption">{moment(event.start_time).fromNow()}</Typography>
                                                </Box>
                                            </ListItemButton>
                                        </ListItem>
                                        )
                                    })
                                    :
                                    location ? 
                                    (
                                        <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center', mt: 2, mx: 2}}>Click "Add Event" to create a new event here!</Typography>
                                    )
                                    : 
                                    (
                                        <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center', mt: 2, mx: 2}}>Click on a location to start adding events</Typography>
                                    )
                            }
                        </List>
                    </Box>
            </Paper>
            <EventDetailModal
                openEventDetailModal={openEventDetailModal}
                handleEventDetailModalClose={handleEventDetailModalClose}
                eventDetailID={eventDetailID}
                isUserLoggedIn={isUserLoggedIn}
                handleAuthOpen={handleAuthOpen}
            />
        </Box>
    )
}

export default EventsBlock;