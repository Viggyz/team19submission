import React from 'react';

import {IconButton, Box, Paper, Divider, Typography, List, ListItem, ListItemText, Button} from '@mui/material';
import {AddCircleOutlined, AddOutlined} from "@mui/icons-material"

import { Events } from "../api.service";

function EventsBlock({location, currentEvents, handleEventOpen, openAuthModal, isUserLoggedIn}) {
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
                    padding: '1rem', 
                    width: '20vw',
                    minWidth: '250px',
                }}
            >
                {
                    location &&
                    <Box sx={{height: '100%', width: '100%'}}>
                        <Typography variant='h5'>{location.name}</Typography>
                        <Typography variant='subtitle1' sx={{textTransform: 'capitalize', color: 'text.secondary'}}>{location.type.replace("_", " ") || ""}</Typography>
                        <Button 
                            sx = {{backgroundColor: 'transparent', variant: 'outlined'}}
                            onClick = {handleEventOpen}
                        >  
                            <AddOutlined/> Add Event 
                        </Button>
                        <Divider />
                        <List>
                            {
                                currentEvents && currentEvents.map(event => {
                                    return (
                                        <ListItem key={event.id}>
                                            <ListItemText
                                                primary={event.name}
                                                secondary={event.description}
                                            />
                                            <IconButton 
                                                sx ={{size: 'small'}}
                                                onClick={() => {
                                                    Events.addIntrest(event.id)
                                                    .then(()=>{
                                                        setsnackbarState({open: true, message: "Successfully Showed interest", severity: "success"})
                                                    })
                                                    .catch(()=>{setsnackbarState({open: true, message: "Already Showed interest", severity: "error"})})
                                                }}
                                            > <AddCircleOutlined/> </IconButton>                                            
                                        </ListItem>
                                        )
                                    })
                            }
                        </List>
                    </Box>
                }
            </Paper>
        </Box>
    )
}

export default EventsBlock;