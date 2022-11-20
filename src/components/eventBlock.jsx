import React from 'react';

import {IconButton, Box, Paper, Divider, Typography, List, ListItem, ListItemText, Button} from '@mui/material';
import {AddCircleOutlined, AddOutlined} from "@mui/icons-material"

import { Event } from "../utils";

let event_objs = [
    {
        "id": 1,
        "name": "Juniors League",
        "start_time": "2022-11-24T17:57:32.281000Z",
        "end_time": "2022-11-24T19:57:32.281000Z",
        "description": "Chess tournament",
        "max_people": 5,
        "current_people": 0
    },
    {
        "id": 3,
        "name": "Juniors League 3",
        "start_time": "2022-11-24T17:57:32.281000Z",
        "end_time": "2022-11-24T19:57:32.281000Z",
        "description": "Cards tournament",
        "max_people": 6,
        "current_people": 0
    },
    {
        "id": 4,
        "name": "Champions League",
        "start_time": "2022-11-27T17:57:32.281000Z",
        "end_time": "2022-11-29T19:57:32.281000Z",
        "description": "Football tournament",
        "max_people": 4,
        "current_people": 0
    }
]

function EventsBlock({location, currentEvents, handleEventOpen}) {
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
                        <Button sx = {{backgroundColor: 'transparent', variant: 'outlined'}}
                        onClick = {handleEventOpen}>  
                        <AddOutlined/> Add Event </Button>
                        <Typography variant='subtitle1'>{location.address.road || ""}</Typography>
                        <Divider />
                        <List>
                            {
                                event_objs.map(event => {
                                    return (
                                        <ListItem key={event.id}>
                                            <ListItemText
                                                primary={event.name}
                                                secondary={event.description}
                                            />
                                            <IconButton 
                                                sx ={{size: 'small'}}
                                                onClick={() => {
                                                    Event.showIntrest()
                                                    .then()
                                                    .catch()
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