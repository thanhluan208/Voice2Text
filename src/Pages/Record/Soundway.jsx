import React, { useState } from "react";
import { Bars, RECORD_API, cachedKeys } from "../../Constants";
import { Box, Button, Typography } from "@mui/material";
import Bar from "./Bar";
import CommonIcons from "../../Assets/Icons";
import { formatMS } from "../../Helper";
import TypingText from "../../Components/TypingText";
import { useSave } from "../../Stores/cachedStore";
import { useReactMediaRecorder } from "react-media-recorder";
import httpServices from "../../Services/httpServices";

const Soundway = () => {
  //! State
  const [recording, setRecording] = useState(false);
  const [loading] = useState(false);
  const [time, setTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const save = useSave();
  const { startRecording, stopRecording, pauseRecording } =
    useReactMediaRecorder({
      audio: true,
      video: false,
      echoCancellation: true,
      blobPropertyBag: {
        type: "audio/wav",
      },
      onStop: (blobUrl, blob) => {
        save(cachedKeys.AUDIO_SOURCE, blobUrl);
        save(cachedKeys.SHOW_PLAYBACK, true);

        setTime(0);
        setTranscript(null);

        const file = new File([blob], "audio.wav", {
          type: "audio/wav",
        });

        console.log("asdasd", file);

        const formData = new FormData();
        formData.append("audio", file);

        handleUpload(formData);
      },
    });

  const recordInterval = React.useRef(null);

  //! Function
  const handleStartRecording = () => {
    startRecording();
    setRecording(true);
    recordInterval.current = setInterval(() => {
      setTime((prev) => prev + 1000);
    }, 1000);
  };

  const handleStopRecording = () => {
    pauseRecording();
    setRecording(false);
    clearInterval(recordInterval.current);
  };

  const handleSubmitRecord = async () => {
    stopRecording();
  };

  const handleReset = () => {
    setTime(0);
    save(cachedKeys.SHOW_PLAYBACK, false);
    save(cachedKeys.AUDIO_SOURCE, null);
    setTranscript("");
  };

  const handleUpload = async (payload, onSuccess) => {
    const response = await httpServices.post(RECORD_API, payload);

    const transcript = response.data.reduce((acc, cur) => {
      
      return acc + cur + "\n";
    }, "");

    setTranscript(transcript);
  };

  //! Render
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 20px",
          gap: "5px",
          minHeight: "50vh",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {Bars.map((elm) => {
          return <Bar index={+elm + 1} start={recording} key={elm} />;
        })}
        <Box
          sx={{
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              background: "rgba(0,0,0,0.5)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            },
          }}
          onClick={recording ? handleStopRecording : handleStartRecording}
        >
          {recording ? (
            <CommonIcons.Stop style={{ fontSize: "100px", color: "#fff" }} />
          ) : (
            <CommonIcons.Mic style={{ fontSize: "100px", color: "#fff" }} />
          )}
        </Box>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{formatMS(time)}</Typography>
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "right" }}>
          <Button
            sx={{
              borderRadius: "24px",
              textTransform: "unset",
              borderColor: "#000",
              color: "#000",
              padding: "8px 15px",
              "&:hover": {
                borderColor: "#000",
              },
            }}
            variant="outlined"
            disabled={loading || recording || time === 0}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            sx={{
              borderRadius: "24px",
              textTransform: "unset",
              borderColor: "#000",
              color: "#FFF",
              backgroundColor: "#000",
              padding: "8px 35px",
              "&:hover": {
                backgroundColor: "#000",
              },
            }}
            variant="contained"
            disabled={loading || recording || time === 0}
            onClick={handleSubmitRecord}
          >
            Submit
          </Button>
        </Box>
      </Box>
      {transcript && (
        <Box sx={{ marginTop: "30px" }}>
          <Typography variant="h5"> Transciprt: </Typography>
          <Box sx={{ maxWidth: "700px" }}>
            <TypingText text={transcript} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Soundway;
