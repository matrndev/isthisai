import React from "react";

export default function Confidence({ onConfidenceChange = () => {}, confidenceLevel, submit }) {
    
    return (
        <div className="alert alert-info mt-4 text-center fade-in">
            <h4>How confident are you in your response?</h4>
            <p>This statistical data will later be analyzed.</p>
            <div style={{width: "80%", margin: "0 auto"}}>
                <input required={true} className="form-range" type="range" defaultValue={2} min={0} max={4} onChange={(self) => onConfidenceChange(self.target.value)} />
                <div className="d-flex justify-content-between">
                    <span>Unsure</span>
                    <span>Very confident</span>
                </div>
            </div>
            {confidenceLevel !== -1 && <button className="btn btn-success fade-in mt-3" style={{ width: "100%" }} onClick={() => submit()}>Lock it in!</button>}
        </div>
    )
}