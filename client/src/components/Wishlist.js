import React, {useEffect, useState} from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './Wishlist.css';

const WishlistPage = () => {
    const {userId} = useGlobalContext();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async() => {
            try {
                const response = await fetch(`http://localhost:3500/api/wishlistBooks/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBooks(data);
                } else {
                    console.error('Failed to fetch books');
                }
            } catch (error) {
                console.error('Error fetching books: ', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchBooks();
        }
    }, [userId]);
    return(
        <div className="parentContainer">
            <div className = "wishlists">
                {loading ? (
                    <h1>Loading...</h1>
                ) : books.length > 0 ? (
                    <div className = "wishlist-list">
                        <div className = "booklist-content-grid">
                            {books.map((book, index) => (
                                <Book key={index} {...book} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>You don't have any wishlisted reads!</h1>
                        <p>Come on, there has to be at least one book you want.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage;