import React from 'react';
import Navbar from "./Navbar.js";
import Button from '@mui/material/Button';
import {Outlet} from 'react-router-dom';
import './Home.css';

function Home({username}) {
    return (
        <main>
            <Navbar />
            <div class="header">
                <h1>Welcome to your library!</h1>
                <p id="description">Hello fellow nerds. Here, you're able to search up books and read up on their descriptions and further information. If you'd like, feel free to add them to the lists on your profile which include "Currently reading", "Read", "Dropped", or "Wishlist". Enjoy and have fun!</p>
                <Button variant="contained" className="listButton">
                        <span>Go To My List</span>
                </Button>
            </div>
            <Outlet />
        </main>
    );
}

export default Home;