import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import coverImg from "../cover_not_found.jpg";
import Button from '@mui/material/Button';
import './BookDetails.css';

const URL = "https://openlibrary.org/works/";

const BookDetails = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

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
                        <span>{book?.description}</span>
                    </div>
                    <div className="book_subject_places">
                        <span>Subject Places: </span>
                        <span>{book?.subject_places}</span>
                    </div>
                    <div className="book_subject_times">
                        <span>Subject Times: </span>
                        <span>{book?.subject_times}</span>
                    </div>
                    <div className="subjects">
                        <span>Subjects: </span>
                        <span>{book?.subject}</span>
                    </div>
                </div>
            </div>
            <Button variant="contained" className="backButton" onClick={() => navigate("/book")}>
                    <span>Go Back</span>
            </Button>
        </section>


        // <section className="bookDetails">
        //     <div>
                // <Button variant="contained" className="backButton" onClick={() => navigate("/book")}>
                //     <span>Go Back</span>
                // </Button>
        //         <div>
        //             <div className="book_cover">
        //                 <img src={book?.cover_img} alt = "cover img" />
        //             </div>
        //             <div>
        //                 <div>
        //                     <span>{book?.title}</span>
        //                 </div>
        //                 <div>
        //                     <span>{book?.description}</span>
        //                 </div>
        //                 <div>
        //                     <span>Subject Places: </span>
        //                     <span>{book?.subject_places}</span>
        //                 </div>
        //                 <div>
        //                     <span>Subject Times: </span>
        //                     <span>{book?.subject_times}</span>
        //                 </div>
        //                 <div>
        //                     <span>Subjects: </span>
        //                     <span>{book?.subjects}</span>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </section>
    )
}

export default BookDetails