import {useState, useEffect, useRef} from "react";
import Button from '@mui/material/Button';
import axios from "../api/axios.js";
import {FaSearch} from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import {useGlobalContext} from "./Context..js";
import './Navbar.css';

function Navbar({username}) {
    const {setSearchTerm, setResultTitle} = useGlobalContext();
    const searchText = useRef(null);
    // const searchText = useRef('');
    const navigate = useNavigate(); 
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

      useEffect(() => searchText.current.focus(), []);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (searchText.current) {  // Check if the ref is not null
            const tempSearchTerm = searchText.current.value.trim();  // Access the value
            if (tempSearchTerm.replace(/[^\w\s]/gi, "").length === 0) {
                setSearchTerm("the lost world");
                setResultTitle("Please Enter Something...");
            } else {
                setSearchTerm(tempSearchTerm);
            }
            navigate("/book");
        } else {
            console.log("Ref is null");
        }
    };
    
      // const handleSubmit = (e) => {
      //   e.preventDefault();
      //   let tempSearchTerm = searchText.current.value.trim();
      //   if ((tempSearchTerm.replace(/[^\w\s]/gi,"")).length === 0){
      //     setSearchTerm("the lost world");
      //     setResultTitle("Please Enter Something...");
      //   } else {
      //     setSearchTerm(searchText.current.value);
      //   }

      //   navigate("/book");
      // };
    
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

    return (
        <div id = "Navbar">
            <input type="text" className="search" placeholder="Harry Potter and the..." ref = {searchText} autoComplete="off"></input>
            <Button variant="contained" id="searchButton" onClick={handleSubmit}>
              <FaSearch size={20}/>
            </Button>
            <Button variant="contained" id="logOut" onClick={logOut}>Log Out</Button>
            <p id="welcome">Welcome {useRname}</p>
        </div>
    );
}

export default Navbar;