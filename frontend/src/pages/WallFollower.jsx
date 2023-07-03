import React from "react";
import { useLoaderData } from "react-router-dom";
import { getAllFollowerById } from "../network/user_api";
import User from "../components/User";
import "./styles/wallFollower.css";

export async function wallFollowerLoader({ params }) {
  const listUsers = await getAllFollowerById(params.userId);
  return { listUsers };
}

const WallFollower = () => {
  const listUsers = useLoaderData();

  return (
    <div className="wallFollower">
      <div className="topBannerWallFollower">
        <i>This page show all user who follow you</i>
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

export default WallFollower;
