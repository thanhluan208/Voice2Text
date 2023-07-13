import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useMemo, useRef, useState } from "react";
import queryString from "query-string";
import ReactYoutube from "react-youtube";
import httpServices from "../../Services/httpServices";
import { YOUTUBE_API } from "../../Constants";
import { resposne } from "./mockdata";
import { parseYoutubeTranscript } from "../../Helper";

const Youtube = () => {
  //! State
  const [youtubeLink, setYoutubeLink] = React.useState("");
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [countTime, setCountTime] = useState(0);
  const [transcript, setTranscript] = useState(null);

  const lastTranscript = useRef(null);

  const currentTranscript = useMemo(() => {
    if (!transcript) return null;

    const foundTranscript = transcript.find((item) => {
      return item.time === Math.floor(countTime) && item.time !== 0;
    });

    if (!foundTranscript) return lastTranscript.current;

    lastTranscript.current = foundTranscript.text;
    return foundTranscript.text;
  }, [transcript, countTime]);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

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

  const opts = useMemo(() => {
    const width = window.innerWidth - 170 < 900 ? window.innerWidth - 170 : 900;
    const height = (width * 9) / 16;

    return {
      height,
      width,
    };
  }, []);

  //! Function

  const handleSubmit = async () => {
    try {
      const youtubeLink = inputRef.current.value;
      setYoutubeLink(youtubeLink);

      await new Promise((res) => setTimeout(res, 5000))

      const formdata = new FormData();
      formdata.append("youtube_link", youtubeLink);

      const response = await httpServices.post(YOUTUBE_API, formdata);
      console.log("response", response);

      setTranscript(parseYoutubeTranscript(resposne.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = (event) => {
    setCountTime(event.target.getCurrentTime());
    timerRef.current = setInterval(() => {
      setCountTime((prev) => prev + 1);
    }, 1000);
  };

  const handlePause = (event) => {
    setCountTime(event.target.getCurrentTime());
    clearInterval(timerRef.current);
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
          label="Youtube link"
          placeholder="https://www.youtube.com/watch?v=7nigXQS1Xb0&list=RDiIEjiBu1uQk&index=6&ab_channel=TAEYEON-Topic"
          variant="outlined"
          inputRef={inputRef}
          sx={{ width: "700px" }}
        />
        <Button
          variant="contained"
          sx={{
            background: "#000",
            padding: "6px 30px",
            "&:hover": {
              background: "#000",
            },
          }}
          onClick={handleSubmit}
        >
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
          <Fragment>
            <Box sx={{ position: "relative" }}>
              <ReactYoutube
                videoId={validSource}
                opts={opts}
                onReady={() => {
                  setLoadingVideo(false);
                }}
                onPlay={handlePlay}
                onPause={handlePause}
              />
              {transcript && !loadingVideo && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: "60px",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  {currentTranscript || 'transcriping...'}
                </Box>
              )}
            </Box>
            {loadingVideo ? (
              <Box>
                <CircularProgress />
              </Box>
            ) : (
              <Box></Box>
            )}
          </Fragment>
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
};

export default Youtube;
