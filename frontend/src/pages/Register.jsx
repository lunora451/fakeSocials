import { React } from "react";
import { registerApi } from "../network/user_api";
import { redirect, Form } from "react-router-dom";
import "./styles/register.css";

export async function registerAction({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log(updates);
  await registerApi(updates);
  return redirect("../");
}

const Register = () => {
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
          <button type="submit">Confirm</button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
