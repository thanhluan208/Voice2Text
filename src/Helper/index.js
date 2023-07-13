export const formatMS = (ms) => {
  const totalSeconds = Math.floor(ms / 1000); // Convert milliseconds to seconds
  const minutes = Math.floor(totalSeconds / 60); // Calculate the minutes
  const seconds = totalSeconds % 60; // Calculate the remaining seconds

  // Format the minutes and seconds with leading zeros if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const parseYoutubeTranscript = (data) => {
  const lines = data.split("\n");
  console.log(lines);

  const parsedLines = lines.map((line) => {
    const [time, text] = line.split("]");
    const nextTime = time.replace("[", "");

    return {
      time: Number(nextTime),
      text: text.trim(),
    };
  });

  return parsedLines
};
