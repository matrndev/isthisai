import React from "react";

export default function Card({ id, header, text, onPick = () => { }, selected, source, correct, platform }) {
    const [displayedText, setDisplayedText] = React.useState("");
    const [isTyping, setIsTyping] = React.useState(true);

    React.useEffect(() => { // to do: add ability to turn off typing animation
        if (displayedText === text) {
            setIsTyping(false);
            return;
        }

        const typingSpeed = 5; // milliseconds per character
        const timer = setTimeout(() => {
            setDisplayedText(text.substring(0, displayedText.length + 1));
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayedText, text]);

    /*React.useEffect(() => {
        async function loadBootstrap() {
            const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        }

        loadBootstrap();
    }, []);*/

    return (
        <div className={`card ${correct !== null ? correct === true ? "border-success" : "border-danger" : selected === true ? "border-primary" : ""}`}>
            <div className="card-header text-center">{header} {selected === true && source !== undefined && <span className={`badge text-bg-${correct ? "success" : "danger"}`}>Your pick</span>}</div>
            <div className="card-body">
                <div className="typed-box mb-2" aria-readonly="true">
                    {displayedText.split("").map((ch, i) => (
                        ch === "\n"
                            ? <br key={i} />
                            : <span key={i} className="char">{ch}</span>
                    ))}
                </div>
                {source && source.includes("http") && <a href={source} className="link-secondary"><small>{source}</small></a>}
                {source && !source.includes("http") && <small className="text-secondary">{source} via {platform === "Hack Club AI" ? <a href="https://ai.hackclub.com" target="_blank" className="link-secondary">{platform}</a> : platform}</small>}
            </div>

            {source === undefined && <button
                type="button"
                disabled={selected}
                className="btn btn-primary m-3"
                onClick={() => {
                    onPick(id);
                    setIsTyping(false);
                    setDisplayedText(text);
                }}
            >
                This is AI
            </button>}
        </div>
    );
}
