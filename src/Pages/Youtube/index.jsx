import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useMemo, useRef } from "react";
import queryString from "query-string";
import ReactYoutube from "react-youtube";
import httpServices from "../../Services/httpServices";
import { YOUTUBE_API } from "../../Constants";

const Youtube = () => {
  //! State
  const [youtubeLink, setYoutubeLink] = React.useState("");

  const validSource = useMemo(() => {
    try {
      const params = youtubeLink.split("?")[1];
      const parsed = queryString.parse(params);
      const videoId = parsed.v;

      return videoId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [youtubeLink]);

  const debounceRef = useRef(null);

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
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setYoutubeLink(e.target.value);
    }, 300);
  };

  const handleSubmit = async () => {
    try {
      const formdata = new FormData();
      formdata.append("youtube_link", youtubeLink);

      const response = await httpServices.post(YOUTUBE_API, formdata);
      console.log("response", response);
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
      <Box sx={{ display: "flex", gap: "10px" }}>
        <TextField
          onChange={handleChange}
          label="Youtube link"
          placeholder="https://www.youtube.com/watch?v=7nigXQS1Xb0&list=RDiIEjiBu1uQk&index=6&ab_channel=TAEYEON-Topic"
          variant="outlined"
          sx={{ width: "700px" }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
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
        {validSource ? (
          <ReactYoutube videoId={validSource} opts={opts} />
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
};

export default Youtube;
