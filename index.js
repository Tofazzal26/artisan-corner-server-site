// Artisan-Corner
// EBlHbePDDn9Kqaf5
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = (process.env.PORT = 3000);
var cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Artisan-Corner:EBlHbePDDn9Kqaf5@cluster0.rgxjhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri =
//   "mongodb+srv://<username>:<password>@cluster0.rgxjhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const artisanCollection = client.db("artisansDB").collection("artisans");
    const categoryCollection = client
      .db("artisansDB")
      .collection("category_collection");

    app.post("/artisans", async (req, res) => {
      const addArtist = req.body;
      const result = await artisanCollection.insertOne(addArtist);
      res.send(result);
    });

    app.get("/category_collection", async (req, res) => {
      const getArtisans = categoryCollection.find();
      const result = await getArtisans.toArray();
      res.send(result);
    });

    app.get("/artisans", async (req, res) => {
      const getArtisans = artisanCollection.find();
      const result = await getArtisans.toArray();
      res.send(result);
    });

    app.get("/artisans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artisanCollection.findOne(query);
      res.send(result);
    });

    app.delete("/artisans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artisanCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/artisans/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateArtisan = req.body;
      const artisans = {
        $set: {
          itemName: updateArtisan.itemName,
          imageURL: updateArtisan.imageURL,
          subcategory_name: updateArtisan.subcategory_name,
          description: updateArtisan.description,
          rating: updateArtisan.rating,
          price: updateArtisan.price,
          Processing_Time: updateArtisan.Processing_Time,
          customization: updateArtisan.customization,
          stockStatus: updateArtisan.stockStatus,
        },
      };
      const result = await artisanCollection.updateOne(
        filter,
        artisans,
        options
      );
      res.send(result);
    });

    app.get("/artisans_email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { NewEmail: email };
      const result = await artisanCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/categoryCollection/:subcategory_name", async (req, res) => {
      const category = req.params.subcategory_name;
      const query = { subcategory_name: category };
      const result = await artisanCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Artisan Server Is Running");
});

app.listen(port, () => {
  console.log(`Artisan Server Is Ready To Use ${port}`);
});
