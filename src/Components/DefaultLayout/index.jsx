import React, { Suspense } from "react";
import Sidebar from "./SideBar";
import { Box, CircularProgress } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Record from "../../Pages/Record";
import Playback from "./Playback";
import { useGet } from "../../Stores/cachedStore";
import { cachedKeys } from "../../Constants";
import UploadFile from "../../Pages/UploadFiles";
import Youtube from "../../Pages/Youtube";
import Meeting from "../../Pages/Meeting";
import Room from "../../Pages/Room";

const DefaultLayout = (props) => {
  //! State
  const shouldShowPlayback = useGet(cachedKeys.SHOW_PLAYBACK);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          paddingLeft: "120px",
          paddingBottom: shouldShowPlayback ? "100px" : 0,
        }}
      >
        <Suspense
          fallback={
            <Box>
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            <Route path={"transcript-record"} exact element={<Record />} />
            <Route path={"transcript-upload"} exact element={<UploadFile />} />
            <Route path={"transcript-link"} exact element={<Youtube />} />
            <Route path={"transcript-meeting"} exact element={<Meeting />} />
            <Route path={"room/:id"} exact element={<Room />} />
          </Routes>
        </Suspense>
      </Box>

      {shouldShowPlayback && <Playback />}
    </Box>
  );
};

export default DefaultLayout;
