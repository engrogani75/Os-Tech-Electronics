const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.port || 5000;

const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
  app.use(cors(corsConfig))


app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d33r4qq.mongodb.net/?retryWrites=true&w=majority`;

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

    const technologyCollection = client.db("technologyDB");
    const technology = technologyCollection .collection("technology");
    const brandName = technologyCollection.collection("brandName")
    const addToCard = technologyCollection.collection("AddToCard")
    const user = technologyCollection.collection("user")
  
   
    // await client.connect();
    // Send a ping to confirm a successful connection

    app.post('/product', async (req, res) =>{
      const newProduct = req.body;
      console.log(newProduct);
     
      const result = await technology.insertOne(newProduct);
      res.send(result)
    })

    app.post('/brands', async (req, res) =>{
      const brands = req.body;
      console.log(brands);
     
      const result = await brandName .insertOne(brands);
      res.send(result)
    })

    app.post('/addtocart', async(req, res) =>{
      const addTOcardData = req.body;
      console.log(addTOcardData);
      const result = await addToCard.insertOne(addTOcardData)
      res.send(result )
    })

    app.post('/users', async(req, res) =>{
      const users = req.body;
      console.log(users);
      const result = await user.insertOne(users)
      res.send(result )
    })



    app.put('/update/:id', async(req, res) =>{
      const id = req.params.id
      const product = req.body;
      console.log(id, product);

      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateProduct = {
        $set: {
          image: product.image,
          name: product.name,
          brandName: product.brandName,
          type: product.type,
          price: product.price,
          rating: product.rating
        }
      }

      const result = await technology.updateOne(filter, updateProduct, options)
      res.send(result)
    })


    app.get('/product', async(req, res) =>{
      const cursor = technology.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/brands', async(req, res) =>{
      const cursor = brandName.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/brands/:brandName', async(req, res) =>{
      const reqbrandName = req.params.brandName;
      const query = { brandName: reqbrandName };
      const result = await technology.find(query).toArray(); 
      console.log(result);
      res.send(result);
    })

    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await technology.findOne(query)
      res.send(result)
    })


    app.get('/my-cart', async(req, res) =>{
      const cursor = addToCard.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/users', async(req, res) =>{
      const cursor = user.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/users/:email', async(req, res) =>{
      const reqEmail = req.params.email;
      const query = { email: reqEmail };
      const result = await user.find(query).toArray(); 
      console.log(result);
      res.send(result);
    })

  

    app.delete('/my-cart/:id', async(req, res) => {
      const id =req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await addToCard .deleteOne(query);
      res.send(result)
     
    })


    



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})