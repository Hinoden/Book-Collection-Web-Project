import React, {useState, useContext, useEffect} from 'react';
import {useCallback} from 'react';

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

                if (newBooks.length > 1){
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

    const addToCurrRead = (book) => {
        const oldCurrRead = [...currRead];
        const newCurrRead = oldCurrRead.concat(book);

        setCurrRead(newCurrRead);
    };

    const removeFromCurrRead = (id) => {
        const oldCurrRead = [...currRead];
        const newCurrRead = oldCurrRead.filter((book) => book.id !== id);

        setCurrRead(newCurrRead);
    };

    const addToRead = (book) => {
        const oldRead = [...read];
        const newRead = oldRead.concat(book);

        setRead(newRead);
    };

    const removeFromRead = (id) => {
        const oldRead = [...read];
        const newRead = oldRead.filter((book) => book.id !== id);

        setRead(newRead);
    };

    const addToDropped = (book) => {
        const oldDroppedRead = [...dropped];
        const newDroppedRead = oldDroppedRead.concat(book);

        setDropped(newDroppedRead);
    };

    const removeFromDropped = (id) => {
        const oldDroppedRead = [...dropped];
        const newDroppedRead = oldDroppedRead.filter((book) => book.id !== id);

        setDropped(newDroppedRead);
    };

    const addToWishlist = (book) => {
        const oldWishlistRead = [...wishlisted];
        const newWishlistRead = oldWishlistRead.concat(book);

        setWishlisted(newWishlistRead);
    };

    const removeFromWishlist = (id) => {
        const oldWishlistRead = [...wishlisted];
        const newWishlistRead = oldWishlistRead.filter((book) => book.id !== id);

        setWishlisted(newWishlistRead);
    };

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);

    return(
        <AppContext.Provider value = {{
            currRead, addToCurrRead, removeFromCurrRead, read, addToRead, removeFromRead, dropped, addToDropped, removeFromDropped, wishlisted, addToWishlist, removeFromWishlist, loading, books, setSearchTerm, resultTitle, setResultTitle
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export {AppContext, AppProvider};