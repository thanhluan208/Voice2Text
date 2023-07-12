import DefaultLayout from "../Components/DefaultLayout";

export const appRoutes = [
  {
    path: "*",
    element: <DefaultLayout />,
  },
];

export const Bars = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
];

export const cachedKeys = {
  SHOW_PLAYBACK: "SHOW_PLAYBACK",
  AUDIO_SOURCE: "AUDIO_SOURCE",
};

export const API_URL = "http://localhost:5000";
export const RECORD_API = `${API_URL}/record`;
export const UPLOAD_API = `${API_URL}/upload`;
export const YOUTUBE_API = `${API_URL}/youtube`;
