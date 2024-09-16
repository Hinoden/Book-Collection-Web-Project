import React, {useRef, useState, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import './SignUp.css';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;     //username must start with a lower or uppercase letter, then followed by lower/uppercase, "-", "_", or 0-9, and have 3-23 characters
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;        //password requires one lowercase letter, one uppercase letter, one digit, and one special character and have 8-24 characters
const REGISTER_URL = 'http://localhost:3500/register';

function SignUp(props) {
    const userRef = useRef();
    const errRef = useRef();

    const [fullName, setFullName] = useState('');

    const [username, setUsername] = useState('');     //tied to user input
    const [validName, setValidName] = useState(false);      //tied to whether the name validates or not
    const [userFocus, setUserFocus] = useState(false);      //whether we have focus on that input field or not

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');      //if I want to add in a "enter password again" field
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [signUpStatus, setSignUpStatus] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {       //used to validate the username
        const result = USER_REGEX.test(username);
        // console.log(result);
        // console.log(username);
        setValidName(result);
    }, [username])

    useEffect(() => {       //used to test the password
        const result = PWD_REGEX.test(password);
        // console.log(result);
        // console.log(password);
        setValidPassword(result);
        const match = password ===matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    useEffect(() => {       //used for error message
        setErrMsg('');
    }, [username, password, matchPassword])

    const signUp = () => {
        axios.post(REGISTER_URL, {
            fullName: fullName,
            username: username,
            password: password,
        }).then((response) => {
            if (response.status === 200){
                setSignUpStatus(response.data.message);
            }
            else{
                setSignUpStatus("");
            }
        });
    };

    // const signUp = () => {
    //     axios.post(REGISTER_URL, {
    //         fullName: fullName,
    //         username: username,
    //         password: password,
    //     }).then((response) => {
    //         console.log(response);
    //     });
    // };

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <br />
                    <p>
                        <a href = "http://localhost:3000">Sign In</a>
                    </p>
                </section>
            ) : (
        <div className="signUpContainer">
            <p ref={errRef} className = {errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className = "header1">
                <div className = "title1">Sign Up</div>
            </div>
            <div className = "fullName">
                <TextField id="standard-basic" label="Full Name" variant="standard"
                placeholder = "Full Name"
                style ={{width: '300px'}}
                autoComplete="off"
                onChange={(e) => setFullName(e.target.value)}
                value = {fullName}
                required
                />
            </div>
            <div className = "user">
                <TextField id="standard-basic" label="Username" variant="standard"
                placeholder = "Username"
                style ={{width: '300px'}}
                ref = {userRef}
                autoComplete = "off"
                onChange={(e) => setUsername(e.target.value)}
                value = {username}
                required
                aria-invalid = {validName ? "false" : "true"}       //auto set to true, but if username is valid, then set to false
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                    Username Requirements:<br />
                    4 to 24 characters<br />
                    Begin with a letter<br />
                    Letters, numbers, underscores, and hyphens allowed.
                </p>
            </div>
            <div className = "pass">
                <TextField id="standard-basic" type="password" label="Password" variant="standard"
                placeholder = "Password"
                style ={{width: '300px'}}
                ref = {userRef}
                autoComplete = "off"
                onChange={(e) => setPassword(e.target.value)}
                value = {password}
                required
                aria-invalid = {validPassword ? "false" : "true"}
                aria-describedby = "passwordNote"
                onFocus = {() => setPasswordFocus(true)}
                onBlur = {() => setPasswordFocus(false)}
                />
                <p id = "passwordNote" className = {passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                    Password Requirements:<br />
                    8 to 24 characters<br />
                    Must include uppercase and lowercase letters, a number and a special character<br />
                    Allowed special characters: !@#$%
                </p>
            </div>
            <div className = "last">
                <Button disabled={!validName || !validPassword} variant="contained" onClick={signUp}>Sign Up</Button>
            </div>
            <Button onClick={() => props.onFormSwitch('login')} className = "loginButton" variant="text">Have an account? Login here.</Button>
            <h1 className="statusSign">{signUpStatus}</h1>
        </div>
        )}
        </>
    );
}

export default SignUp;

//     const signUp = async (e) => {
//         e.preventDefault();         //if u wanna add more to prevent hacking, 27:40 of Axios User Registration Form Submit video
//         // console.log(username, password);
//         // setSuccess(true);
//         try {
//             const response = axios.post(REGISTER_URL, JSON.stringify({ fullName: fullName, username: username, password: password}),
//                 {
//                     headers: {'Content-Type': 'application/json'},
//                     withCredential: true
//                 }
//             );
//             console.log(response.data);
//             console.log(response.accessToken);
//             console.log(JSON.stringify(response));
//             // setSuccess(true);
//             //clear input fields out of registration fields if wanted
//         } catch (err) {
//             if (!err?.response) {
//                 setErrMsg('No Server Response');
//             } else if (err.response?.status === 409){
//                 setErrMsg('Username Taken');
//             } else {
//                 setErrMsg('Registration Failed')
//             }
//             errRef.current.focus();
//         }
//     }

//     return (
//         <>
//             {success ? (
//                 <section>
//                     <h1>Success!</h1>
//                     <br />
//                     <p>
//                         <a href = "http://localhost:3000">Sign In</a>
//                     </p>
//                 </section>
//             ) : (
//         <div className="signUpContainer">
//             <p ref={errRef} className = {errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
//             <div className = "header1">
//                 <div className = "title1">Sign Up</div>
//             </div>
//             <div className = "fullName">
//                 <TextField id="standard-basic" label="Full Name" variant="standard"
//                 placeholder = "Full Name"
//                 style ={{width: '300px'}}
//                 autoComplete="off"
//                 onChange={(e) => setFullName(e.target.value)}
//                 value = {fullName}
//                 required
//                 />
//             </div>
//             <div className = "user">
//                 <TextField id="standard-basic" label="Username" variant="standard"
//                 placeholder = "Username"
//                 style ={{width: '300px'}}
//                 ref = {userRef}
//                 autoComplete = "off"
//                 onChange={(e) => setUsername(e.target.value)}
//                 value = {username}
//                 required
//                 aria-invalid = {validName ? "false" : "true"}       //auto set to true, but if username is valid, then set to false
//                 aria-describedby="uidnote"
//                 onFocus={() => setUserFocus(true)}
//                 onBlur={() => setUserFocus(false)}
//                 />
//                 <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
//                     Username Requirements:<br />
//                     4 to 24 characters<br />
//                     Begin with a letter<br />
//                     Letters, numbers, underscores, and hyphens allowed.
//                 </p>
//             </div>
//             <div className = "pass">
//                 <TextField id="standard-basic" type="password" label="Password" variant="standard"
//                 placeholder = "Password"
//                 style ={{width: '300px'}}
//                 ref = {userRef}
//                 autoComplete = "off"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value = {password}
//                 required
//                 aria-invalid = {validPassword ? "false" : "true"}
//                 aria-describedby = "passwordNote"
//                 onFocus = {() => setPasswordFocus(true)}
//                 onBlur = {() => setPasswordFocus(false)}
//                 />
//                 <p id = "passwordNote" className = {passwordFocus && !validPassword ? "instructions" : "offscreen"}>
//                     Password Requirements:<br />
//                     8 to 24 characters<br />
//                     Must include uppercase and lowercase letters, a number and a special character<br />
//                     Allowed special characters: !@#$%
//                 </p>
//             </div>
//             <div className = "last">
//                 <Button disabled={!validName || !validPassword} variant="contained" onClick={signUp}>Sign Up</Button>
//             </div>
//             <Button onClick={() => props.onFormSwitch('login')} className = "loginButton" variant="text">Have an account? Login here.</Button>
//         </div>
//         )}
//         </>
//     );
// }

// export default SignUp;