import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

export const initCamera = async ({ videoRef, streamRef }) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported on this browser.");
    }

    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "user" },
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });
    } catch (e1) {
        console.warn("Ideal front camera constraint failed, falling back to default:", e1);
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } catch (e2) {
            console.error("Camera access failed:", e2);
            throw e2;
        }
    }

    streamRef.current = stream;

    if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.muted = true;

        await new Promise((resolve) => {
            if (videoRef.current.readyState >= 2) {
                videoRef.current.play().then(resolve).catch(resolve);
            } else {
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(resolve).catch(resolve);
                };
            }
        });
    }
};

export const initLandmarker = async ({ landmarkerRef }) => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm"
    );

    try {
        landmarkerRef.current = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );
    } catch (gpuErr) {
        console.warn("GPU delegate failed on mobile, falling back to CPU:", gpuErr);
        landmarkerRef.current = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
                    delegate: "CPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );
    }
};

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    // Start camera stream first so video appears immediately
    await initCamera({ videoRef, streamRef });
    // Initialize FaceLandmarker AI
    await initLandmarker({ landmarkerRef });
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
    if (!landmarkerRef.current || !videoRef.current) return null;
    if (videoRef.current.readyState < 2) return null;

    try {
        const results = landmarkerRef.current.detectForVideo(
            videoRef.current,
            performance.now()
        );

        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
            const blendshapes = results.faceBlendshapes[0].categories;

            const getScore = (name) =>
                blendshapes.find((b) => b.categoryName === name)?.score || 0;

            const smileLeft = getScore("mouthSmileLeft");
            const smileRight = getScore("mouthSmileRight");
            const jawOpen = getScore("jawOpen");
            const browUp = getScore("browInnerUp");
            const frownLeft = getScore("mouthFrownLeft");
            const frownRight = getScore("mouthFrownRight");

            let currentExpression = "neutral";

            if (smileLeft > 0.4 || smileRight > 0.4) {
                currentExpression = "happy";
            } else if (jawOpen > 0.25 || browUp > 0.25) {
                currentExpression = "surprised";
            } else if (frownLeft > 0.05 || frownRight > 0.05) {
                currentExpression = "sad";
            }

            setExpression(currentExpression);
            return currentExpression;
        } else {
            setExpression("No face detected");
            return null;
        }
    } catch (err) {
        console.error("Face detection error:", err);
        return null;
    }
};