const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollation.insertOne(user)
            res.send(result)
        });

        app.get('/user', async (req, res) => {
            const result = await userCollation.find().toArray()
            res.send(result)
        });

        app.patch('/user/admin/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await userCollation.updateOne(filter, updateDoc);
            res.send(result)

        });


        app.get('/user/admin/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const user= await userCollation.findOne(query);
            let admin = false;
            if(user){
                admin= user.role === 'admin'
            }
            res.send({admin})
        })




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
