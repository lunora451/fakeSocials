import React from "react";
import { useLoaderData } from "react-router-dom";
import { getAllFollowingById } from "../network/user_api";
import User from "../components/User";
import "./styles/wallFollowing.css";

export async function wallFollowingLoader({ params }) {
  const listUsers = await getAllFollowingById(params.userId);
  return { listUsers };
}

const WallFollowing = () => {
  const listUsers = useLoaderData();

  return (
    <div className="wallFollowing">
      <div className="topBannerWallFollowing">
        <i>This page show all user you follow</i>
      </div>
      <span className="borderLine" />
      <ul>
        {listUsers.listUsers.map((user) => {
          return (
            <li key={user._id}>
              <User user={user} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WallFollowing;
