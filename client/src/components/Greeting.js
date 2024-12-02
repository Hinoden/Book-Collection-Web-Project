import React from 'react';
import Button from '@mui/material/Button';
import ProfileIcon from '../Cinamoroll reading.jpg';
import './Greeting.css';

function Welcome(props) {
    return (
        <div className = "welcomeContainer">
            <div className = "headerWelcome">
                <div className = "greetingTitle">Welcome!</div>
            </div>
            <div className = "middle">
                <img src={ProfileIcon} alt="Profile Icon" className = "image"/>
                <div className = "message">This library app was created for those who enjoy reading. Enjoy!</div>
            </div>
            <div className = "bottom">
                <Button variant="contained" onClick={props.toggleBool}>Explore</Button>
            </div>
        </div>
    );
}

export default Welcome;