"use server";

import { getDb } from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from 'next/headers'

export default async function check(groupId, submitedText, confidenceLevel) {
    const cookieStore = await cookies()
    const currentLevel = parseInt(cookieStore.get('level')?.value) || 1

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
        return {
            won: true,
            entry: JSON.parse(JSON.stringify(entry))
        }
    } else {
        return {
            won: false,
            entry: JSON.parse(JSON.stringify(entry))
        }
    }
}