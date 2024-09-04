const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
	{ id: 1, username: "user_1", password: "pwd_1" },
	{ id: 2, username: "user_2", password: "pwd_2" },
];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	if (users.find((user) => user.username === username)) {
		return true;
	} else {
		return false;
	}
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let usersObject = Object.values(users);
	let user = usersObject.find((b) => b.username == username);

	if (user) {
		if (users.password === password) {
			return true;
		}
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Both username and password are required" });
	}

	if (!isValid(username)) {
		return res.status(400).json({ message: "Username is not valid" });
	}

	const user = users.find((user) => user.username === username);
	if (username === user.username && password === user.password) {
		const accessToken = jwt.sign(
			{ username, userPassword: password },
			"fingerprint_customer",
			{ expiresIn: "1h" }
		);

		// Store the access token in the session
		req.session.accessToken = accessToken;
		req.session.username = username;

		return res.status(200).json({ message: "Login successful", accessToken });
	} else {
		return res.status(401).json({ message: "Invalid username or password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	const isbn = req.params.isbn;
	const review = req.body.review;
	const username = req.session.username;
	let booksObject = Object.values(books);
	const book = booksObject.find((book) => book.isbn == isbn);

	if (!book) {
		res.status(404).send("You have entered and invalid ISBN");
		return;
	}

	// If the user already posted a review for this book, modify the existing review
	if (book.reviews[username]) {
		book.reviews[username] = review;
		//res.json('Your review has been updated for the book with ISBN ' + isbn + ':'+ `${book}`);
		res.json(
			`Your review has been updated for the book ${book.title} by ${
				book.author
			} with ISBN ${isbn}: ==>${JSON.stringify(book)}`
		);

		return;
	}

	// If the user didn't post a review for this book, add a new review
	book.reviews[username] = review;
	//res.send('Your review has been posted for the book with ISBN ' + isbn + ':'+ `${book}`);
	res.json(
		`Your review has been posted for the book ${book.title} by ${
			book.author
		} with ISBN ${isbn}: ==>${JSON.stringify(book)}`
	);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	//Write your code here
	const isbn = req.params.isbn;
	const username = req.session.username;
	let booksObject = Object.values(books);
	const book = booksObject.find((book) => book.isbn == isbn);
	const review = book.reviews[username];

	console.log(review);

	if (!book) {
		res.status(404).send("You have entered and invalid ISBN");
		return;
	}

	if (!book.reviews[username]) {
		res
			.status(404)
			.send(
				`No reivew mathing your username and ISBN  ${isbn}: ==>${JSON.stringify(
					book
				)}`
			);
		return;
	}

	// If the user didn't post a review for this book, add a new review
	delete book.reviews[username];
	//res.send('Your review has been posted for the book with ISBN ' + isbn + ':'+ `${book}`);
	res.json(
		`Your review has been deletedfor the book ${book.title} by ${
			book.author
		} with ISBN ${isbn}: ==>${JSON.stringify(book)}`
	);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
