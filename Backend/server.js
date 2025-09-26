import express from "express"
import cors from "cors"
import mysql from "mysql2"
import "dotenv/config"

const app = express()

const urlDb = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLDATABASE}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQL_DATABASE}`

const db = mysql.createConnection(urlDb)

app.use(express.json())
app.use(cors())
app.get("/", (req, res) => {
	res.json("This is backend")
})

app.get("/books", (req, res) => {
	const q = "SELECT * FROM books"
	db.query(q, (err, data) => {
		if (err) return res.json(err)
		return res.json(data)
	})
})

app.post("/books", (req, res) => {
	const q =
		"INSERT INTO books (`title`, `description`,`price`,`cover`) VALUES (?)"
	const values = [
		req.body.title,
		req.body.description,
		req.body.price,
		req.body.cover,
	]
	// const values = [
	// 	"title from backend",
	// 	"description from backend",
	// 	"cover pic from backend",
	// ]
	db.query(q, [values], (err, data) => {
		if (err) return res.json(err)
		return res.json(data)
		// return res.json("book ok")
	})
})

app.delete("/books/:id", (req, res) => {
	const bookId = req.params.id
	const q = "DELETE FROM books WHERE id=?"

	db.query(q, [bookId], (err, data) => {
		if (err) return res.json(err)
		return res.json("book has been deleted successfuly")
	})
})
app.put("/books/:id", (req, res) => {
	const bookId = req.params.id
	const q =
		"UPDATE books SET `title` = ?,`description` = ?,`price` = ?,`cover` = ? WHERE id = ?"
	console.log("put =", q)
	const values = [
		req.body.title,
		req.body.description,
		req.body.price,
		req.body.cover,
	]

	db.query(q, [...values, bookId], (err, data) => {
		if (err) return res.json(err)
		return res.json("book has been updated successfuly")
	})
})

const port = process.env.PORT || 8800
app.listen(port, () => {
	console.log(`Connected to backend ${port}`)
})
