import { React, useEffect } from "react";
import { registerApi } from "../network/user_api";
import { redirect, Form } from "react-router-dom";
import backgroundImage from "../assets/img/network.webp";
import "./styles/register.css";

export async function registerAction({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  showSpinner();
  await registerApi(updates);
  return redirect("../");
}

function showSpinner() {
  const spinner = document.querySelector(".lds-roller");
  spinner.style.display = "inline-block";
}
const Register = () => {
  useEffect(() => {
    document.getElementById(
      "root"
    ).style.background = `url(${backgroundImage}) no-repeat center fixed `;
    document.getElementById("root").style.backgroundSize = "cover";
  }, []);

  return (
    <div className="registerPage">
      <div className="containerRegister">
        <h1>Register</h1>
        <Form method="post">
          <label htmlFor="loginRegister">Pseudo</label>
          <input
            type="text"
            name="pseudo"
            id="loginRegister"
            required
            minLength={3}
            maxLength={55}
            placeholder="lunora451"
          />
          <label htmlFor="mailRegister">Mail</label>
          <input
            type="text"
            name="email"
            id="mailRegister"
            required
            minLength={3}
            maxLength={55}
            placeholder="example@gmail.com"
          />
          <label htmlFor="passwordRegister">Password</label>
          <input
            type="password"
            name="password"
            id="passwordRegister"
            minLength={6}
            maxLength={55}
            required
          />
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <button type="submit" className="buttonRegisterForm">
            Confirm
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
