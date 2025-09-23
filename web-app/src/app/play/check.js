"use server";

import { getDb } from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function check(groupId, submitedText, confidenceLevel) {
    const db = await getDb();
    const texts = db.collection("texts");
    const entry = await texts.findOne({ _id: new ObjectId(groupId) });

    const answers = db.collection("answers");
    await answers.insertOne({
        groupId: new ObjectId(groupId),
        answeredText: submitedText,
        confidenceLevel: confidenceLevel,
        correct: entry.AISummary === submitedText,
        timestamp: new Date()
    });

    if (!entry) {
        throw new Error("Entry not found");
    }

    if (entry.AISummary === submitedText) {
        const jsonResponse = {
            won: true,
            entry: JSON.parse(JSON.stringify(entry))
        }

        return jsonResponse;
    } else {
        const jsonResponse = {
            won: false,
            entry: JSON.parse(JSON.stringify(entry))
        }

        return jsonResponse;
    }
}