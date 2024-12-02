import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import {useGlobalContext} from "./Context..js";
import coverImg from "../cover_not_found.jpg";
import Button from '@mui/material/Button';
import './BookDetails.css';

const URL = "https://openlibrary.org/works/";

const BookDetails = () => {
    const {userId, addToCurrRead, removeFromCurrRead, addToRead, removeFromRead, addToDropped, removeFromDropped, addToWishlist, removeFromWishlist} = useGlobalContext();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [book, setBook] = useState(null);
    const [isRead, setIsRead] = useState(false);
    const [isCurrRead, setIsCurrRead] = useState(false);
    const [isDrop, setIsDrop] = useState(false);
    const [isWish, setIsWish] = useState(false);
    const {showText} = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        showText();
    }, [showText]);

    const readChecker = useCallback(async() => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkRead/${userId}/${id}`);
            const data = await response.json();
            setIsRead(data.isRead);
        } catch (error) {
            console.error('Error checking read status:', error);
        }
    }, [userId, id]);

    const currReadChecker = useCallback(async() => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkCurrRead/${userId}/${id}`);
            const data = await response.json();
            setIsCurrRead(data.isCurrRead);
        } catch (error) {
            console.error('Error checking currRead status: ', error);
        }
    }, [userId, id]);

    const droppedChecker = useCallback(async() => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkDroppedBooks/${userId}/${id}`);
            const data = await response.json();
            setIsDrop(data.isDrop);
        } catch (error) {
            console.error('Error checking drop status: ', error);
        }
    }, [userId, id]);

    const wishlistChecker = useCallback(async() => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkWishlistBooks/${userId}/${id}`);
            const data = await response.json();
            setIsWish(data.isWish);
        } catch (error) {
            console.error('Error checking drop status: ', error);
        }
    }, [userId, id]);

    useEffect(() => {
        setLoading(true);
        const getBookDetails = async () => {
            try{
                const response = await fetch(`${URL}${id}.json`);
                const data = await response.json();
                console.log("data: ", data);
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
                    await readChecker();
                    await currReadChecker();
                    await droppedChecker();
                    await wishlistChecker();
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
    }, [id, readChecker, currReadChecker, droppedChecker, wishlistChecker]);

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
                        {book && isRead ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => {
                                removeFromRead(book.id);
                                setIsRead(false);
                            }}>
                                <span>Remove Read</span>
                            </Button>
                        ) : (
                            <Button variant="outlined" className="generalButton" onClick = {() => {
                                addToRead(book);
                                setIsRead(true);
                            }}>
                                <span>Read</span>
                            </Button>
                        )}
                        {book && isCurrRead ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => {
                                removeFromCurrRead(book.id);
                                setIsCurrRead(false);
                            }}>
                                <span>Remove Currently Reading</span>
                            </Button>
                        ) : (
                            book && (
                                <Button variant="outlined" className="generalButton" onClick = {() => {
                                    addToCurrRead(book);
                                    setIsCurrRead(true);
                                }}>
                                    <span>Currently Reading</span>
                                </Button>
                            )
                        )}
                        {book && isDrop ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => {
                                removeFromDropped(book.id);
                                setIsDrop(false);
                            }}>
                                <span>Remove Dropped</span>
                            </Button>
                        ) : (
                            book && (
                                <Button variant="outlined" className="generalButton" onClick = {() => {
                                    addToDropped(book);
                                    setIsDrop(true);
                                }}>
                                    <span>Dropped</span>
                                </Button>
                            )
                        )}
                        {book && isWish ? (
                            <Button variant="outlined" className="generalButton" onClick = {() => {
                                removeFromWishlist(book.id);
                                setIsWish(false);
                            }}>
                                <span>Remove Wishlist</span>
                            </Button>
                        ) : (
                            book && (
                                <Button variant="outlined" className="generalButton" onClick = {() => {
                                    addToWishlist(book);
                                    setIsWish(true);
                                }}>
                                    <span>Wishlist</span>
                                </Button>
                            )
                        )}
                    </div>
                    <Button variant="contained" className="backButton" onClick={() => navigate(-1)}>
                        <span>Go Back</span>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default BookDetails