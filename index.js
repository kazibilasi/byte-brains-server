const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

// IWkNZiTeL8XYWqqO
// byte-brains



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.xemmjwp.mongodb.net/?retryWrites=true&w=majority`;

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

    const allToys = client.db('byte-brains').collection('all-toys')
    const userCollection = client.db('byte-brains').collection('users')


app.get('/allToys', async(req, res)=>{
    const result = await allToys.find().toArray()
    res.send(result)
})


app.post('/users', async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await userCollection.findOne(query)
  if (existingUser) {
    return res.send({ message: 'user already exists' })
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
})

app.get('/users', async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result)

})



    await client.connect();
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
    res.send('educational-toys-server')
  })
  
  app.listen(port, () => {
    console.log(`educational-toys-server ${port}`)
  })