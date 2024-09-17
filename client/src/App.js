import {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Welcome from "./components/Greeting.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import Home from "./components/Home.js";
import BookList from "./components/BookList.js";
import BookDetails from "./components/BookDetails.js";
import {AppProvider} from "./components/Context..js";
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
    <AppProvider>
    <div className="App">
      {auth ? (
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}>
                  <Route path="/book" element={<BookList />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                </Route>
            </Routes>
          </BrowserRouter>
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
    </AppProvider>
  );
}

export default App;
