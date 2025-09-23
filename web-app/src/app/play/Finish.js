"use client";

import resetGame from "./resetGame";

export default function Finish({ correctAnswers }) {
    if (correctAnswers < 0) correctAnswers = 0;

    return (
        <div className="text-center mt-5">
            <h1>Good game!</h1>
            <h4>You answered {correctAnswers} out of 5 questions correctly.</h4>
            <p>Thanks for playing!</p>
            <button onClick={() => resetGame()} className="btn btn-primary btn-lg">Play Again</button>
        </div>
    )
}