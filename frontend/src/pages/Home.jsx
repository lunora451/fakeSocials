import React, { useState } from "react";
import Header from "../components/Header";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import { getNamePictureUser } from "../network/user_api";
import "./styles/home.css";
import Cookies from "js-cookie";

export const homeLoader = async () => {
  const userId = Cookies.get("idUser");
  const userNameAndPicture = await getNamePictureUser(userId);
  return { userNameAndPicture };
};

const Home = () => {
  const { userNameAndPicture } = useLoaderData();
  const [userNamePicture, setUserNamePicture] = useState(userNameAndPicture);

  const [showOptionAccount, setShowOptionAccount] = useState(false);

  const handleOptionAccountButtonVisibility = (e) => {
    e.stopPropagation();
    showOptionAccount
      ? setShowOptionAccount(false)
      : setShowOptionAccount(true);
  };

  return (
    <div
      className="homePage"
      onClick={() => {
        showOptionAccount
          ? setShowOptionAccount(false)
          : setShowOptionAccount(false);
      }}
    >
      <Header
        userNamePicture={userNamePicture}
        showOptionAccount={showOptionAccount}
        handleOptionAccountButtonVisibility={
          handleOptionAccountButtonVisibility
        }
      />
      <main>
        <Outlet context={[userNamePicture, setUserNamePicture]} />
      </main>
      <div className="secondaryMenu"></div>
    </div>
  );
};

export default Home;
