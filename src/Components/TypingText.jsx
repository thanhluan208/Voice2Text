import React, { useEffect, useMemo, useRef, useState } from "react";


const TEXT =
  "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const TypingText = ({ text = TEXT }) => {
  //! State
  const [content, setContent] = useState("");
  const tempContent = useRef("");

  const baseContent = useMemo(() => {
    return text;
  }, [text]);

  //! Function
  useEffect(() => {
    const interval = setInterval(() => {
      tempContent.current =
        tempContent.current + baseContent[tempContent.current.length];
      setContent(tempContent.current);

      if (tempContent.current === baseContent) {
        clearInterval(interval);
      }
    }, 20);
  }, [baseContent]);

  //! Render
  return (
    <p style={{whiteSpace: 'pre-line'}}>
      {content}
      {tempContent.current !== baseContent && (
        <span
          sx={{
            marginLeft: "10px",
            animation: "$blink .5s linear infinite",
            "@keyframes blink": {
              "0%": {
                opacity: 0,
              },
              "50%": {
                opacity: 1,
              },
              "100%": {
                opacity: 0,
              },
            },
          }}
        >
          _
        </span>
      )}
    </p>
  );
};

TypingText.propTypes = {
  // key is the name of the prop and
  // value is the PropType
  // Luan dep trai
};
export default TypingText;
