const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// Middlewere 

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1rrt8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodKang");
        const itemsCollection = database.collection("items");

        // Post API 
        app.post('/items', async (req, res) => {
            const item = req.body;
            const result = await itemsCollection.insertOne(item);
            console.log(result);
            res.json(result);
        })
        // Get API
        app.get('/items', async (req, res) => {
            const cursor = itemsCollection.find({});
            const items = await cursor.toArray();
            res.send(items);
        });

        // GET selected item
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting a item', id);
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.json(item);
        })
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);


//APP Get 
app.get('/', (req, res) => {
    res.send('Bismillah')
});
app.listen(port, () => {
    console.log('Alhamduliia', port)
})