import React from 'react';
import {useGlobalContext} from "./Context..js";
import Book from './Book.js';
import './Dropped.css';

const DroppedPage = () => {
    const {books, dropped} = useGlobalContext();
    const droppedChecker = (id) => {
        const boolean = dropped.some((book) => book.id === id);
        return boolean;
    }
    return(
        <div className = 'droppeds'>
            {dropped.length > 0 ? (
                <div className = 'dropped-list'>
                    <div className = 'booklist-content-grid'>
                    {
                        dropped.map((book, index) => (
                            <Book key={index} {...book} />
                        )) 
                    }
                    </div>
                </div>
        ) : (<h1>You don't have any dropped books!</h1>
        )}
        </div>
    );
}

export default DroppedPage;