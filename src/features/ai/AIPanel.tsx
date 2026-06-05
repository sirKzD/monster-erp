import { useState } from "react";

interface AIPanelProps {
    onGenerate: (prompt: string) => void;
}

function AIPanel({ onGenerate }: AIPanelProps) {

    const [prompt, setPrompt] =
        useState("");

    const handleGenerate = () => {

        if (!prompt.trim()) return;

        onGenerate(prompt);

        setPrompt("");
    };

    return (

        <div className="ai-panel">

            <h3>
                🤖 AI Task Generator
            </h3>

            <input
                type="text"
                placeholder="Generate task..."
                value={prompt}
                onChange={(e) =>
                    setPrompt(
                        e.target.value
                    )
                }
            />

            <button
                onClick={handleGenerate}
            >
                🚀 Generate
            </button>

        </div>
    );
}

export default AIPanel;