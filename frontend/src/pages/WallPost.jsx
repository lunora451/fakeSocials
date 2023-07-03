import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
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

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    const postIdDelete = await deletePost(postId);

    setListPostsState((prevListPost) =>
      prevListPost.filter((post) => post._id !== postIdDelete)
    );
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
              <Post post={post} handleDeletePost={handleDeletePost} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WallPost;
