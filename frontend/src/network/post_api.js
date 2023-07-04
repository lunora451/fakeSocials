import axios from "axios";
import Cookies from "js-cookie";

export const postMe = async (formDataPoster) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    console.log(formDataPoster);
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}posts/`,
      formDataPoster,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const postComment = async (formDataComment) => {
  // const { author, message, picture, video, postId } = commentInfo;
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}posts/comment`,
      formDataComment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const likePost = async (postId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}posts/like/yo`,
      {
        postId,
        myUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const unLikePost = async (postId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}posts/unlike/yo`,
      {
        postId,
        myUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const deletePost = async (postId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");
    const userId = Cookies.get("idUser");

    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}posts/delete/${postId}`,
      {
        params: {
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const getPostDetail = async (postId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}posts/detail/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 304) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const getAllPosts = async () => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}posts/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const getAllLikes = async (userId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}posts/likes/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Error on fetching user :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};
