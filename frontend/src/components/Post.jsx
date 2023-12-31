import React, { useState } from "react";
import avatar from "../assets/img/avatarDefault.png";
import Modal from "react-modal";
import { BsTrash } from "react-icons/bs";
import { BiMessageRounded } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toFormattedDateWithHours } from "../utils/date";
import { likePost, unLikePost, postComment } from "../network/post_api";
import { useNavigate } from "react-router-dom";
import ModalReply from "../components/ModalReply";
import Cookies from "js-cookie";
import "./styles/post.css";
import { convertToBase64 } from "../utils/base64";

const Post = ({
  post,
  userNamePicture,
  setListComment,
  handleDeletePost,
  postDetail,
  handleCommentProfile,
  setIfComment,
}) => {
  const userId = Cookies.get("idUser");
  const navigate = useNavigate();
  const [updatedPost, setUpdatedPost] = useState(post);

  const initialLikeByMe = updatedPost.likes.includes(userId);
  const [likeByMe, setLikeByMe] = useState(initialLikeByMe);

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalReply, setShowModalReply] = useState(false);

  function openModalDelete(e) {
    e.stopPropagation();
    setShowModalDelete(true);
  }

  function closeModalDelete(e) {
    e.stopPropagation();
    setShowModalDelete(false);
  }

  function openModalReply(e) {
    e.stopPropagation();
    setShowModalReply(true);
  }

  function closeModalReply(e) {
    e.stopPropagation();
    setShowModalReply(false);
  }

  const isUserPost =
    Cookies.get("idUser") === updatedPost.author._id ? true : false;

  const isCommentFunction = () => {
    if (setIfComment && updatedPost.isCommentOf.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const [isComment, setIsComment] = useState(isCommentFunction);

  const goToProfileUser = (e) => {
    e.stopPropagation();
    if (isUserPost) {
      navigate(`/Home/Profile/me`);
    } else {
      navigate(`/Home/Profile/${updatedPost.author._id}`);
    }
  };

  const handleLikeButton = async (e) => {
    e.stopPropagation();
    if (likeByMe) {
      const newPost = await unLikePost(updatedPost._id);
      setUpdatedPost(newPost);
      setLikeByMe(false);
    } else {
      const newPost = await likePost(updatedPost._id);
      setUpdatedPost(newPost);
      setLikeByMe(true);
    }
  };

  const handleClickPost = (e) => {
    const listSearch = [
      "post",
      "rightPost",
      "upperPost",
      "contentPost",
      "likeReplyDiv",
      "nameDateDiv",
      "datePost",
    ];

    const classList = e.target.classList.value.split(" ");
    const includesAny = listSearch.some((item) => classList.includes(item));

    if (includesAny) {
      navigate(`/Home/Posts/${updatedPost._id}`);
    }
  };

  const handleComment = async (e, objectComment) => {
    e.stopPropagation();

    const objectCommentDB = {
      author: userId,
      postId: objectComment.postId,
      isCommentOf: objectComment.postId,
      message: objectComment.textPost ? objectComment.textPost : null,
      picture: objectComment.picture
        ? await convertToBase64(objectComment.picture)
        : null,
    };

    const comment = await postComment(objectCommentDB);

    if (postDetail) {
      if (setListComment && postDetail._id === objectComment.postId) {
        setListComment((prevListComment) => [comment, ...prevListComment]);
      }
    }

    if (handleCommentProfile) {
      handleCommentProfile(comment);
    }

    setUpdatedPost((prevPostData) => ({
      ...prevPostData,
      comments: [comment._id, ...prevPostData.comments],
    }));

    setShowModalReply(false);
  };

  return (
    <div className="post" onClick={(e) => handleClickPost(e)}>
      <img
        src={
          isUserPost
            ? userNamePicture.picture
              ? userNamePicture.picture
              : avatar
            : updatedPost.author.picture
            ? updatedPost.author.picture
            : avatar
        }
        alt="default avatar profil"
        className="avatarPost"
        onClick={(e) => goToProfileUser(e)}
      />
      <div className="rightPost">
        <div className="upperPost">
          <div className="nameDateDiv ml16">
            <p className="usernamePost" onClick={(e) => goToProfileUser(e)}>
              {isUserPost ? userNamePicture.pseudo : updatedPost.author.pseudo}
            </p>
            <p className="datePost">
              {toFormattedDateWithHours(updatedPost.createdAt)}
            </p>
          </div>

          <Modal
            isOpen={showModalDelete}
            onRequestClose={closeModalDelete}
            className="deletePostModal"
          >
            <h2>Delete Post?</h2>
            <p>
              Confirm the suppression of this post will remove it from your
              profile, this action can't be undone.
            </p>
            <button
              className="confirmDeletePost"
              onClick={(e) => {
                handleDeletePost(e, updatedPost._id);
              }}
            >
              Delete
            </button>
            <button
              className="cancelDeletePost"
              onClick={(e) => closeModalDelete(e)}
            >
              Cancel
            </button>
          </Modal>
          <div
            className="hoverEffectDelete"
            id={isUserPost ? "showFlex" : "hide"}
          >
            <BsTrash
              className="deleteOption"
              onClick={(e) => {
                openModalDelete(e);
              }}
            />
          </div>
        </div>
        {isComment ? (
          <i className="commentPost">
            This message is a comment of{" "}
            <span
              className="linkOtherPost"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/Home/Posts/${updatedPost.isCommentOf}`);
              }}
            >
              This Post
            </span>
          </i>
        ) : null}

        <img
          src={updatedPost.picture ? updatedPost.picture : null}
          alt="post"
          className="picturePost"
          id={updatedPost.picture ? "showBlock" : "hide"}
        />
        <p className="contentPost ml16">{updatedPost.message}</p>
        <div className="likeReplyDiv ml16">
          <Modal
            isOpen={showModalReply}
            onRequestClose={closeModalReply}
            className="replyPostModal"
          >
            <ModalReply
              isUserPost={isUserPost}
              userNamePicture={userNamePicture}
              updatedPost={updatedPost}
              handleComment={handleComment}
            />
          </Modal>
          <div className="divHoverEffectReply">
            <div
              className="hoverEffectReply"
              onClick={(e) => openModalReply(e)}
            >
              <BiMessageRounded className="replyButton" />
            </div>
            <p>{post.comments.length}</p>
          </div>
          <div className="divHoverEffectLike">
            <div className="hoverEffectLike">
              {likeByMe ? (
                <AiFillHeart
                  className="unlikeButton"
                  onClick={(e) => handleLikeButton(e)}
                />
              ) : (
                <AiOutlineHeart
                  className="likeButton"
                  onClick={(e) => handleLikeButton(e)}
                />
              )}
            </div>
            <p>{updatedPost.likes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
