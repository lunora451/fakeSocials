import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
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

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    const postIdDelete = await deletePost(postId);

    setListPostsState((prevListPost) =>
      prevListPost.filter((post) => post._id !== postIdDelete)
    );
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
