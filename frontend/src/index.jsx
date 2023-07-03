import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Login, loginAction } from "./pages/Login";
import Register, { registerAction } from "./pages/Register";
import Home, { homeLoader } from "./pages/Home";
import WallPost, { wallPostLoader } from "./pages/WallPost";
import WallFollower, { wallFollowerLoader } from "./pages/WallFollower";
import WallFollowing, { wallFollowingLoader } from "./pages/WallFollowing";
import WallLikes, { wallLikesLoader } from "./pages/WallLikes";
import ProfileMe, { profileMeLoader } from "./pages/ProfileMe";
import ProfileOther, { profileOtherLoader } from "./pages/ProfileOther";
import PostDetail, { postDetailLoader } from "./pages/PostDetail.jsx";
import ErrorPage from "./errorPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    action: loginAction,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Home",
    element: <Home />,
    errorElement: <ErrorPage />,
    loader: homeLoader,
    children: [
      {
        path: "Profile/me",
        element: <ProfileMe />,
        loader: profileMeLoader,
      },
      {
        path: "Profile/:userId",
        element: <ProfileOther />,
        loader: profileOtherLoader,
      },
      {
        path: "Posts/:postId",
        element: <PostDetail />,
        loader: postDetailLoader,
      },
      {
        path: "WallPost",
        element: <WallPost />,
        loader: wallPostLoader,
      },
      {
        path: "WallFollower/:userId",
        element: <WallFollower />,
        loader: wallFollowerLoader,
      },
      {
        path: "WallFollowing/:userId",
        element: <WallFollowing />,
        loader: wallFollowingLoader,
      },
      {
        path: "WallLikes/:userId",
        element: <WallLikes />,
        loader: wallLikesLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
