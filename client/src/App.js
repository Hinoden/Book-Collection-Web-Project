import {useState} from "react";
import Button from '@mui/material/Button';
import Welcome from "./components/Greeting.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import './App.css';
import axios from "./api/axios.js";

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

  const logOut = () => {
    axios.post("http://localhost:3500/logout")
    .then(response => {
      setAuth(false);
      localStorage.removeItem("token");
      setCurrentForm('login');
      console.log(response.data.message);
    })
    .catch(error => {
      console.error("There was an error logging out!", error);
    })
  }

  return (
    <div className="App">
      {auth ? (
        <Button variant="contained" onClick={logOut}>Log Out</Button>
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
