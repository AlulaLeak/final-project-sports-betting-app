import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./views/pages/Home";
import Login from "./views/pages/Login";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  useEffect(() => {
    isAuthenticated &&
      axios.post("http://localhost:3021/users", user).catch(function (err) {
        console.error(err);
      });
  }, [isAuthenticated]);

  return (
    <div>
      {isLoading ? (
        <div className="loader">
          <span>Loading</span>
        </div>
      ) : isAuthenticated ? (
        <Home />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
