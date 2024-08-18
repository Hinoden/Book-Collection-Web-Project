import {useState} from "react";
import Welcome from "./components/Greeting.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
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
  return (
    <div className="App">
      {auth ? (
        <h>Please</h>
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
