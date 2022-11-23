import React, { useEffect } from 'react';

import moment from 'moment/moment';

import {
  Modal, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  ButtonGroup,
  IconButton,
  ListItemButton,
  Divider,
  Chip,
  Icon
} from "@mui/material";

import { Events, User } from '../api.service';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { flexbox } from '@mui/system';

function EventDetailModal({openEventDetailModal, handleEventDetailModalClose, eventDetailID, isUserLoggedIn}) {

    const [eventDetails, setEventDetails] = React.useState({
        name: "",
        start_time: "",
        end_time: "",
        description: "",
        max_people: 1,
        interested: [],
        current_people: 0,
        created_by: {
            username: "",
            first_name: "",
            last_name: "",
            email: ""
        },
        location: {
            id: 4,
            osm_type_id: "",
            name: "",
            place: "",
            address: {
                name: "",
                country: "",
                country_code: ""
            }
        }
    })

    const [interest, setInterest] = React.useState(eventDetails.interested.some(acc => acc.username === User.get().username))

    useEffect(() => {
        if(openEventDetailModal) {
            Events.get(eventDetailID).then(({data}) => {
                setEventDetails(data);
            })
        }
    }, [openEventDetailModal])

    useEffect(() => {
        if(interest) {
            Events.addIntrest(eventDetailID)
        }
        else {
            Events.removeIntrest(eventDetailID)
        }
    }, [interest])

    

    return(
        <Modal
        open={openEventDetailModal}
        onClose={handleEventDetailModalClose}>
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
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography variant='h3'>{eventDetails.name}</Typography>
                { (isUserLoggedIn) ?
                    <IconButton 
                    onClick={() => {
                        setInterest(!interest);
                    }}>{(interest) ? <Favorite/> : <FavoriteBorder/>}</IconButton>

                    :

                    <div></div>                    
                }
            </div>

                <Typography>{moment(eventDetails.start_time).format("Mo MMM hh:mm A")} - {moment(eventDetails.end_time).format("Mo MMM hh:mm A")}</Typography>
                    <Typography variant='body1'>Created By: {eventDetails.created_by.username}</Typography>

                <Divider sx={{my:'1em'}} />
                <Chip variant='filled' color='info' label={`${eventDetails.current_people} / ${eventDetails.max_people} People`}
                sx={{mb:'1em'}}/>

                <Typography variant='body1'>  {eventDetails.description} </Typography>
                
            </Paper>
        </Modal>
    )
}

export default EventDetailModal;