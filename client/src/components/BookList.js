import React from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import coverImg from "../cover_not_found.jpg";
import './BookList.css';

//https://covers.openlibrary.org/b/id/240727-S.jpg <-- The link for covers

const BookList = () => {
    const {books, loading, resultTitle} = useGlobalContext();
    const booksWithCovers = books.map((singleBook) => {
        return {
            ...singleBook,
            id: (singleBook.id).replace("/works/", ""),
            cover_img: singleBook.cover_id ? `https://covers.openlibrary.org/b/id/${singleBook.cover_id}-L.jpg` : coverImg
        }
    });

    if (loading) {
        return <div>Loading Books...</div>
    }

    return (
        <section className='booklist'>
            <div className='container'>
                <div className='section-title'>
                    <h2>{resultTitle}</h2>
                </div>
                <div className='booklist-content-grid'>
                    {
                        booksWithCovers.slice(0, 30).map((item, index) => {
                            return (
                                <Book key = {index} {...item} />
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default BookList