"use server";

import { getDb } from "../../lib/mongodb";

export default async function submit(suggestedTopic) {
    const db = await getDb();
    const suggestions = db.collection("suggestions");

    suggestions.insertOne({
        suggestedTopic: suggestedTopic,
        dateCreated: new Date()
    });
}