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

import { Events } from '../api.service';

function EventDetailModal({openEventDetailModal, handleEventDetailModalClose, eventDetailID}) {

    

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
                <Typography variant='h2'></Typography>
            </Paper>
        </Modal>
    )
}

export default EventDetailModal;