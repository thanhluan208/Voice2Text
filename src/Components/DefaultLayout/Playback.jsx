import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CommonIcons from "../../Assets/Icons";
import SRC from "./source.mp3";
import { formatMS } from "../../Helper";
import moment from "moment";
import { useGet, useSave } from "../../Stores/cachedStore";
import { cachedKeys } from "../../Constants";

const Playback = () => {
  //! State
  const [start, setStart] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const save = useSave();

  const source = useGet(cachedKeys.AUDIO_SOURCE);


  const audioRef = useRef();

  //! Function
  const handleStart = () => {
    setStart(true);
    audioRef.current.play();
  };

  const handlePause = () => {
    setStart(false);
    audioRef.current.pause();
  };

  const handleClosePlayback = () => {
    save(cachedKeys.SHOW_PLAYBACK, false);
  };

  useEffect(() => {
    //* Update input value due to audio progress
    const updateProgress = () => {
      if (audioRef.current.currentTime === audioRef.current.duration) {
        setStart(false);
        audioRef.current.currentTime = 0;
      }
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
  }, []);

  const handleMouseMove = (e) => {
    setTooltip({
      bottom: e.nativeEvent.offsetY,
      left: e.nativeEvent.offsetX,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  const handleClickProgress = () => {
    const newTime =
      (tooltip.left / window.innerWidth) * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress((newTime / audioRef.current.duration) * 100);
    handleStart();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setLoading(false);
        clearInterval(interval);
      }
    }, 200);
  }, []);

  //! Render

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "100px",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeIn 0.5s ease-in-out",

        "@keyframes fadeIn": {
          "0%": {
            opacity: "0",
            transform: "translateY(100px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "65px",
          right: "0",
          height: "40px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleClosePlayback}
      >
        <CommonIcons.Close />
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: `${progress}%`,
          height: "10px",
          background: "#000",
          borderRadius: "8px",
        }}
      />
      {tooltip && (
        <Box
          sx={{
            position: "fixed",
            bottom: `${tooltip.bottom}px`,
            left: `${
              tooltip.left <= window.innerWidth - 60
                ? tooltip.left
                : window.innerWidth - 60
            }px`,
            height: "25px",
            width: "60px",
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formatMS(
            (tooltip.left / window.innerWidth) *
              audioRef.current.duration *
              1000
          )}
        </Box>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: `100%`,
          height: "10px",
          background: "rgba(0,0,0,0.2)",
          cursor: "n-resize",
        }}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onClick={handleClickProgress}
      />

      {loading ? (
        <Box>LOADING...</Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "20% 60% 20%",
            width: "100vw",
            height: "100%",
          }}
        >
          <Box
            sx={{
              padding: "5px 20px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Untitled 1
            </Typography>
            <Typography variant="body1">
              {moment().format("DD/MM/YYYY")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatMS(audioRef.current?.currentTime * 1000)}
              </Typography>
            </Box>
            <Box
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                },
              }}
              onClick={start ? handlePause : handleStart}
            >
              {start ? (
                <CommonIcons.Stop
                  style={{ color: "#fff", height: "40px", width: "40px" }}
                />
              ) : (
                <CommonIcons.Play
                  style={{ color: "#fff", height: "40px", width: "40px" }}
                />
              )}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatMS(audioRef.current?.duration * 1000)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              padding: "15px 20px",
              display: "flex",
              gap: "5px",
              flexDirection: "row",
            }}
          >
            <Box>{!isMute ? <CommonIcons.Volume /> : <CommonIcons.Mute />}</Box>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              defaultValue={50}
              className="volumn"
              style={{ margin: "0", height: 16 }}
              onChange={(e) => {
                if (e.target.value === "0" && !isMute) {
                  setIsMute(true);
                }
                if (e.target.value !== "0" && isMute) {
                  setIsMute(false);
                }
                audioRef.current.volume = e.target.value / 100;
              }}
            />
          </Box>
        </Box>
      )}

      <audio src={source || SRC} ref={audioRef} />
    </Box>
  );
};

export default Playback;
