import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';       //parses through all the rec.body we get from frontend
import cookieParser from 'cookie-parser';   //parse all the cookies we have
import session from 'express-session';      //creating our sessions and maintaining them
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
const saltRounds = 10;

const app = express();

dotenv.config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true       //allows cookies to be enabled
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userId",     //name of the cookie you'll create
    secret: "illhaveabetteridealater",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24     //will expire in a day;
    },
}))

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "42786945!!",
//     database: "Login"
// })

const PORT = process.env.PORT || 3000

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME_,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get("/", (req, res) => {
    res.json("RAHHHHHHHHHH why you tryna look into the backend huh? Get outta here")
})


//LOGIN/REGISTER STUFF
app.post("/register", (req, res) => {       //adds full name, username, and password into MySQL database
    const fullName = req.body.fullName;
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) {
            console.log(err);
        }
        db.query(
            "SELECT * FROM Accounts WHERE username = ?",        //is this username already in our database?
            [username],
            (err, result) => {
                if (err){
                    res.status(500).send({error: "Database error"});
                    console.log(err);
                }
                if (result.length > 0){         //if username in database...
                    res.status(200).send({message: "Username already taken"});
                } else {        //if username not in database...
                    db.query(
                        "INSERT INTO Accounts (fullName, username, password) VALUES (?,?,?)",
                        [fullName, username, hash],
                        (err, result) => {
                            if (err){
                                res.status(500).send({error: "Database error"});
                                console.log(err);
                            } else {
                                res.status(200).send({message: "User registered successfully"});
                            }
                        }
                    )
                }
        });
    })
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token){
        res.send("We need a token, dummy.");
    } else{
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.json({auth: false, message: "You failed to authenticate LOSER"});
            } else{
                req.userId = decoded.id;        //saves the token
                next();
            }
        });
    }
};

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("You're authenticated! LETSGOOOOO");
});

app.get("/login", (req, res) => {
    if (req.session.user){      //if there's a user req already created in our server...
        res.send({loggedIn: true, user: req.session.user});
    } else{
        res.send({loggedIn: false});
    }
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query(
        "SELECT * FROM Accounts WHERE username = ?;",
        username,
        (err, result) => {
            if (err){
                res.send({err: err});       //if there's an error, it'll send the error and if not, it'll skip this and go down
            }
            if (result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response){      //if password correct...
                        const id = result[0].ID;     //works because there is only ONE user/pass combination that should work
                        const token = jwt.sign({id}, "jwtSecret", {     //switch out jwtSecret for a .env file later on 
                            expiresIn: 300,     //expires in 5 mins
                        })
                        req.session.user = result;       //sets the session as the result (fullName)
                        res.json({auth: true, token: token, userId: result[0].ID, username: result[0].username, result: result});
                    } else {
                        res.json({auth: false, message: "Wrong username/password combination"});
                    }
                });
            } else {
                res.json({auth: false, message: "No user exists"});
            }
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({message: "Log out failed"});
        }
    });
        res.clearCookie("userId", {path: '/'});
        res.json({ message: "Logged out" });
});

//READS LIST
//Adding to Reads List
app.post('/api/read', (req, res) => {
    const {userId, book} = req.body;

    db.query('SELECT book_ID FROM Books WHERE book_ID = ?', [book.id], (err, existingBook) => {
        if (err){
            console.error(err);
            return res.status(500).send({message: "Database error"});
        }
        if (existingBook.length === 0) {
            db.query('INSERT INTO Books(book_ID, title, author, edition_count, first_publish_year, cover_img) VALUES(?, ?, ?, ?, ?, ?)',
                [book.id, book.title, book.author, book.edition_count, book.first_publish_year, book.cover_img],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Books table"});
                    }
                    db.query('INSERT INTO ReadBooks(user_ID, book_ID) VALUES(?, ?)',
                        [userId, book.id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send({message: "Failed to add book to Reads List"});
                            }
                            res.status(201).send({message: 'Book added to Reads List'});
                        }
                    );
                }
            );
        } else {
            db.query('INSERT INTO ReadBooks (user_ID, book_ID) VALUES(?, ?)',
                [userId, book.id],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Reads List"});
                    }
                    res.status(201).send({message: 'Book added to Reads List'});
                }
            );
        }
    });
});

//Deleting from reads list
app.delete('/api/read', (req, res) => {
    const {userId, book} = req.body;
    db.query('DELETE FROM ReadBooks WHERE user_ID = ? AND book_ID = ?',
        [userId, book.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to remove book from Reads List"});
            }
            res.send({message: 'Book removed from Reads List'});
        }
    );
});

//Getting all books from Reads List
app.get('/api/read/:userId', async (req, res) => {
    const {userId} = req.params;

    db.query(
        'SELECT Books.book_ID AS id, Books.* FROM Books INNER JOIN ReadBooks ON Books.book_ID = ReadBooks.book_ID WHERE ReadBooks.user_ID = ?',
        [userId],
        (err, books) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to retrieve Reads List"});
            }
            res.send(books);
        }
    );
});

//Getting one book from Reads List
const queryDb = (query, params) => new Promise((resolve, reject) => {
    db.query(query, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
    });
});

app.get('/api/checkRead/:userId/:bookId', async (req, res) => {
    const {userId, bookId} = req.params;
    try {
        const rows = await queryDb(
            'SELECT COUNT(*) as count FROM ReadBooks WHERE user_ID = ? AND book_ID = ?',
            [userId, bookId]
        );
        const isRead = rows[0].count > 0;
        res.json({isRead});
    } catch (error) {
        res.status(500).json({error: 'Database query failed'});
    }
});

//CURRREADS LIST
//Adding to CurrReads List
app.post('/api/currRead', (req, res) => {
    const {userId, book} = req.body;

    db.query('SELECT book_ID FROM Books WHERE book_ID = ?', [book.id], (err, existingBook) => {
        if (err){
            console.error(err);
            return res.status(500).send({message: "Database error"});
        }
        if (existingBook.length === 0) {
            db.query('INSERT INTO Books(book_ID, title, author, edition_count, first_publish_year, cover_img) VALUES(?, ?, ?, ?, ?, ?)',
                [book.id, book.title, book.author, book.edition_count, book.first_publish_year, book.cover_img],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Books table"});
                    }
                    db.query('INSERT INTO CurrReadBooks(user_ID, book_ID) VALUES(?, ?)',
                        [userId, book.id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send({message: "Failed to add book to Current Reads List"});
                            }
                            res.status(201).send({message: 'Book added to Current Reads List'});
                        }
                    );
                }
            );
        } else {
            db.query('INSERT INTO CurrReadBooks (user_ID, book_ID) VALUES(?, ?)',
                [userId, book.id],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Current Reads List"});
                    }
                    res.status(201).send({message: 'Book added to Current Reads List'});
                }
            );
        }
    });
});

//Deleting from CurrReads list
app.delete('/api/currRead', (req, res) => {
    const {userId, book} = req.body;
    db.query('DELETE FROM CurrReadBooks WHERE user_ID = ? AND book_ID = ?',
        [userId, book.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to remove book from Current Reads List"});
            }
            res.send({message: 'Book removed from Current Reads List'});
        }
    );
});

//Getting all books from CurrReads List
app.get('/api/currRead/:userId', async (req, res) => {
    const {userId} = req.params;

    db.query(
        'SELECT Books.book_ID AS id, Books.* FROM Books INNER JOIN CurrReadBooks ON Books.book_ID = CurrReadBooks.book_ID WHERE CurrReadBooks.user_ID = ?',
        [userId],
        (err, books) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to retrieve CurrReads List"});
            }
            res.send(books);
        }
    );
});

//Getting one book from CurrReads List
const queryCurrDb = (query, params) => new Promise((resolve, reject) => {
    db.query(query, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
    });
});

app.get('/api/checkCurrRead/:userId/:bookId', async (req, res) => {
    const {userId, bookId} = req.params;
    try {
        const rows = await queryCurrDb(
            'SELECT COUNT(*) as count FROM CurrReadBooks WHERE user_ID = ? AND book_ID = ?',
            [userId, bookId]
        );
        const isCurrRead = rows[0].count > 0;
        res.json({isCurrRead});
    } catch (error) {
        res.status(500).json({error: 'Database query failed'});
    }
});

//DROPPEDBOOKS LIST
//Adding to DROPPEDBOOKS List
app.post('/api/droppedBooks', (req, res) => {
    const {userId, book} = req.body;

    db.query('SELECT book_ID FROM Books WHERE book_ID = ?', [book.id], (err, existingBook) => {
        if (err){
            console.error(err);
            return res.status(500).send({message: "Database error"});
        }
        if (existingBook.length === 0) {
            db.query('INSERT INTO Books(book_ID, title, author, edition_count, first_publish_year, cover_img) VALUES(?, ?, ?, ?, ?, ?)',
                [book.id, book.title, book.author, book.edition_count, book.first_publish_year, book.cover_img],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Books table"});
                    }
                    db.query('INSERT INTO DroppedBooks(user_ID, book_ID) VALUES(?, ?)',
                        [userId, book.id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send({message: "Failed to add book to Dropped Reads List"});
                            }
                            res.status(201).send({message: 'Book added to Dropped Reads List'});
                        }
                    );
                }
            );
        } else {
            db.query('INSERT INTO DroppedBooks (user_ID, book_ID) VALUES(?, ?)',
                [userId, book.id],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Dropped Reads List"});
                    }
                    res.status(201).send({message: 'Book added to Dropped Reads List'});
                }
            );
        }
    });
});

//Deleting from DroppedBooks list
app.delete('/api/droppedBooks', (req, res) => {
    const {userId, book} = req.body;
    db.query('DELETE FROM DroppedBooks WHERE user_ID = ? AND book_ID = ?',
        [userId, book.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to remove book from Dropped Reads List"});
            }
            res.send({message: 'Book removed from Dropped Reads List'});
        }
    );
});

//Getting all books from DroppedBooks List
app.get('/api/droppedBooks/:userId', async (req, res) => {
    const {userId} = req.params;

    db.query(
        'SELECT Books.book_ID AS id, Books.* FROM Books INNER JOIN DroppedBooks ON Books.book_ID = DroppedBooks.book_ID WHERE DroppedBooks.user_ID = ?',
        [userId],
        (err, books) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to retrieve Dropped Reads List"});
            }
            res.send(books);
        }
    );
});

//Getting one book from DroppedBooks List
const queryDropDb = (query, params) => new Promise((resolve, reject) => {
    db.query(query, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
    });
});

app.get('/api/checkDroppedBooks/:userId/:bookId', async (req, res) => {
    const {userId, bookId} = req.params;
    try {
        const rows = await queryDropDb(
            'SELECT COUNT(*) as count FROM DroppedBooks WHERE user_ID = ? AND book_ID = ?',
            [userId, bookId]
        );
        const isDrop = rows[0].count > 0;
        res.json({isDrop});
    } catch (error) {
        res.status(500).json({error: 'Database query failed'});
    }
});

//WISHLISTBOOKS LIST
//Adding to WISHLISTBOOKS List
app.post('/api/wishlistBooks', (req, res) => {
    const {userId, book} = req.body;

    db.query('SELECT book_ID FROM Books WHERE book_ID = ?', [book.id], (err, existingBook) => {
        if (err){
            console.error(err);
            return res.status(500).send({message: "Database error"});
        }
        if (existingBook.length === 0) {
            db.query('INSERT INTO Books(book_ID, title, author, edition_count, first_publish_year, cover_img) VALUES(?, ?, ?, ?, ?, ?)',
                [book.id, book.title, book.author, book.edition_count, book.first_publish_year, book.cover_img],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Books table"});
                    }
                    db.query('INSERT INTO WishlistBooks(user_ID, book_ID) VALUES(?, ?)',
                        [userId, book.id],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send({message: "Failed to add book to  Wishlist"});
                            }
                            res.status(201).send({message: 'Book added to Wishlist'});
                        }
                    );
                }
            );
        } else {
            db.query('INSERT INTO WishlistBooks (user_ID, book_ID) VALUES(?, ?)',
                [userId, book.id],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({message: "Failed to add book to Wishlist"});
                    }
                    res.status(201).send({message: 'Book added to Wishlist'});
                }
            );
        }
    });
});

//Deleting from WishlistBooks list
app.delete('/api/wishlistBooks', (req, res) => {
    const {userId, book} = req.body;
    db.query('DELETE FROM WishlistBooks WHERE user_ID = ? AND book_ID = ?',
        [userId, book.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to remove book from Wishlist"});
            }
            res.send({message: 'Book removed from Wishlist'});
        }
    );
});

//Getting all books from DroppedBooks List
app.get('/api/wishlistBooks/:userId', async (req, res) => {
    const {userId} = req.params;

    db.query(
        'SELECT Books.book_ID AS id, Books.* FROM Books INNER JOIN WishlistBooks ON Books.book_ID = WishlistBooks.book_ID WHERE WishlistBooks.user_ID = ?',
        [userId],
        (err, books) => {
            if (err) {
                console.error(err);
                return res.status(500).send({message: "Failed to retrieve Wishlist"});
            }
            res.send(books);
        }
    );
});

//Getting one book from CurrReads List
const queryWishDb = (query, params) => new Promise((resolve, reject) => {
    db.query(query, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
    });
});

app.get('/api/checkWishlistBooks/:userId/:bookId', async (req, res) => {
    const {userId, bookId} = req.params;
    try {
        const rows = await queryWishDb(
            'SELECT COUNT(*) as count FROM WishlistBooks WHERE user_ID = ? AND book_ID = ?',
            [userId, bookId]
        );
        const isWish = rows[0].count > 0;
        res.json({isWish});
    } catch (error) {
        res.status(500).json({error: 'Database query failed'});
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});

// app.listen(3500, () =>{     //3001 because port 3000 is taken by client
//     console.log("Server is running on port 3500");
// });