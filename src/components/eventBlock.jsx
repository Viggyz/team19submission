import React from 'react';

import axios from 'axios';
import {Box, Paper, Divider, Typography, List, ListItem, ListItemText} from '@mui/material';

function EventsBlock({location, currentEvents}) {
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
                    marginRight: '1rem',
                }}
            >
                {
                    location &&
                    <Box sx={{height: '100%', width: '100%'}}>
                        <Typography variant='h5'>{location.name}</Typography>
                        <Typography variant='subtitle1'>{location.address.road || ""}</Typography>
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