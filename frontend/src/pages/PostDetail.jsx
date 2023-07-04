import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(updatedPostDetail);
  }, [updatedPostDetail]);

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    const postIdDelete = await deletePost(postId);
    if (postIdDelete === updatedPostDetail._id) {
      navigate(-1);
    } else {
      setUpdatedPostDetail((prevPostDetail) => {
        const updatedComments = prevPostDetail.comments.filter(
          (comment) => comment._id !== postIdDelete
        );

        return {
          ...prevPostDetail,
          comments: updatedComments,
        };
      });
      setListComment((prevList) =>
        prevList.filter((comment) => comment._id !== postIdDelete)
      );
    }
  };

  const handleCommentProfile = (comment) => {
    console.log("zejfo");
    setUpdatedPostDetail((prevPostDetail) => {
      const newCommentsList = [comment._id, ...prevPostDetail.comments];

      return { ...prevPostDetail, comments: newCommentsList };
    });

    // if (comment.isCommentOf && comment.isCommentOf.length > 0) {
    //   const updatedList = listPost.map((existingPost) => {
    //     if (comment.isCommentOf.includes(existingPost._id)) {
    //       existingPost.comments.push(comment._id);
    //     }
    //     return existingPost;
    //   });
    //   setListPost([comment, ...updatedList]);
    // } else {
    //   setListPost([comment, ...listPost]);
    // }
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
        handleCommentProfile={handleCommentProfile}
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
                handleCommentProfile={handleCommentProfile}
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
