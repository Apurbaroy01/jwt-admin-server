const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.User_DB}:${process.env.User_PASS}@cluster0.xgolbpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!✅");

        const userCollation = client.db("jwt_admin").collection("users");

        app.post('/user', async(req, res) => {
            const user = req.body;
            const result= await userCollation.insertOne(user)
            res.send(result)
        });
        app.get('/user', async(req, res) => {
            const result= await userCollation.find().toArray()
            res.send(result)
        });



    }
    catch (error) {
        console.error("Connection to MongoDB failed!❌", error);
    }
}
run();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
