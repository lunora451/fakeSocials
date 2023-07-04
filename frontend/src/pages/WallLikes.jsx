import React, { useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import Post from "../components/Post";
import { getAllLikes, deletePost } from "../network/post_api";
import "./styles/wallLikes.css";

export async function wallLikesLoader({ params }) {
  const listPosts = await getAllLikes(params.userId);
  return { listPosts };
}

const WallLikes = () => {
  const { listPosts } = useLoaderData();
  const [listPostsState, setListPostsState] = useState(listPosts);
  const [userNamePicture, setUserNamePicture] = useOutletContext();

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    const postIdDelete = await deletePost(postId);

    setListPostsState((prevListPost) => {
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

  return (
    <div className="wallLikes">
      <div className="topBannerWallLikes">
        <i>This page show all post you likes</i>
      </div>
      <span className="borderLine" />
      <ul>
        {listPostsState.map((post) => {
          return (
            <li key={post._id}>
              <Post
                userNamePicture={userNamePicture}
                post={post}
                handleDeletePost={handleDeletePost}
                setIfComment={true}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WallLikes;
