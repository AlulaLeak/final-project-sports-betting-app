import Navbar from "./views/components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from "./views/pages/Home";
import Login from "./views/pages/Login";
import { useAuth0 } from '@auth0/auth0-react'

function App() {

  const { isAuthenticated, isLoading } = useAuth0();


  return (

    <div>
      {/* <Navbar /> */}
      {isLoading ? <div>Loading</div> : (isAuthenticated ? <Home /> : <Login />)}      
    </div>
  );
}

export default App;
