import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useGlobalContext} from "./Context..js";
import coverImg from "../cover_not_found.jpg";
import Button from '@mui/material/Button';
import './BookDetails.css';

const URL = "https://openlibrary.org/works/";

const BookDetails = () => {
    const {currRead, addToCurrRead, removeFromCurrRead, read, addToRead, removeFromRead, dropped, addToDropped, removeFromDropped, wishlisted, addToWishlist, removeFromWishlist} = useGlobalContext();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    const currReadChecker = (id) => {
        const booleanCurr = currRead.some((book) => book.id === id);
        return booleanCurr;
    }

    const readChecker = (id) => {
        const booleanRead = read.some((book) => book.id === id);
        return booleanRead;
    }

    const droppedChecker = (id) => {
        const booleanDropped = dropped.some((book) => book.id === id);
        return booleanDropped;
    }

    const wishlistChecker = (id) => {
        const booleanWishlist = wishlisted.some((book) => book.id === id);
        return booleanWishlist;
    }

    useEffect(() => {
        setLoading(true);
        async function getBookDetails(){
            try{
                const response = await fetch(`${URL}${id}.json`);
                const data = await response.json();
                console.log(data);

                if (data){
                    const {description, title, covers, subject_places, subject_times, subject} = data;
                    const newBook = {
                        description: description ? description.value : "No description found",
                        title: title,
                        id: id,
                        cover_img: covers ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg` : coverImg,
                        subject_places: subject_places ? subject_places.join(", ") : "No subject places found",
                        subject_times: subject_times ? subject_times.join(", ") : "No subject times found",
                        subject: subject ? subject.join(", ") : "No subjects found"
                    };
                    setBook(newBook);
                } else {
                    setBook(null);
                }
                setLoading(false);
            } catch (error){
                console.log(error);
                setLoading(false);
            }
        }
        getBookDetails();
    }, [id]);

    if (loading) {
        return <div>Loading Books...</div>
    }

    return (
        <section>
            <div className="book_details">
                <div className="book_cover">
                    <img src={book?.cover_img} alt = "cover img" />
                </div>
                <div className="book_info">
                    <div className="book_title">
                        <span>{book?.title}</span>
                    </div>
                    <div className="book_description">
                        <span id = "bold">Description: </span>
                        <span>{book?.description}</span>
                    </div>
                    <div className="book_subject_places">
                        <span id = "bold">Subject Places: </span>
                        <span>{book?.subject_places}</span>
                    </div>
                    <div className="book_subject_times">
                        <span id = "bold">Subject Times: </span>
                        <span>{book?.subject_times}</span>
                    </div>
                    <div className="subjects">
                        <span id = "bold">Subjects: </span>
                        <span>{book?.subject}</span>
                    </div>
                    <div className="buttonContainer1">
                        {book && readChecker(book.id) ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => removeFromRead(book.id)}>
                                <span>Remove Read</span>
                            </Button>
                        ) : (
                            <Button variant="outlined" className="generalButton" onClick = {() => addToRead(book)}>
                                <span>Read</span>
                            </Button>
                        )}
                        {book && currReadChecker(book.id) ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => removeFromCurrRead(book.id)}>
                                <span>Remove Currently Reading</span>
                            </Button>
                        ) : (
                            book && (
                                <Button variant="outlined" className="generalButton" onClick = {() => addToCurrRead(book)}>
                                    <span>Currently Reading</span>
                                </Button>
                            )
                        )}
                        {book && droppedChecker(book.id) ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => removeFromDropped(book.id)}>
                                <span>Remove Dropped</span>
                            </Button>
                        ) : (
                            book && (
                                <Button variant="outlined" className="generalButton" onClick = {() => addToDropped(book)}>
                                    <span>Dropped</span>
                                </Button>
                            )
                        )}
                        {book && wishlistChecker(book.id) ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => removeFromWishlist(book.id)}>
                                <span>Remove Wishlist</span>
                            </Button>
                        ) : (
                            book && (
                                <Button variant="outlined" className="generalButton" onClick = {() => addToWishlist(book)}>
                                    <span>Wishlist</span>
                                </Button>
                            )
                        )}
                    </div>
                    <Button variant="contained" className="backButton" onClick={() => navigate("/book")}>
                        <span>Go Back</span>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default BookDetails