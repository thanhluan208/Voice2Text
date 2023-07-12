import { Box } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";

const Bar = ({ index, start }) => {
  //! State
  const [height, setHeight] = useState(2);
  const recordInterval = useRef(null);

  const max = useMemo(() => {
    if (index % 7 === 1 || index % 7 === 0) {
      return Math.floor(Math.random() * 10 + 5);
    } else if (index % 7 === 2 || index % 7 === 6) {
      return Math.floor(Math.random() * 40 + 20);
    } else if (index % 7 === 3 || index % 7 === 5) {
      return Math.floor(Math.random() * 70 + 35);
    } else if (index % 7 === 4) {
      return Math.floor(Math.random() * 90 + 50);
    }
  }, [index]);

  const interval = useMemo(() => {
    return index < 20 && index > 50
      ? Math.floor(Math.random() * 500 + 400)
      : Math.floor(Math.random() * 400 + 300);
  }, [index]);

  //! Function

  //! Render
  useEffect(() => {
    if (start) {
      recordInterval.current = setInterval(() => {
        setHeight((prev) => {
          if (prev === max) {
            return Math.floor(Math.random() * 10 + 2);
          } else {
            return max;
          }
        });
      }, interval);
    } else {
        setHeight(2);
        clearInterval(recordInterval.current);
    }
  }, [start, index, max, interval]);

  return (
    <Box
      sx={{
        width: "5px",
        height: `${height}px`,
        borderRadius: "8px",
        backgroundColor: "#000",
        transition: `all ${interval / 1000}s ease`,
      }}
    />
  );
};

export default Bar;
