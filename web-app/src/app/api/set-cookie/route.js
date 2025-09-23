import { cookies } from 'next/headers';

export async function POST(request) {
    const cookieStore = await cookies();
    let level;
    let levelFinished;
    let correctAnswerCount;
    try {
        const json = await request.json();
        level = json.level;
        levelFinished = json.levelFinished;
        correctAnswerCount = json.correctAnswerCount;
    } catch {
        console.log("no json data");
        return new Response(JSON.stringify({ status: 500, error: "No input JSON provided" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    if (level !== undefined) cookieStore.set("level", String(level));
    if (levelFinished !== undefined) cookieStore.set("levelFinished", String(levelFinished));
    if (correctAnswerCount !== undefined) cookieStore.set("correctAnswerCount", String(correctAnswerCount));

    return new Response(JSON.stringify({ status: 200, error: "Cookies set successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
}