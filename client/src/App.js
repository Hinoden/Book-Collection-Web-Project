import {useState, useEffect} from "react";
import Welcome from "./components/Greeting.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import Navbar from "./components/Navbar.js";
import Home from "./components/Home.js";
import './App.css';

function App() {
  const [myBool, setmyBool] = useState(true);
  const [currentForm, setCurrentForm] = useState('login');
  const [auth, setAuth] = useState(false);

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  function toggleBool() {
    setmyBool(!myBool);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authStatus = localStorage.getItem("auth");
    
    if (token && authStatus === "true") {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <div className="App">
      {auth ? (
        <>
          <Navbar/>
          <Home/>
        </>
      ) : (
        <>
      {myBool ? (
        <Welcome toggleBool={toggleBool} />
      ) : (
        currentForm === "login" ? (
          <Login onFormSwitch={toggleForm} setAuth={setAuth}/>
        ) : (
          <SignUp onFormSwitch={toggleForm} />
        )
      )}
      </>
      )}
    </div>
  );
}

export default App;
