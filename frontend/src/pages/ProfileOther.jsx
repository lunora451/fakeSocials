import React, { useState } from "react";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import {
  getOtherUserById,
  followAccount,
  unFollowAccount,
} from "../network/user_api";
import { IoCalendarOutline } from "react-icons/io5";
import "./styles/profileOther.css";
import avatar from "../assets/img/avatarDefault.png";
import wallpaper from "../assets/img/wallpaperDefault.jpg";
import Post from "../components/Post";
import {} from "../network/post_api";
import { toFormattedDateWithDay } from "../utils/date";
import { FaArrowLeft } from "react-icons/fa";

export async function profileOtherLoader({ params }) {
  const objectProfileUser = await getOtherUserById(params.userId);
  return { objectProfileUser };
}

const ProfileOther = () => {
  const navigate = useNavigate();
  const [userNamePicture, setUserNamePicture] = useOutletContext();
  const { objectProfileUser } = useLoaderData();
  const { user, isFollow } = objectProfileUser;
  const [userUpdated, setUserUpdated] = useState(user);
  const [follow, setFollow] = useState(isFollow);

  const goToFollowing = () => {
    navigate(`/Home/WallFollowing/${userUpdated._id}`);
  };
  const goToFollower = () => {
    navigate(`/Home/WallFollower/${userUpdated._id}`);
  };

  const handleFollowButton = async () => {
    if (!follow) {
      //follow
      const newUser = await followAccount(userUpdated._id);

      if (newUser.followers.length > userUpdated.followers.length) {
        setUserUpdated(newUser);
        setFollow(true);
      }
    } else {
      //unfollow
      const newUser = await unFollowAccount(userUpdated._id);

      if (newUser.followers.length < userUpdated.followers.length) {
        setUserUpdated(newUser);
        setFollow(false);
      }
    }
  };

  const concatSortPost = (posts, comments) => {
    // Concatenate the two arrays
    const combinedPosts = posts.concat(comments);

    // Sort the combined array by createdAt in descending order
    const sortedPosts = combinedPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    return sortedPosts;
  };
  const [listPost, setListPost] = useState(
    concatSortPost(user.posts, user.comments)
  );

  return (
    <>
      <div className="profile">
        <div>
          <div
            className="hoverEffectArrow"
            onClick={() => {
              navigate(-1);
            }}
          >
            <FaArrowLeft />
          </div>
          <div className="topProfile">
            <p className="nameUser">{userUpdated.pseudo}</p>
            <p className="countPost">{listPost.length} posts</p>
          </div>
        </div>
        <div className="headerProfile">
          <img
            src={
              userUpdated.wallpaper
                ? `${process.env.REACT_APP_BACKEND_URL}${userUpdated.wallpaper}`
                : wallpaper
            }
            alt="wallpaper_profile"
            className="bannerUser"
          />

          <img
            src={
              userUpdated.picture
                ? `${process.env.REACT_APP_BACKEND_URL}${userUpdated.picture}`
                : avatar
            }
            alt="avatar_profile"
            className="avatar"
          />

          <button
            className={follow ? "following" : "notFollowing"}
            onClick={handleFollowButton}
          >
            {follow ? "" : "Follow"}
          </button>
          <p className="nameUser ml16">{userUpdated.pseudo}</p>
          <div className="joinDateContainer ml16">
            <IoCalendarOutline />
            <p>{`joined the ${toFormattedDateWithDay(
              userUpdated.createdAt
            )}`}</p>
          </div>
          <p className="biographieOther ml16">{userUpdated.bio}</p>
          <div className="followDiv ml16">
            <div
              className="flex followingOther"
              onClick={userUpdated.followers.length > 0 ? goToFollowing : null}
            >
              <p className="boldB">{userUpdated.following.length}</p>
              <p>Following</p>
            </div>
            <div
              className="flex followingOther"
              onClick={userUpdated.followers.length > 0 ? goToFollower : null}
            >
              <p className="boldB">{userUpdated.followers.length}</p>
              <p>Followers</p>
            </div>
          </div>
        </div>
        <div className="postUser">
          <ul className="listPost">
            {listPost.map((post) => {
              return (
                <li key={post._id}>
                  <Post
                    userNamePicture={userNamePicture}
                    post={post}
                    setIfComment={true}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileOther;
