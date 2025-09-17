"use client";

import submit from "./submit";
import React from "react";

export default function Suggest() {
    const [text, setText] = React.useState("");

    return (
        <main className="container mt-3">
            <h1 className="text-center text-primary">Suggest a topic</h1>
            <p className="text-center">Suggest a topic of an article to appear in the game! It must already have a valid Wikipedia article.<br />If I deem the article good enough, I will add it to the game!</p>

            <form onSubmit={(e) => { e.preventDefault(); submit(text); alert("Thank you! Your suggestion has been recorded."); }}>
                <div className="input-group" style={{ maxWidth: "700px", margin: "0 auto" }}>
                    <input type="text" className="form-control"  placeholder="Your suggested Wikipedia article" onChange={(self) => {setText(self.target.value)}} />
                    <button className="btn btn-outline-primary" type="submit">Submit</button>
                </div>
            </form>
        </main>
    )
}