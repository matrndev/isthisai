import getWikiSummary from "./getWikiSummary.js";
import getAISummary from "./getAISummary.js"
import express from "express";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env['OPENAI_TOKEN']
});
const app = express();
const PORT = process.env.PORT || 3000;

const allModels = await client.models.list();
const modelList = {
    data: allModels.data.filter(model => (model.id.match(/-/g) || []).length <= 2)
};

app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use('/node_modules/bootstrap/dist/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/node_modules/bootstrap/dist/js', express.static('node_modules/bootstrap/dist/js'));


app.get("/", async (req, res) => {
    /*const wikiSummary = await getWikiSummary(topic);
    const AISummary = await getAISummary(topic);*/
    const wikiSummary = undefined;
    const AISummary = undefined;
    res.render("index", {
        topic: "",
        wikiSummary,
        AISummary,
        models: modelList.data,
        message: ""
    });
});

app.get("/create", (req, res) => {
    res.redirect("/");
});

app.post("/create", async (req, res) => {
    let message = "";
    const topic = req.body.topic;
    const model = req.body.model;
    const wikiSummary = await getWikiSummary(topic);
    if (!wikiSummary) {
        message = "No Wikipedia summary found for the topic.";
        return res.render("index", {
            topic,
            wikiSummary: "",
            AISummary: "",
            models: modelList.data,
            currentModel: model,
            message
        });
    }
    const AISummary = await getAISummary(wikiSummary.title, model);
    res.render("index", {
        topic: wikiSummary.title,
        wikiSummary: wikiSummary.extract,
        AISummary,
        models: modelList.data,
        currentModel: model,
        message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});