import React from 'react';
import Button from '@mui/material/Button';
import ProfileIcon from '../ProfileIcon.png';
import './Greeting.css';

function Welcome(props) {
    return (
        <div className = "welcomeContainer">
            <div className = "header">
                <div className = "title">Welcome!</div>
            </div>
            <div className = "middle">
                <img src={ProfileIcon} alt="Profile Icon" className = "image"/>
                <div className = "message">This React App is a personal project created by Kristina Wong. Enjoy!</div>
            </div>
            <div className = "bottom">
                <Button variant="contained" onClick={props.toggleBool}>Explore</Button>
            </div>
        </div>
    );
}

export default Welcome;