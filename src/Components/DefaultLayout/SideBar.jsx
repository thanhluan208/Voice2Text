import React from "react";
import { Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

import logo from "./logo.png";
import CommonIcons from "../../Assets/Icons";

const tabs = [
  {
    path: "transcript-record",
    title: "Transcript Record",
    icon: (isActive) => (
      <CommonIcons.Recording
        style={{ width: 25, height: 25, color: isActive ? "#fff" : "#000" }}
      />
    ),
  },
  {
    path: "transcript-upload",
    title: "Transcript Upload File",
    icon: (isActive) => (
      <CommonIcons.Video
        style={{ width: 25, height: 25, color: isActive ? "#fff" : "#000" }}
      />
    ),
  },
  {
    path: "transcript-link",
    title: "Transcript Link",
    icon: (isActive) => (
      <CommonIcons.Link
        style={{ width: 25, height: 25, color: isActive ? "#fff" : "#000" }}
      />
    ),
  },
  {
    path: "transcript-meeting",
    title: "Transcript Meeting",
    icon: (isActive) => (
      <CommonIcons.Meeting
        style={{ width: 25, height: 25, color: isActive ? "#fff" : "#000" }}
      />
    ),
  },
];

const MenuTab = ({ path, icon, title }) => {
  //! State
  const navigate = useNavigate();
  const isActive = window.location.pathname.replace("/", "") === path;

  //! Function
  const handleClick = () => {
    navigate(path);
  };

  //! Render
  return (
    <Tooltip title={title}>
      <Box
        sx={{
          width: "100%",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: isActive ? "#1C1C1C" : "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#1C1C1C",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            "& svg": {
              color: "#fff !important",
            },
          },
        }}
        onClick={handleClick}
      >
        {icon(isActive)}
      </Box>
    </Tooltip>
  );
};

const Sidebar = ({ open }) => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: open ? 250 : 100,
        height: "100vh",
        backgroundColor: "#fff",
        padding: "20px 10px",
        display: "flex",
        justifyContent: "start",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100px",
          marginBottom: "40px",
        }}
      >
        <img src={logo} alt="logo" width="100%" />
      </div>

      <Box
        sx={{
          padding: "0 30px",
          gap: "35px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <MenuTab
              icon={tab.icon}
              path={tab.path}
              key={index}
              title={tab.title}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
