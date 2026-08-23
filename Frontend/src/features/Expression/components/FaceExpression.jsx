import { useEffect, useRef, useState } from "react";
import { detect, initCamera, initLandmarker } from "../utils/utils";
import "../style/FaceExpression.scss";
import { useSong } from "../../home/hooks/useSongs";

export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const { loading: isSongLoading } = useSong();

    const [expression, setExpression] = useState("Waiting...");
    const [isInitializing, setIsInitializing] = useState(true);
    const [initStatus, setInitStatus] = useState("Starting Camera...");
    const [cameraError, setCameraError] = useState(false);

    const isLoading = isInitializing || isSongLoading;

    const startCamera = async () => {
        setIsInitializing(true);
        setCameraError(false);
        try {
            setInitStatus("Starting Camera...");
            await initCamera({ videoRef, streamRef });
            setInitStatus("Loading AI Vision...");
            await initLandmarker({ landmarkerRef });
            setExpression("Ready");
        } catch (err) {
            console.error("Failed to initialize camera / AI:", err);
            setExpression("Camera Error");
            setCameraError(true);
        } finally {
            setIsInitializing(false);
        }
    };

    useEffect(() => {
        startCamera();

        return () => {
            if (landmarkerRef.current) {
                try { landmarkerRef.current.close(); } catch (e) {}
            }

            if (streamRef.current) {
                try {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                } catch (e) {}
            }
        };
    }, []);

    async function handleClick() {
        if (cameraError) {
            startCamera();
            return;
        }
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
                    autoPlay
                    playsInline
                    muted
                />
                {!isInitializing && !cameraError && <div className="face-scanner__overlay"></div>}
                {isInitializing && (
                    <div className="face-scanner__loader">
                        <div className="face-scanner__spinner" />
                        <span>{initStatus}</span>
                    </div>
                )}
                {cameraError && (
                    <div className="face-scanner__loader face-scanner__loader--error">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" width="32" height="32">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>Camera access needed</span>
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
                    className={`btn-3 ${cameraError ? 'btn-3--retry' : ''}`} 
                    onClick={handleClick}
                    disabled={isSongLoading || (isInitializing && !cameraError)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                    {cameraError ? "Retry Camera" : isInitializing ? "Loading AI..." : isSongLoading ? "Finding Song..." : "Detect Mood"}
                </button>
            </div>
        </section>
    );
}