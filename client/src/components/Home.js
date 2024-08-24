import React from 'react';
import './Home.css';

function Home({username}) {
    return (
        <div class="header">
            <h1>Welcome to your library!</h1>
            <br></br>
            <p id="description">Hello fellow nerds. Here, you're able to search up books and read up on their descriptions and further information. If you'd like, feel free to add them to the lists on your profile which include "Currently reading", "Read", "Dropped", or "Wishlist". Enjoy and have fun!</p>
        </div>
    );
}

export default Home;