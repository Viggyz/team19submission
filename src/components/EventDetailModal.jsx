import { useState, useEffect } from 'react';


import moment from 'moment/moment';
import {
  Modal, 
  Paper,
  Typography,
  IconButton,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import { FavoriteBorder, Favorite, PhoneIphone, Email } from '@mui/icons-material';

import { Events, User } from '../api.service';

function EventDetailModal({
        openEventDetailModal,
        handleEventDetailModalClose, 
        eventDetailID, 
        isUserLoggedIn,
        handleAuthOpen,
    }) {

    const [eventDetails, setEventDetails] = useState({
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

    const [interest, setInterest] = useState(false);

    useEffect(() => {
        if(openEventDetailModal) {
            let promises = [Events.get(eventDetailID), User.get()];
            Promise.allSettled(promises)
            .then(([eventPromise, userPromise]) =>  {
                if (eventPromise.status === "fulfilled") {
                    setEventDetails(eventPromise.value.data);
                }
                else {
                    Promise.reject("Failed to get event");
                }
                if (userPromise.status === "fulfilled") {
                    if(eventPromise.value.data.interested.some(acc => acc.id === userPromise.value.data.id))
                        setInterest(true);
                    else {
                        setInterest(false);
                    }
                }
                else if(userPromise.status === "rejected") {
                    setInterest(false);
                }
            })
            .catch(err => {
                console.log(err);
                handleEventDetailModalClose();
            })
        }
    }, [openEventDetailModal])

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
                padding: '2rem',
            }}
            >
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography variant='h3'>{eventDetails.name}</Typography>
                    <IconButton 
                        onClick={() => {
                            if (!isUserLoggedIn) {
                                handleAuthOpen();
                            }
                            else if (interest) {
                                Events.removeIntrest(eventDetailID)
                                .then(() => setInterest(false))
                                .catch(err => console.log(err));
                            }
                            else {
                                Events.addIntrest(eventDetailID)
                                .then(() => setInterest(true))
                                .catch(err => console.log(err));
                            }
                        }}
                    >
                            {(interest && isUserLoggedIn) ? <Favorite/> : <FavoriteBorder/>}
                    </IconButton>
            </div>

                <Typography>{moment(eventDetails.start_time).format("Mo MMM hh:mm A")} - {moment(eventDetails.end_time).format("Mo MMM hh:mm A")}</Typography>
                    <Typography variant='body1'>Created By: {eventDetails.created_by.username}</Typography>
                <Chip variant='filled' color='info' label={`${eventDetails.max_people} People`}
                sx={{mx:'0.5rem'}}/>
                <Divider sx={{my:'1em'}} />

                <Typography variant='body1'>  {eventDetails.description} </Typography>
                <Divider sx={{my:'1em'}} />
                <Box sx={{
                    display: 'flex',
                    width: "100%",
                    justifyContent: 'space-around',
                    flexDirection: {xs: 'column', md: 'row'}
                }}>
                <Box sx={{display: 'flex', justifyContent: 'between', alignItems: 'center', color: 'text.secondary'}}>
                    <PhoneIphone sx={{mr: 1}} />
                    <Typography variant="subtitle1">+91 {eventDetails.created_by.contact_no}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'between', alignItems: 'center', color: 'text.secondary'}}>
                    <Email sx={{mr: 1}} />
                    <Typography variant="subtitle1">{eventDetails.created_by.email}</Typography>
                </Box>
                </Box>
            </Paper>
        </Modal>
    )
}

export default EventDetailModal;