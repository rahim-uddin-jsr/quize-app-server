const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const { ObjectId } = require("bson");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vt0qgrn.mongodb.net/?retryWrites=true&w=majority`;

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
    const quizApp = client.db("quizApp");
    const questionCollection = quizApp.collection("questionCollection");
    app.get("/questions", async (req, res) => {
      const result = await questionCollection.find().toArray();
      res.send(result);
    });
    app.put("/questions/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const question = req.body.question;
      const options = req.body.options;
      const correctAnswer = req.body.correctAnswer;
      const updateDoc = {
        $set: {
          question,
          options,
          correctAnswer,
        },
      };

      const result = await questionCollection.updateOne(filter, updateDoc, {
        upsert: false,
      });
      console.log(result);
      res.send(result);
    });
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
  res.send("Quiz app Api running");
});

app.listen(port, () => {
  console.log("quiz app server run on port=", port);
});
