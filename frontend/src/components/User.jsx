import React from "react";
import "./styles/user.css";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/img/avatarDefault.png";
import Cookies from "js-cookie";
import { toFormattedDateWithDay } from "../utils/date";

const User = ({ user }) => {
  const navigate = useNavigate();
  const goToProfileUser = (e) => {
    e.stopPropagation();
    if (user._id === Cookies.get("idUser")) {
      navigate(`/Home/Profile/me`);
    } else {
      navigate(`/Home/Profile/${user._id}`);
    }
  };

  return (
    <div className="userDiv" onClick={(e) => goToProfileUser(e)}>
      <img
        src={user.picture ? user.picture : avatar}
        alt="default avatar profil"
        className="avatarUser"
        onClick={(e) => goToProfileUser(e)}
      />
      <div>
        <p className="usernameUser" onClick={(e) => goToProfileUser(e)}>
          {user.pseudo}
        </p>
        <p className="dateUser">
          Join since {toFormattedDateWithDay(user.createdAt)}
        </p>
      </div>
      <p className="followerUser">{user.followers.length} Followers</p>
    </div>
  );
};

export default User;
