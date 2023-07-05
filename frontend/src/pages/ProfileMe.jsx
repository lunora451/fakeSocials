import React, { useState, useEffect } from "react";
import {
  Navigate,
  useLoaderData,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import { getUserById, editUserById } from "../network/user_api";
import { IoCalendarOutline } from "react-icons/io5";
import Modal from "react-modal";
import "./styles/profileMe.css";
import Cookies from "js-cookie";
import { editProfileData } from "../utils/editData";
import Post from "../components/Post";
import { postMe, deletePost } from "../network/post_api";
import Poster from "../components/Poster";
import { toFormattedDateWithDay } from "../utils/date";
import { RxCross2 } from "react-icons/rx";
import { TbPhotoPlus } from "react-icons/tb";
import avatar from "../assets/img/avatarDefault.png";
import wallpaper from "../assets/img/wallpaperDefault.jpg";

export async function profileMeLoader() {
  const userId = Cookies.get("idUser");
  const user = await getUserById(userId);
  if (user.picture) {
    Cookies.set("pictureUser", user.picture);
  } else {
    Cookies.set("pictureUser", null);
  }
  return { user };
}

const ProfileMe = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [userNamePicture, setUserNamePicture] = useOutletContext();

  const [userUpdated, setUserUpdated] = useState(user);
  const [dataEditProfil, setDataEditProfil] = useState(editProfileData);
  const [pictureModal, setPictureModal] = useState(null);
  const [wallpaperModal, setWallpaperModal] = useState(null);

  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = "white";
    document.getElementById("root").style.background = "none";
  }, []);

  function openModalEdit(e) {
    e.stopPropagation();
    setShowModalEdit(true);
  }

  function closeModalEdit(e) {
    e.stopPropagation();
    setShowModalEdit(false);
    setPictureModal(null);
    setWallpaperModal(null);
  }

  const goToFollowing = () => {
    navigate(`/Home/WallFollowing/${userUpdated._id}`);
  };
  const goToFollower = () => {
    navigate(`/Home/WallFollower/${userUpdated._id}`);
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

  useEffect(() => {}, [listPost]);

  const handlePost = async (textPost, picturePoster) => {
    const formDataPost = new FormData();

    formDataPost.append("author", userUpdated._id);
    if (textPost != "") {
      formDataPost.append("message", textPost);
    }
    if (picturePoster) {
      formDataPost.append("picture", picturePoster);
    }

    const post = await postMe(formDataPost);

    setListPost([post, ...listPost]);
  };

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();
    const postIdDelete = await deletePost(postId);

    setListPost((prevListPost) => {
      const filteredList = prevListPost.filter((post) => {
        if (post._id === postIdDelete) {
          return false;
        }
        if (post.isCommentOf && post.isCommentOf[0] === postIdDelete) {
          return false;
        }
        return true;
      });

      return filteredList.map((post) => {
        if (post.comments && post.comments.includes(postIdDelete)) {
          post.comments = post.comments.filter(
            (commentId) => commentId !== postIdDelete
          );
        }
        return post;
      });
    });
  };

  const handleCommentProfile = (comment) => {
    if (comment.isCommentOf && comment.isCommentOf.length > 0) {
      const updatedList = listPost.map((existingPost) => {
        if (comment.isCommentOf.includes(existingPost._id)) {
          existingPost.comments.push(comment._id);
        }
        return existingPost;
      });
      setListPost([comment, ...updatedList]);
    } else {
      setListPost([comment, ...listPost]);
    }
  };

  const handlePhotoAvatarChange = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];

    if (!(file === typeof undefined)) {
      if (name === "picture") {
        setPictureModal(URL.createObjectURL(file));
      }
      if (name === "wallpaper") {
        setWallpaperModal(URL.createObjectURL(file));
      }
    }

    setDataEditProfil((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };

  const handleEditProfilData = (e) => {
    const { name, value } = e.target;
    setDataEditProfil((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const editProfileAction = async () => {
    setDataEditProfil((prevState) => ({
      ...prevState,
      author: userUpdated._id,
    }));

    const formData = new FormData();

    formData.append("author", userUpdated._id);
    if (dataEditProfil.pseudo) {
      formData.append("pseudo", dataEditProfil.pseudo);
    }
    if (dataEditProfil.bio) {
      formData.append("bio", dataEditProfil.bio);
    }
    if (dataEditProfil.picture) {
      formData.append("picture", dataEditProfil.picture);
    }
    if (dataEditProfil.wallpaper) {
      formData.append("wallpaper", dataEditProfil.wallpaper);
    }

    const userEdited = await editUserById(formData);

    if (userEdited.picture) {
      Cookies.set("pictureUser", user.picture);
    }

    setUserUpdated(userEdited);

    setUserNamePicture((prevState) => ({
      ...prevState,
      pseudo: userEdited.pseudo,
      picture: userEdited.picture,
    }));
    setShowModalEdit(false);
  };

  return (
    <>
      <div className="profileMe">
        <div className="topProfileMe">
          <p className="nameUserMe">{userUpdated.pseudo}</p>
          <p className="countPostMe">{listPost.length} posts</p>
        </div>
        <div className="headerProfileMe">
          <img
            src={userUpdated.wallpaper ? `${userUpdated.wallpaper}` : wallpaper}
            alt="wallpaper_profile"
            className="bannerUserMe"
          />

          <img
            src={
              userUpdated.picture
                ? `${process.env.REACT_APP_BACKEND_URL}${userUpdated.picture}`
                : avatar
            }
            alt="avatar_profile"
            className="avatarMe"
          />

          <Modal
            isOpen={showModalEdit}
            onRequestClose={closeModalEdit}
            className="editProfileModal"
          >
            <div className="topBannerEditProfilMe">
              <div className="hoverEffectCancelEdit">
                <RxCross2
                  className="crossCancelEdit"
                  onClick={(e) => closeModalEdit(e)}
                />
              </div>
              <p>Edit Profile</p>
              <button className="saveEditProfile" onClick={editProfileAction}>
                Save
              </button>
            </div>
            <label htmlFor="wallpaperProfil" className="labelFileWallpaper">
              <TbPhotoPlus className="iconChangeWallpaper" />
              <label />
              <input
                id="wallpaperProfil"
                type="file"
                accept="image/jpeg, image/gif, image/png, image/webp"
                name="wallpaper"
                onChange={handlePhotoAvatarChange}
              />
            </label>
            <img
              src={
                wallpaperModal || userUpdated.wallpaper
                  ? wallpaperModal ||
                    `${process.env.REACT_APP_BACKEND_URL}${userUpdated.wallpaper}`
                  : wallpaper
              }
              alt="wallpaper_profile"
              className="bannerUserEditProfileMe"
            />
            <label htmlFor="photoProfil" className="labelFileAvatar">
              <TbPhotoPlus className="iconChangeAvatar" />
            </label>
            <input
              id="photoProfil"
              type="file"
              accept="image/jpeg, image/gif, image/png, image/webp"
              name="picture"
              onChange={handlePhotoAvatarChange}
            />
            <img
              src={
                pictureModal || userUpdated.picture
                  ? pictureModal ||
                    `${process.env.REACT_APP_BACKEND_URL}${userUpdated.picture}`
                  : avatar
              }
              alt="avatar_profile"
              className="avatarEditProfileMe"
            />
            <form className="formEditProfil">
              <label htmlFor="editUsernameProfile">Username</label>
              <input
                type="text"
                name="pseudo"
                id="editUsernameProfile"
                defaultValue={userUpdated.pseudo}
                minLength={3}
                maxLength={55}
                onChange={handleEditProfilData}
              />

              <label htmlFor="editBioProfile">Bio</label>
              <textarea
                name="bio"
                id="editBioProfile"
                rows="6"
                maxLength={1024}
                defaultValue={userUpdated.bio}
                onChange={handleEditProfilData}
              />
            </form>
          </Modal>
          <button className="editProfileMe" onClick={(e) => openModalEdit(e)}>
            Edit Profile
          </button>
          <p className="nameUserMe ml16">{userUpdated.pseudo}</p>
          <div className="joinDateContainerMe ml16">
            <IoCalendarOutline />
            <p>{`joined the ${toFormattedDateWithDay(
              userUpdated.createdAt
            )}`}</p>
          </div>
          <p className="biographieMe ml16">{userUpdated.bio}</p>
          <div className="followDivMe ml16">
            <div
              className="flex followingMe"
              onClick={userUpdated.followers.length > 0 ? goToFollowing : null}
            >
              <p className="boldB">{userUpdated.following.length}</p>
              <p>Following</p>
            </div>
            <div
              className="flex followerMe"
              onClick={userUpdated.followers.length > 0 ? goToFollower : null}
            >
              <p className="boldB">{userUpdated.followers.length}</p>
              <p>Followers</p>
            </div>
          </div>
        </div>
        <Poster user={userUpdated} handlePost={handlePost} />
        <div className="postUserMe">
          <ul className="listPostMe">
            {listPost.map((post) => {
              return (
                <li key={post._id}>
                  <Post
                    userNamePicture={userNamePicture}
                    post={post}
                    handleDeletePost={handleDeletePost}
                    handleCommentProfile={handleCommentProfile}
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

export default ProfileMe;
