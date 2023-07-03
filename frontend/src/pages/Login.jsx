import React, { useEffect } from "react";
import { loginApi } from "../network/user_api";
import { redirect, Form, useNavigate } from "react-router-dom";
import jwtImage from "../assets/img/jwtToken.png";
import backgroundImage from "../assets/img/network.webp";
import "./styles/login.css";

async function loginAction({ request }) {
  const formData = await request.formData();
  const loginInfo = Object.fromEntries(formData);
  await loginApi(loginInfo);
  return redirect(`/Home/Profile/me`);
}

const Login = () => {
  const navigate = useNavigate();

  const navigateToRegisterPage = () => {
    navigate("/register");
  };

  useEffect(() => {
    document.getElementById(
      "root"
    ).style.background = `url(${backgroundImage})`;
    document.getElementById("root").style.backgroundSize = "cover";
  }, []);

  return (
    <div className="loginPage">
      <div className="connexionContainer">
        <h1>Sign in</h1>
        <Form method="post">
          <div>
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              name="pseudo"
              id="pseudo"
              required
              minLength={3}
              maxLength={55}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={6}
              maxLength={55}
              required
            />
          </div>
          <button type="submit">Connect</button>
        </Form>

        <p>
          You are not registered yet?{" "}
          <button onClick={navigateToRegisterPage}>Register</button>{" "}
        </p>

        <i className="lineToken">
          Authentication is powered by
          <img src={jwtImage} alt="icon jwtToken" />
        </i>
      </div>
    </div>
  );
};

export { Login, loginAction };
