import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles/header.css";
import { RxHome } from "react-icons/rx";
import { AiOutlineMessage, AiFillHeart } from "react-icons/ai";
import { BsThreeDots, BsPeopleFill } from "react-icons/bs";
import avatar from "../assets/img/avatarDefault.png";
import Cookies from "js-cookie";
import { deleteAccountCall } from "../network/user_api";
import { RiArrowDownSFill } from "react-icons/ri";
import { FaPeopleArrows } from "react-icons/fa";
import { SiLinkedin, SiGithub } from "react-icons/si";

const Header = ({
  handleOptionAccountButtonVisibility,
  showOptionAccount,
  userNamePicture,
}) => {
  const navigate = useNavigate();
  const userId = Cookies.get("idUser");
  const logoutAccount = () => {
    Cookies.remove("jwt");
    navigate("/");
  };

  const deleteAccount = async () => {
    const response = await deleteAccountCall();
    Cookies.remove("jwt");
    navigate("/");
  };

  return (
    <nav className="sidebar">
      <div className="sidebarContent">
        <ul>
          <li className="headerHome optionHeader">
            <NavLink
              to={"/Home/Profile/me"}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <RxHome />
              <p>Home</p>
            </NavLink>
          </li>
          <li className="headerWall optionHeader">
            <NavLink
              to={"/Home/WallPost"}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <AiOutlineMessage />
              <p>Wall Posts</p>
            </NavLink>
          </li>
          <li className="headerFollowers optionHeader">
            <NavLink
              to={`/Home/WallFollower/${userId}`}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <FaPeopleArrows />
              <p>My Followers</p>
            </NavLink>
          </li>
          <li className="headerMyFollowing optionHeader">
            <NavLink
              to={`/Home/WallFollowing/${userId}`}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <BsPeopleFill />
              <p>My Following</p>
            </NavLink>
          </li>
          <li className="headerMyLikes optionHeader">
            <NavLink
              to={`/Home/WallLikes/${userId}`}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <AiFillHeart />
              <p>My Likes</p>
            </NavLink>
          </li>
        </ul>
        <div className="socials">
          <a
            href="https://www.linkedin.com/in/jordan-troussicot-a9a768138/"
            target="_blank"
            rel="noreferrer"
          >
            <SiLinkedin />
          </a>

          <a
            href="https://github.com/lunora451"
            target="_blank"
            rel="noreferrer"
          >
            <SiGithub />
          </a>
        </div>

        <div className="optionAccount">
          <div
            className={
              showOptionAccount ? "showFlex modalOption" : "hide modalOption"
            }
          >
            <div className="logout" onClick={logoutAccount}>
              Logout
            </div>
            <div className="deleteAccount" onClick={deleteAccount}>
              Delete Account
            </div>
          </div>
          <RiArrowDownSFill
            className={
              showOptionAccount ? "showFlex svgArrowBot" : "hide svgArrowBot"
            }
          />
          <button
            type="button"
            className="optionHome"
            onClick={(e) => handleOptionAccountButtonVisibility(e)}
          >
            <img
              src={userNamePicture.picture ? userNamePicture.picture : avatar}
              alt="avatar_profile"
              className="avatarHomeButton"
            />
            <p>{userNamePicture.pseudo}</p>
            <BsThreeDots />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
