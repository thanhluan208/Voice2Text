import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { appRoutes } from "./Constants";

function App() {
  const router = createBrowserRouter(appRoutes);

  return <RouterProvider router={router} />;
}

export default App;
