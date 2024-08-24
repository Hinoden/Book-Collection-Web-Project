import {useState, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "../api/axios.js";
import {FaSearch} from "react-icons/fa";
import './Navbar.css';

function Navbar({username}) {
    const [currentForm, setCurrentForm] = useState('login');
    const [auth, setAuth] = useState(false);

    const logOut = () => {
        axios.post("http://localhost:3500/logout")
        .then(response => {
          setAuth(false);
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("auth");
          setCurrentForm('login');
          document.cookie.split(";").forEach(cookie => {
            const [name] = cookie.split("=");
            document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
          console.log(response.data.message);
          window.location.reload();
        })
        .catch(error => {
          console.error("There was an error logging out!", error);
        })
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
    const useRname = localStorage.getItem("username");
    console.log(useRname);

    return (
        <div id = "Navbar">
            <input type="text" className="search" placeholder="Harry Potter and the..." autoComplete="off"></input>
            <Button variant="contained" id="searchButton">
              <FaSearch size={20}/>
            </Button>
            <Button variant="contained" id="logOut" onClick={logOut}>Log Out</Button>
            <p id="welcome">Welcome {useRname}</p>
        </div>
    );
}

export default Navbar;