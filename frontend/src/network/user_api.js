import axios from "axios";
import Cookies from "js-cookie";

export const editUserById = async (formData) => {
  // const { author, pseudo, picture, wallpaper, bio } = editProfileObject;
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}users/edit`,
      formData,
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
    throw new Error("Error on fetching user :/");
  }
};

export const getOtherUserById = async (id) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");
    const userId = Cookies.get("idUser");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}users/other/${id}`,
      {
        params: {
          userId: userId,
        },
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
    throw new Error("Error on fetching user :/");
  }
};

export const getUserById = async (id) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}users/${id}`,
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
    throw new Error("Connection Token has expire, you need to login again");
  }
};

export const getNamePictureUser = async (id) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}users/name/${id}`,
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
    throw new Error("Connection Token has expire, you need to login again");
  }
};

export const getAllFollowerById = async (id) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}users/follower/${id}`,
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
    throw new Error("Connection Token has expire, you need to login again");
  }
};

export const getAllFollowingById = async (id) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}users/following/${id}`,
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
    throw new Error("Connection Token has expire, you need to login again");
  }
};

//followUser
export const followAccount = async (otherUserId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}users/follow`,
      {
        otherUserId: otherUserId,
        myUserId: myUserId,
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
    throw new Error("Error on fetching user :/");
  }
};

//unFollowUser
export const unFollowAccount = async (otherUserId) => {
  try {
    // Récupération du JWT depuis le localStorage
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}users/unfollow`,
      {
        otherUserId: otherUserId,
        myUserId: myUserId,
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
    throw new Error("Error on fetching user :/");
  }
};

export const loginApi = async (loginInfo) => {
  const { pseudo, password } = loginInfo;
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}users/login`,
      {
        pseudo,
        password,
      }
    );
    if (response.status === 201) {
      // Stockage du JWT dans le localStorage

      Cookies.set("jwt", response.data.token);
      Cookies.set("idUser", response.data.userId);

      return response.data;
    } else {
      throw new Error("bep bep connection not Working!");
    }
  } catch (error) {
    throw new Error("bep bep connection not Working!");
  }
};

export const registerApi = async (registerInfo) => {
  const { pseudo, email, password } = registerInfo;

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}users/register`,
      {
        pseudo,
        email,
        password,
      }
    );
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Oops!");
    }
  } catch (error) {
    throw new Error("Oops!");
  }
};
export const deleteAccountCall = async () => {
  try {
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}users/delete/${myUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Oops!");
    }
  } catch (error) {
    throw new Error("Oops!");
  }
};
