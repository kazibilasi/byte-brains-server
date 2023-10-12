const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const blogCollection = client.db('byte-brains').collection('blog')


    app.get('/allToys', async (req, res) => {
      const query = req.query.sort
      const sort = query=== 'acc'? {price:1} : {price:-1} 
      const result = await allToys.find().sort(sort).toArray()
      res.send(result)
    })
    app.post('/allToys', async (req, res) => {
      const toy = req.body;
      const result = await allToys.insertOne(toy)
      res.send(result)
    })

    app.put('/updateToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = {
        upsert: true

      }
      const updateToy = req.body;
      console.log(updateToy)
      const toy = {
        $set: {
          toyName: updateToy.toyName,
          sellerEmail: updateToy.sellerEmail,
          sellerName: updateToy.sellerName,
          subcategory: updateToy.category,
          availableQuantity: parseFloat(updateToy.quantity),
          productDetails: updateToy.toyDetails,
          toyImage: updateToy.image,
          price: parseFloat(updateToy.price),
          size: updateToy.size,
          color: updateToy.color

        }
      }
      const result = await allToys.updateOne(filter, toy, options)
      res.send(result)
    })
    app.get('/blogs', async (req, res) => {
      const result = await blogCollection.find().toArray()
      res.send(result)
    })
    app.delete('/my-toys/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allToys.deleteOne(query)
      res.send(result)
    })
    // *********
    app.get('/specificUser', async (req, res) => {
      let query = {}
      if (req?.query?.sellerEmail) {
        query = { sellerEmail: req?.query?.sellerEmail }

      }
      const result = await allToys.find(query).toArray()
      res.send(result)
    })

    app.get('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToys.findOne(query)
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