import React, { useState } from "react";
import Post from "../components/Post";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { getPostDetail, deletePost } from "../network/post_api";
import { FaArrowLeft } from "react-icons/fa";
import "./styles/postDetail.css";
import { RiArrowDownSFill } from "react-icons/ri";

export async function postDetailLoader({ params }) {
  const post = await getPostDetail(params.postId);

  return { post };
}

const PostDetail = () => {
  const navigate = useNavigate();
  const { post } = useLoaderData();
  const [userNamePicture, setUserNamePicture] = useOutletContext();
  const [updatedPostDetail, setUpdatedPostDetail] = useState(post);
  const [listComment, setListComment] = useState(updatedPostDetail.comments);

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    const postIdDelete = await deletePost(postId);
    if (postIdDelete === updatedPostDetail._id) {
      navigate(-1);
    } else {
      setListComment((prevList) =>
        prevList.filter((comment) => comment._id !== postIdDelete)
      );
    }
  };

  return (
    <div className="postDetail">
      <div className="headerPostDetail">
        <div
          className="hoverEffectArrowDetail"
          onClick={() => {
            navigate(-1);
          }}
        >
          <FaArrowLeft />
        </div>
        <i>This page show a post and all his comments</i>
      </div>

      <Post
        userNamePicture={userNamePicture}
        post={updatedPostDetail}
        setListComment={setListComment}
        handleDeletePost={handleDeletePost}
        postDetail={updatedPostDetail}
      />
      <div className="separationComment">
        <RiArrowDownSFill />
      </div>
      <ul className="listCommentPost">
        {listComment.map((comment) => {
          return (
            <li key={comment._id}>
              <Post
                userNamePicture={userNamePicture}
                post={comment}
                handleDeletePost={handleDeletePost}
                setListComment={setListComment}
                setUpdatedPostDetail={setUpdatedPostDetail}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PostDetail;
