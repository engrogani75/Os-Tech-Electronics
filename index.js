const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.port || 5000;


app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://technologyShop:QQ4XXyqD3Mbma26w@cluster0.d33r4qq.mongodb.net/?retryWrites=true&w=majority";

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
  
   
    await client.connect();
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