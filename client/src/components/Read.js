import React, {useEffect, useState} from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './Read.css';

const ReadPage = () => {
    const {userId} = useGlobalContext();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async() => {
            try {
                const response = await fetch(`http://localhost:3500/api/read/${userId}`);
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
        <div className = "reads">
            {loading ? (
                <h1>Loading...</h1>
            ) : books.length > 0 ? (
                <div className = "read-list">
                    <div className = "booklist-content-grid">
                        {books.map((book, index) => (
                            <Book key={index} {...book} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="noList">
                    <h1>You don't have any reads!</h1>
                    <p>...You haven't read a single book?</p>
                </div>
            )}
        </div>
    )
}

export default ReadPage;