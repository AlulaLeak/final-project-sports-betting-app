import Navbar from "./views/components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./views/pages/Home";
import Login from "./views/pages/Login";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:3020");

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  useEffect(() => {
    // if the user is authenticated
    isAuthenticated &&
      axios
        .post("http://localhost:3020/users", user) // changed to my backend port
        .then(function (response) {
          // console.log(response);
        })
        .catch(function (err) {
          console.error(err);
        });
  }, [isAuthenticated]);

  return (
    <div>
      {/* <Navbar /> */}
      {isLoading ? <div className="loader"><span>Loading</span></div> : isAuthenticated ? <Home /> : <Login />}
    </div>
  );
}

export default App;
