"use server";

import { cookies } from 'next/headers';

export default async function resetGame() {
    const cookieStore = await cookies();
    cookieStore.set("level", "1");
    cookieStore.set("correctAnswerCount", "0");
    cookieStore.set("levelFinished", "false");
}