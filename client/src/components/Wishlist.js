import React from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './Wishlist.css';



const WishlistPage = () => {
    const {books, wishlisted} = useGlobalContext();
    const wishlistedChecker = (id) => {
        const boolean = wishlisted.some((book) => book.id === id);
        return boolean;
    }
    return(
        <div className = 'wishlists'>
            {wishlisted.length > 0 ? (
                <div className = 'wishlist-list'>
                    <div className = 'booklist-content-grid'>
                    {
                        wishlisted.map((book, index) => (
                            <Book key={index} {...book} />
                        )) 
                    }
                    </div>
                </div>
        ) : (<h1>You don't have any wishlisted books!</h1>
        )}
        </div>
    );
}

export default WishlistPage;