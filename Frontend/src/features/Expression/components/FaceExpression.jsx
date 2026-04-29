import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "../style/FaceExpression.scss";
import { useSong } from "../../home/hooks/useSongs";

export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const { loading: isSongLoading } = useSong();

    const [expression, setExpression] = useState("Waiting...");
    const [isInitializing, setIsInitializing] = useState(true);

    const isLoading = isInitializing || isSongLoading;

    useEffect(() => {
        const startCamera = async () => {
            try {
                await init({ landmarkerRef, videoRef, streamRef });
                setIsInitializing(false);
                setExpression("Ready");
            } catch (err) {
                console.error("Failed to initialize camera:", err);
                setExpression("Error");
            }
        };

        startCamera();

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        if (isLoading) return;
        const detectedExpression = detect({ landmarkerRef, videoRef, setExpression });
        if (detectedExpression) {
            onClick(detectedExpression);
        }
    }

    return (
        <section className="face-scanner">
            <div className="face-scanner__container">
                <video
                    ref={videoRef}
                    className="face-scanner__video"
                    playsInline
                    muted
                />
                {!isInitializing && <div className="face-scanner__overlay"></div>}
                {isInitializing && (
                    <div className="face-scanner__loader">
                        Initializing AI...
                    </div>
                )}
            </div>

            <div className="face-scanner__info-group">
                <div className="face-scanner__expression-tag">Current Mood</div>
                <h2 className="face-scanner__expression-value">
                    {expression === "Ready" ? "Scan Face" : expression}
                </h2>
            </div>

            <div className="face-scanner__actions">
                <button 
                    className="btn-3" 
                    onClick={handleClick}
                    disabled={isLoading}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                    {isInitializing ? "Loading AI..." : isSongLoading ? "Finding Song..." : "Detect Mood"}
                </button>
            </div>
        </section>
    );
}