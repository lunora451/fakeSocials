import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <div className="containerError">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <button onClick={() => navigate("/")}>Back to Login Page</button>
        <button onClick={() => navigate(-1)}>Previous Page</button>
      </div>
    </div>
  );
}
