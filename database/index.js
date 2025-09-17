import 'dotenv/config';
import getWikiSummary from "./getWikiSummary.js";
import getAISummary from "./getAISummary.js"
import express from "express";
import OpenAI from "openai";
import { MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import he from "he";

const client = new OpenAI({
  apiKey: process.env['OPENAI_TOKEN']
});
const mongoClient = new MongoClient(process.env['MONGODB_URI']);
const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const allModels = await client.models.list();
const modelList = {
    data: allModels.data.filter(model => (model.id.match(/-/g) || []).length <= 2)
};

const hcModelList = await fetch('https://ai.hackclub.com/model')
    .then(res => res.text())
    .then(text => text
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(id => ({ id }))
    )
    .catch(() => []);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use('/node_modules/bootstrap/dist/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/node_modules/bootstrap/dist/js', express.static('node_modules/bootstrap/dist/js'));

const database = mongoClient.db("isthisai");
const collection = database.collection("texts");

app.get("/", async (req, res) => {
    const wikiSummary = undefined;
    const AISummary = undefined;
    let modelOptions;
    const platform = req.query.platform;
    if (!platform || platform === "openai") {
        modelOptions = modelList.data;
    } else if (platform === "hc") {
        modelOptions = hcModelList;
    } else {
        modelOptions = modelList.data;
    }
    res.render("index", {
        topic: "",
        wikiSummary,
        AISummary,
        models: modelOptions,
        message: ""
    });
});

app.get("/create", (req, res) => {
    res.redirect("/");
});

app.post("/create", async (req, res) => {
    let modelOptions;
    const platform = req.query.platform;
    if (!platform || platform === "openai") {
        modelOptions = modelList.data;
    } else if (platform === "hc") {
        modelOptions = hcModelList;
    } else {
        modelOptions = modelList.data;
    }
    let message = "";
    const topic = req.body.topic;
    const model = req.body.model;
    const wikiSummary = await getWikiSummary(topic);
    if (!wikiSummary) {
        message = "No Wikipedia summary found for this topic.";
        return res.render("index", {
            topic,
            wikiSummary: "",
            wikiURL: "",
            AISummary: "",
            models: modelOptions,
            currentModel: model,
            message
        });
    }
    const AISummary = await getAISummary(wikiSummary.title, model, platform);
    res.render("index", {
        topic: wikiSummary.title,
        wikiSummary: wikiSummary.extract,
        wikiURL: wikiSummary.url,
        AISummary,
        models: modelOptions,
        currentModel: model,
        message
    });
});

app.post("/submit", async (req, res) => {
    let modelOptions;
    let platform = req.query.platform || "openai";
    if (!platform || platform === "openai") {
        modelOptions = modelList.data;
    } else if (platform === "hc") {
        modelOptions = hcModelList;
    } else {
        modelOptions = modelList.data;
    }
    const topic = he.decode(req.body.topic);
    const wikiSummary = he.decode(req.body.wikiSummary);
    const wikiURL = he.decode(req.body.wikiURL);
    const AISummary = he.decode(req.body.AISummary);
    const model = he.decode(req.body.model);

    if (!topic || !wikiSummary || !AISummary) {
        return res.render("index", {
            topic,
            wikiSummary: "",
            AISummary: "",
            models: modelOptions,
            currentModel: model,
            message: "Please fill in all fields."
        });
    }

    try {
        if (platform == "null") platform = "openai";
        await collection.insertOne({
            topic,
            wikiSummary,
            wikiURL,
            AISummary,
            model,
            platform,
            dateCreated: new Date()
        });
        res.redirect("/");
    } catch (error) {
        console.error("Error saving data:", error);
        res.render("index", {
            topic,
            wikiSummary,
            AISummary,
            wikiURL,
            models: modelOptions,
            currentModel: model,
            message: "Error saving data. Please try again."
        });
    }
});

app.get("/database", async (req, res) => {
    try {
        const documents = await collection.find({}).toArray();
        res.render("database", {
            documents,
            message: req.query.message || ""
        });
    } catch (error) {
        console.error("Error fetching database records:", error);
        res.render("database", {
            documents: [],
            message: "Error fetching database records."
        });
    }
});

app.post("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 1) {
            res.redirect("/database?message=Record deleted successfully");
        } else {
            res.redirect("/database?message=Record not found");
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        res.redirect("/database?message=Error deleting record");
    }
});

app.get("/details/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const document = await collection.findOne({ _id: new ObjectId(id) });
        
        if (!document) {
            return res.redirect("/database?message=Entry not found");
        }
        
        res.render("details", { document });
    } catch (error) {
        console.error("Error fetching entry details:", error);
        res.redirect("/database?message=Error fetching entry details");
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});