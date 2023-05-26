const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rezoanshawon:W6FSkFiYyX8jR7Go@cluster0.smadxws.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("CarDoctor");
    const Product = database.collection("Product");
    const orderCollection = client
      .db("CarDoctor")
      .collection("orderCollection");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = Product.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const services = await Product.findOne(query);
      res.send(services);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
      console.log(result);
    });

    app.get("/ordersinfo", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = orderCollection.find(query);
      const orderinfo = await cursor.toArray();
      res.send(orderinfo);
    });

    app.delete("/orderdelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 80");
});
