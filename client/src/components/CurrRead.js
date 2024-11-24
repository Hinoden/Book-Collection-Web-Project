import React, {useEffect, useState} from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './CurrRead.css';

const CurrReadPage = () => {
    const {userId} = useGlobalContext();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async() => {
            try {
                const response = await fetch(`http://localhost:3500/api/currRead/${userId}`);
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
            <div className = "currReads">
                {loading ? (
                    <h1>Loading...</h1>
                ) : books.length > 0 ? (
                    <div className = 'curr-read-list'>
                        <div className = 'booklist-content-grid'>
                            {
                                books.map((book, index) => (
                                    <Book key={index}{...book} />
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <div className="currReadDesc">
                        <h1>You don't have any current reads!</h1>
                        <p>C'mon, let's read!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CurrReadPage;