import { Box, Typography } from "@mui/material";
import React from "react";
import { useDropzone } from "react-dropzone";
import CommonIcons from "../../Assets/Icons";
import { useSave } from "../../Stores/cachedStore";
import { cachedKeys } from "../../Constants";

const UploadFile = () => {
  const save = useSave();

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      multiple: false,
      onDragEnter: () => {
        document.getElementById("dropzone").classList.add("dropping");
      },
      onDragLeave: () => {
        document.getElementById("dropzone").classList.remove("dropping");
      },
      onDropAccepted: (files) => {
        const source = URL.createObjectURL(files[0]);
        save(cachedKeys.AUDIO_SOURCE, source);
        save(cachedKeys.SHOW_PLAYBACK, true);
        document.getElementById("dropzone").classList.remove("dropping");
      },
      onDropRejected: (files) => {
        console.log("file", files);
      },
    });

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
          Transcript upload file
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

      <Box {...getRootProps({ className: "dropzone", id: "dropzone" })}>
        <input {...getInputProps()} />
        <CommonIcons.Upload style={{ width: "100px", height: "100px" }} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.mp3 and *.wav audios will be accepted)</em>
      </Box>
    </Box>
  );
};

export default UploadFile;
