import React from 'react';

import {
  Link,
  Modal, 
  Paper,
  Box, 
  TextField, 
  Button, 
  Typography,
} from "@mui/material";

import { Events } from '../api.service';

function MyEventsModal({openMyEventsModal, handleMyEventsClose}) {
  return(
    <Modal
      open={openMyEventsModal}
      onClose={handleMyEventsClose}
    >
        <Box>
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
              
                <Typography>Hello, there!</Typography>
            </Paper>
        </Box>
    </Modal>
  )
}

export default MyEventsModal