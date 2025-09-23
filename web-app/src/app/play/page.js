import { getDb } from "../../lib/mongodb";
import GameForm from "./GameForm.js";
import { cookies } from 'next/headers'
import Finish from "./Finish";

export default async function Play() {
    const cookieStore = await cookies()
    const currentLevel = parseInt(cookieStore.get('level')?.value) || 1
    const db = await getDb();
    const texts = db.collection("texts");
    const [ entry ] = await texts.aggregate([{ $sample: { size: 1 } }]).toArray();
    const correctAnswers = cookieStore.get('correctAnswerCount')?.value || "0";
    const levelFinished = cookieStore.get("levelFinished")?.value === "true";
    
    const random = Math.random();
    const selectedTexts = [];
    if (random < 0.5) {
        selectedTexts.push(entry.AISummary, entry.wikiSummary);
    } else {
        selectedTexts.push(entry.wikiSummary, entry.AISummary);
    }
    
    return (
        <main className="container mt-3">
            {(!levelFinished || currentLevel <= 5) && (
                <GameForm
                    text1={selectedTexts[0]}
                    text2={selectedTexts[1]}
                    groupId={entry._id.toString()}
                    topic={entry.topic}
                    currentLevel={currentLevel}
                    correctAnswerCount={correctAnswers}
                    levelFinished={levelFinished}
                />
            )}
            {currentLevel > 5 && levelFinished && (
                <Finish correctAnswers={correctAnswers} />
            )}
        </main>
    );
}