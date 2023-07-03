import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={() => navigate("/")}>back to Login Page</button>
    </div>
  );
}
