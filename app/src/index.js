require('./tracing')
const express = require('express')
const {MongoClient} = require('mongodb')
const app = express()
const port = 4000

const client = new MongoClient(process.env.DATABASE_URL, {
	useUnifiedTopology: true,
});

client.connect().then(client => {
	const db = client.db()
	const collection = db.collection("collection");

	app.get('/', (req, res) => {
		res.send('Hello World!')
	})

	app.get('/mongo', (req, res) => {
		collection
			.find({}, {})
			.toArray().then(results => {
			res.send(results)
		});
	})

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
})
