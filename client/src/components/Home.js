import React from 'react';
import Navbar from "./Navbar.js";
import './Home.css';
import {Outlet} from 'react-router-dom';

function Home({username}) {
    return (
        <main>
            <Navbar />
            <div class="header">
                <h1>Welcome to your library!</h1>
                <br></br>
                <p id="description">Hello fellow nerds. Here, you're able to search up books and read up on their descriptions and further information. If you'd like, feel free to add them to the lists on your profile which include "Currently reading", "Read", "Dropped", or "Wishlist". Enjoy and have fun!</p>
            </div>
            <Outlet />
        </main>
    );
}

export default Home;