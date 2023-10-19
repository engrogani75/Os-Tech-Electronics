const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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
  
   
    await client.connect();
    // Send a ping to confirm a successful connection

    app.post('/product', async (req, res) =>{
      const newProduct = req.body;
      console.log(newProduct);
     
      const result = await technology.insertOne(newProduct);
      res.send(result)
    })


    app.get('/product', async(req, res) =>{
      const cursor = technology.find();
      const result = await cursor.toArray();
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