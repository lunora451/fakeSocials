import axios from "axios";
import Cookies from "js-cookie";

//${process.env.REACT_APP_BACKEND_URL}
//https://fakesocialsapi.onrender.com/

export const editUserById = async (objectEditDB) => {
  try {
    const token = Cookies.get("jwt");

    const response = await axios.post(
      `https://fakesocialsapi.onrender.com/users/edit`,
      objectEditDB,
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

export const getOtherUserById = async (id) => {
  try {
    const token = Cookies.get("jwt");
    const userId = Cookies.get("idUser");

    const response = await axios.get(
      `https://fakesocialsapi.onrender.com/users/other/${id}`,
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
    throw new Error(error.response.data.error);
  }
};

export const getUserById = async (id) => {
  try {
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `https://fakesocialsapi.onrender.com/users/${id}`,
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

export const getNamePictureUser = async (id) => {
  try {
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `https://fakesocialsapi.onrender.com/users/name/${id}`,
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

export const getAllFollowerById = async (id) => {
  try {
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `https://fakesocialsapi.onrender.com/users/follower/${id}`,
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

export const getAllFollowingById = async (id) => {
  try {
    const token = Cookies.get("jwt");

    const response = await axios.get(
      `https://fakesocialsapi.onrender.com/users/following/${id}`,
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

export const followAccount = async (otherUserId) => {
  try {
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.patch(
      `https://fakesocialsapi.onrender.com/users/follow`,
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
    throw new Error(error.response.data.error);
  }
};

export const unFollowAccount = async (otherUserId) => {
  try {
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.patch(
      `https://fakesocialsapi.onrender.com/users/unfollow`,
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
    throw new Error(error.response.data.error);
  }
};

export const loginApi = async (loginInfo) => {
  const { pseudo, password } = loginInfo;
  try {
    const response = await axios.post(
      `https://fakesocialsapi.onrender.com/users/login`,
      {
        pseudo,
        password,
      }
    );
    if (response.status === 201) {
      Cookies.set("jwt", response.data.token);
      Cookies.set("idUser", response.data.userId);

      return response.data;
    } else {
      throw new Error("Seems you're pseudo or password doesn't exist :/");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const registerApi = async (registerInfo) => {
  const { pseudo, email, password } = registerInfo;

  try {
    const response = await axios.post(
      `https://fakesocialsapi.onrender.com/users/register`,
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
    throw new Error(error.response.data.error);
  }
};
export const deleteAccountCall = async () => {
  try {
    const token = Cookies.get("jwt");
    const myUserId = Cookies.get("idUser");

    const response = await axios.delete(
      `https://fakesocialsapi.onrender.com/users/delete/${myUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Oops!");
    }
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};
