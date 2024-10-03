import React from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './CurrRead.css';

const CurrReadPage = () => {
    const {books, currRead} = useGlobalContext();
    const currReadChecker = (id) => {
        const boolean = currRead.some((book) => book.id === id);
        return boolean;
    }
    return(
        <div className = 'currReads'>
            {currRead.length > 0 ? (
                <div className = 'curr-read-list'>
                    <div className = 'booklist-content-grid'>
                    {
                        currRead.map((book, index) => (
                            <Book key={index} {...book} />
                        )) 
                    }
                    </div>
                </div>
        ) : (<h1>You don't have any current reads!</h1>
        )}
        </div>
    );
}

export default CurrReadPage;