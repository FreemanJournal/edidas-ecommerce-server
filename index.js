require('dotenv').config()
const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// mongo database configuration

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w0pil.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const productCollection = client.db("edidasEcommerce").collection("productData");
        app.get('/product', async (req, res) => {
            const { page, size } = req.query;
            const cursor = productCollection.find({});
            const count = await productCollection.estimatedDocumentCount();
            const products = await cursor.skip((+page * +size)).limit(+size).toArray();
            // const count = products.length;
            res.send({ products, count })
        })
        app.post('/productById', async (req, res) => {
            const localId = req.body
            const serverId = localId?.map(id => ObjectId(id))
            const cursor = productCollection.find({ _id: { $in: serverId } })
            const result = await cursor.toArray()
            res.send(result)
        })

    } finally {

    }
}

run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('Hello Mom')
// })

app.listen(port)