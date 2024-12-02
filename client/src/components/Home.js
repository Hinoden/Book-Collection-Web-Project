import React from 'react';
import {useState} from "react";
import Navbar from "./Navbar.js";
import {Outlet, useLocation} from 'react-router-dom';
import './Home.css';

function Home({username}) {
    const [isTextVisible, setIsTextVisible] = useState(true);
    const location = useLocation();

    const hideText = () => {
        setIsTextVisible(false);
    };

    const showText = () => {
        setIsTextVisible(true);
    };

    return (
        <main>
            <Navbar username={username} hideText={hideText} showText={showText}/>
            {isTextVisible && !location.pathname.startsWith('/myList') && (
                <div class="header">
                    <h1>Welcome to your library!</h1>
                        <p id="description">Hello fellow nerds. Here, you're able to search up books and read up on their descriptions and further information. If you'd like, feel free to add them to the lists on your profile which include "Currently reading", "Read", "Dropped", or "Wishlist". Enjoy and have fun!</p>
                </div>
            )}
            <Outlet context={{ showText }}/>
        </main>
    );
}

export default Home;