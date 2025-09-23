"use client";

import Card from "./Card";
import React from "react";
import check from "./check";
import "./style.css"
import Confidence from "./Confidence";
import Evaluation from "./Evaluation";


export default function GameForm({ text1, text2, groupId, topic, currentLevel, correctAnswerCount, serverLevelFinished }) {
    const [pickedCard, setPickedCard] = React.useState(null);
    const [gameStatus, setGameStatus] = React.useState(null);
    const [entry, setEntry] = React.useState({});
    const [correctCard, setCorrectCard] = React.useState(null);
    const [confidenceLevel, setConfidenceLevel] = React.useState(-1);
    const [levelFinished, setLevelFinished] = React.useState(serverLevelFinished);

    function submit() {
        const pickedCardText = pickedCard === 1 ? text1 : text2;
        check(groupId, pickedCardText, confidenceLevel).then((result) => {
            setEntry(result.entry)
            setGameStatus(result.won);

            if (result.won === true) {
                setCorrectCard(pickedCard);
            } else if (result.won === false) {
                setCorrectCard(pickedCard === 1 ? 2 : 1);
            }
        });
    }

    if (gameStatus === true) {
        fetch("/api/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: currentLevel + 1, levelFinished: true, correctAnswerCount: parseInt(correctAnswerCount) + 1 })
        }).catch(() => {});
    } else if (gameStatus === false) {
        fetch("/api/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: currentLevel + 1, levelFinished: true, correctAnswerCount: parseInt(correctAnswerCount) })
        }).catch(() => {});
    } else if (gameStatus === null && levelFinished === true || levelFinished === undefined) {
        fetch("/api/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelFinished: false })
        }).catch(() => {});
        setLevelFinished(false);
    }

    const platform = entry.platform === "hc" ? "Hack Club AI" : entry.platform === "openai" ? "OpenAI" : "unknown";

    if (currentLevel > 5) currentLevel = 5;
    return (
        <>
            <div className="progress mt-5 mb-2">
                <div className="progress-bar bg-primary" style={{ width: `calc(100% / 5 * ${currentLevel}` }}>{currentLevel}/5</div>
            </div>
            <h1 className={"text-center"}>{topic}</h1>
            <div className="row fade-in">
                <div className="col-md-6 mb-3">
                    <Card
                        id={1}
                        header={correctCard === null ? "Mystery Article 1" : correctCard === 1 ? "AI-generated" : "Wikipedia"}
                        text={text1}
                        onPick={(id) => setPickedCard(id)}
                        selected={pickedCard === 1}
                        source={correctCard === 1 ? entry.model : entry.wikiURL}
                        platform={platform}
                        correct={
                            correctCard === null
                                ? null
                                : (correctCard === 1
                                    ? true
                                    : (pickedCard === 1
                                        ? false
                                        : null))
                        }
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <Card
                        id={2}
                        header={correctCard === null ? "Mystery Article 2" : correctCard === 2 ? "AI-generated" : "Wikipedia"}
                        text={text2}
                        onPick={(id) => setPickedCard(id)}
                        selected={pickedCard === 2}
                        source={correctCard === 2 ? entry.model : entry.wikiURL}
                        platform={platform}
                        correct={
                            correctCard === null
                                ? null
                                : (correctCard === 2
                                    ? true
                                    : (pickedCard === 2
                                        ? false
                                        : null))
                        }
                    />
                </div>
            </div>

            {gameStatus !== null && <Evaluation gameStatus={gameStatus} />}

            {pickedCard !== null && gameStatus === null && <Confidence onConfidenceChange={(confidenceLevel) => setConfidenceLevel(confidenceLevel)} confidenceLevel={confidenceLevel} submit={submit} />}


        </>
    );
}
