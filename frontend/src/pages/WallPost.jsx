import React, { useState, useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import Post from "../components/Post";
import { getAllPosts, deletePost } from "../network/post_api";
import "./styles/wallPosts.css";

export async function wallPostLoader() {
  const listPosts = await getAllPosts();
  return { listPosts };
}

const WallPost = () => {
  const { listPosts } = useLoaderData();
  const [listPostsState, setListPostsState] = useState(listPosts);
  const [userNamePicture, setUserNamePicture] = useOutletContext();

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    const postIdDelete = await deletePost(postId);

    setListPostsState((prevListPost) =>
      prevListPost.filter((post) => post._id !== postIdDelete)
    );
  };

  const handleCommentProfile = (comment) => {
    setListPostsState((prevPostState) => {
      return prevPostState.map((post) => {
        if (post._id === comment.isCommentOf[0]) {
          post.comments = [comment._id, ...post.comments];
          return post;
        } else {
          return post;
        }
      });
    });
  };

  return (
    <div className="wallPost">
      <div className="topBannerWallPost">
        <i>This page show all post from recent to older</i>
      </div>
      <span className="borderLine" />
      <ul>
        {listPostsState.map((post) => {
          return (
            <li key={post._id}>
              <Post
                handleCommentProfile={handleCommentProfile}
                userNamePicture={userNamePicture}
                post={post}
                handleDeletePost={handleDeletePost}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WallPost;
