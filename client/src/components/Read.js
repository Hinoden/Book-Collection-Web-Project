import React from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './Read.css';

const ReadPage = () => {
    const {books, read} = useGlobalContext();
    const readChecker = (id) => {
        const boolean = read.some((book) => book.id === id);
        return boolean;
    }
    return(
        <div className = 'reads'>
            {read.length > 0 ? (
                <div className = 'read-list'>
                    <div className = 'booklist-content-grid'>
                    {
                        read.map((book, index) => (
                            <Book key={index} {...book} />
                        )) 
                    }
                    </div>
                </div>
        ) : (<h1>You don't have any reads!</h1>
        )}
        </div>
    );
}

export default ReadPage;