const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://copyremc4:Df4xbW7l726d5643@cluster0.1o4t8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const FoodBuzzCollection = client.db('FoodStation').collection('Items');
        const CartCollection = client.db('FoodStation').collection('carts');
        //   show fooooood
        app.post('/Items', async (req, res) => {
            const newItems = req.body;
            const result = await FoodBuzzCollection.insertOne(newItems);
            res.send(result);
        })
        app.get('/Items', async (req, res) => {
            const cursor = FoodBuzzCollection.find();
            const result = await cursor.toArray()
            res.send(result);
        })
        // carts CartCollection
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await CartCollection.find(query).toArray();
            res.send(result);
        });
        // add card 
        app.post('/carts', async (req, res) => {
            const cartItems = req.body;
            const result = await CartCollection.insertOne(cartItems);
            res.send(result);
        })
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await CartCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("FoodStation is Runing")
})

app.listen(port, () => {
    console.log(`FoodStation ins running, ${port}`)
})