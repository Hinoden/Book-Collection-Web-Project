import React, {useRef, useState, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './Login.css';

import axios from '../api/axios';
const LOGIN_URL = 'https://book-collection-web-project-api.vercel.app/login';

function Login(props) {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    // const [loginStatus, setLoginStatus] = useState(false);
    const [loginMSG, setLoginMSG] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const login = () => {
        axios.post(LOGIN_URL, {
            username: username,
            password: password,
        }).then((response) => {
            if (!response.data.auth){
                // setLoginStatus(false);
                setLoginMSG(response.data.message);
                props.setAuth(false);
            } else {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("auth", "true");
                // setLoginStatus(true);
                props.setAuth(true);
            }
        });
    };

    // const userAuthenticated = () => {
    //     axios.get("http://localhost:3500/isUserAuth", {
    //         headers: {
    //             "x-access-token": localStorage.getItem("token"),
    //         },
    //     }).then((response) => {
    //         console.log(response);
    //     });
    // };

    return (
        <div className="loginContainer">
            <p ref = {errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className = "header1">
                <div className = "title1">Login</div>
            </div>
            <div className = "userLogin">
                <TextField id="standard-basic" label="Username" variant="standard"
                placeholder = "Username"
                autoComplete="off"
                ref={userRef}
                style ={{width: '300px'}}
                onChange={(event) => {setUsername(event.target.value)}}
                value={username}
                required
                />
            </div>
            <div className = "passLogin">
                <TextField id="standard-basic" type="password" label="Password" variant="standard"
                placeholder = "Password"
                autoComplete = "off"
                style ={{width: '300px'}}
                onChange={(event) => {setPassword(event.target.value)}}
                value = {password}
                required
                />
            </div>
            <div className = "last">
                <Button variant="contained" onClick={login}>Login</Button>
            </div>
            <Button onClick={() => props.onFormSwitch('register')} className = "registerButton" variant="text">Don't have an account? Register here.</Button>
            {/* {loginStatus && (
                <Button variant="contained" onClick={userAuthenticated}>Check If Authenticated</Button>
            )} */}
            <h1 className="status">{loginMSG}</h1>
        </div>
    );
}

export default Login;
