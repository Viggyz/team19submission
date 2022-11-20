import {
    Box,
    Paper,
    Button,
    Typography
} from "@mui/material";

function userStatusBar({ isUserLoggedIn, removeTokens, handleAuthOpen }) {
  return (
    <Box
      id="logged-in-bar"
      sx={{ position: "absolute", top: 0, right: "1rem" }}
    >
      {isUserLoggedIn ? (
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1,
          }}
        >
          {/* <Typography>Logged In</Typography> */}
          <Button
            size="small"
            color="error"
            onClick={removeTokens}
          >
            Log out
          </Button>
        </Paper>
      ) : (
        <Button
          variant="contained"
          size="small"
          color="success"
          type="out"
          onClick={() => {
            handleAuthOpen(true);
          }}
        >
          Login
        </Button>
      )}
    </Box>
  );
}

export default userStatusBar;
