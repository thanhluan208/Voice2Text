import { Box, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";
import queryString from "query-string";
import ReactYoutube from "react-youtube";

const Youtube = () => {
  //! State
  const [youtubeLink, setYoutubeLink] = React.useState("");

  const opts = useMemo(() => {
    const width = window.innerWidth - 170 < 900 ? window.innerWidth - 170 : 900;
    const height = (width * 9) / 16;

    return {
      height,
      width,
    };
  }, []);

  //! Function
  const handleChange = (e) => {
    try {
      const url = e.target.value;
      const params = url.split("?")[1];
      const parsed = queryString.parse(params);
      const videoId = parsed.v;
      setYoutubeLink(videoId);
    } catch (error) {
      console.log(error);
    }
  };

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        flexDirection: "column",
        padding: "20px 25px",
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
          Transcript youtube video
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
      <Box>
        <TextField
          onChange={handleChange}
          label="Youtube link"
          placeholder="https://www.youtube.com/watch?v=7nigXQS1Xb0&list=RDiIEjiBu1uQk&index=6&ab_channel=TAEYEON-Topic"
          variant="outlined"
          sx={{ width: "700px" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",

          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {youtubeLink ? (
          <ReactYoutube videoId={youtubeLink} opts={opts} />
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
};

export default Youtube;
