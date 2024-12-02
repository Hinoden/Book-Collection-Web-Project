import React, {useEffect, useState} from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './Dropped.css';

const DroppedPage = () => {
    const {userId} = useGlobalContext();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async() => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/droppedBooks/${userId}`);
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
        <div className = "parentContainer">
            <div className = "droppeds">
                {loading ? (
                    <h1>Loading...</h1>
                ) : books.length > 0 ? (
                    <div className = "dropped-list">
                        <div className = "booklist-content-grid">
                            {books.map((book, index) => (
                                <Book key={index} {...book} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>You don't have any dropped reads!</h1>
                        <p>Honestly, that's impressive.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DroppedPage;