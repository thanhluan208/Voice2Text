import React from "react";
import Soundway from "./Soundway";
import { Box, Typography } from "@mui/material";

const Record = () => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "calc(100% - 120px)",
          height: "100px",
          padding: "0 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" style={{ fontWeight: "700" }}>
          Transcript Record
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            "&:hover": {
              "& svg": {
                color: "#1C1C1C",
              },
            },
          }}
        >
          <Typography variant="body1">Back</Typography>
        </Box>
      </Box>

      <Soundway />
    </Box>
  );
};

export default Record;
