import React, {useState, useContext, useEffect, useCallback} from 'react';
import axios from 'axios';

const URL = "https://openlibrary.org/search.json?title=";
const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState("the lost world");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState("");
    const [currRead, setCurrRead] = useState([]);
    const [read, setRead] = useState([]);
    const [dropped, setDropped] = useState([]);
    const [wishlisted, setWishlisted] = useState([]);

    const userId = localStorage.getItem("userId");
    console.log("Context: userId: ", userId);

    const fetchBooks = useCallback(async() => {
        setLoading(true);
        try{
            const response = await fetch(`${URL}${searchTerm}`);
            const data = await response.json();
            console.log(data);
            const {docs} = data;
            
            if (docs){
                const newBooks = docs.slice(0, 20).map((bookSingle) => {
                    const {key, author_name, cover_i, edition_count, first_publish_year, title} = bookSingle;

                    return {
                        id: key,
                        author: author_name, 
                        cover_id: cover_i,
                        edition_count: edition_count,
                        first_publish_year: first_publish_year,
                        title: title
                    }
                });

                setBooks(newBooks);

                if (newBooks.length > 0){
                    setResultTitle("Your Search Results");
                } else {
                    setResultTitle("No Search Result Found!");
                }
            } else {
                setBooks([]);
                setResultTitle("No Search Result Found!");
            }
            setLoading(false);
        } catch (err){
            console.log(err);
            setLoading(false);
        }
    }, [searchTerm]);

    const addToCurrRead = async(book) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/currRead`, {
                userId: userId,
                book
            });
            setCurrRead(prevCurrRead => [...prevCurrRead, book]);
        } catch (error) {
            console.error("Error adding book to Current Read List: ", error);
        }
    };

    const removeFromCurrRead = async(id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/currRead`, {
                data: {
                    userId: userId,
                    book: {id: id}
                }
            });
            setCurrRead(prevCurrRead => prevCurrRead.filter(book => book.id !== id));
        } catch (error) {
            console.error("Error removing book from Current Read List: ", error);
        }
    };

    const addToRead = async(book) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/read`, {
                userId: userId,
                book
            });
            setRead(prevRead => [...prevRead, book]);
        } catch (error) {
            console.error("Error adding book to Read List: ", error);
        }
    };

    const removeFromRead = async(id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/read`, {
                data: {
                    userId: userId,
                    book: {id: id}
                }
            });
            setRead(prevRead => prevRead.filter(book => book.id !== id));
        } catch (error) {
            console.error("Error removing book from Read List: ", error);
        }
    };

    const addToDropped = async(book) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/droppedBooks`, {
                userId: userId,
                book
            });
            setDropped(prevDropped => [...prevDropped, book]);
        } catch (error) {
            console.error("Error adding book to Dropped Read List: ", error);
        }
    };

    const removeFromDropped = async(id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/droppedBooks`, {
                data: {
                    userId: userId,
                    book: {id: id}
                }
            });
            setDropped(prevDropped => prevDropped.filter(book => book.id !== id));
        } catch (error) {
            console.error("Error removing book from Dropped Read List: ", error);
        }
    };

    const addToWishlist = async(book) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/wishlistBooks`, {
                userId: userId,
                book
            });
            setWishlisted(prevWishlisted => [...prevWishlisted, book]);
        } catch (error) {
            console.error("Error adding book to Wishlist: ", error);
        }
    };

    const removeFromWishlist = async(id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/wishlistBooks`, {
                data: {
                    userId: userId,
                    book: {id: id}
                }
            });
            setWishlisted(prevWishlisted => prevWishlisted.filter(book => book.id !== id));
        } catch (error) {
            console.error("Error removing book from Wishlist: ", error);
        }
    };

    // const addToWishlist = (book) => {
    //     const oldWishlistRead = [...wishlisted];
    //     const newWishlistRead = oldWishlistRead.concat(book);

    //     setWishlisted(newWishlistRead);
    // };

    // const removeFromWishlist = (id) => {
    //     const oldWishlistRead = [...wishlisted];
    //     const newWishlistRead = oldWishlistRead.filter((book) => book.id !== id);

    //     setWishlisted(newWishlistRead);
    // };

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);

    return(
        <AppContext.Provider value = {{
            userId, currRead, addToCurrRead, removeFromCurrRead, read, addToRead, removeFromRead, dropped, addToDropped, removeFromDropped, wishlisted, addToWishlist, removeFromWishlist, loading, books, setSearchTerm, resultTitle, setResultTitle
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export {AppContext, AppProvider};