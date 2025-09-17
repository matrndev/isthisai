"use client";

import Card from "./Card";
import React from "react";
import check from "./check";
import "./style.css"
import Confidence from "./Confidence";
import Evaluation from "./Evaluation";


export default function GameForm({ text1, text2, groupId, topic, currentLevel }) {
    const [pickedCard, setPickedCard] = React.useState(null);
    const [gameStatus, setGameStatus] = React.useState(null);
    const [entry, setEntry] = React.useState({});
    const [correctCard, setCorrectCard] = React.useState(null);
    const [confidenceLevel, setConfidenceLevel] = React.useState(-1);
    
    function submit() {
        const pickedCardText = pickedCard === 1 ? text1 : text2;
        check(groupId, pickedCardText, confidenceLevel).then((result) => {
            setEntry(result.entry)
            setGameStatus(result.won);

            if (result.won === true) {
                setCorrectCard(pickedCard);
            } else if (result.won === false) {
                console.log("the user picked the wrong card, so the correct card is the other one")
                setCorrectCard(pickedCard === 1 ? 2 : 1);
            }
        });
    }

    const platform = entry.platform === "hc" ? "Hack Club AI" : entry.platform === "openai" ? "OpenAI" : "unknown";
    console.log(platform)
    return (
        <>
            {/*<div className="progress mt-3 mb-4">
                <div className="progress-bar bg-primary" style={{ width: `calc(100% / 4 * ${currentLevel}` }}>{currentLevel}/4</div>
            </div>*/}
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
