import React, { useState, useRef, useEffect } from "react";
import { analyzeEmotion } from "../services/apiService";

const ScanFace = ({
  userId,
  onScanComplete,
  onError,
  isLoading,
  setIsLoading,
}) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("📷 Attiva la webcam");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animationRef = useRef(null);
  const metricsHistoryRef = useRef([]);
  const landmarksHistoryRef = useRef([]);
  const scanIntervalRef = useRef(null);

  const loadFaceMesh = () => {
    return new Promise((resolve, reject) => {
      if (window.FaceMesh) {
        resolve(window.FaceMesh);
        return;
      }
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(window.FaceMesh);
      script.onerror = () => reject(new Error("Impossibile caricare FaceMesh"));
      document.body.appendChild(script);
    });
  };

  const calculateMetrics = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;

    const LEFT_EYE = [33, 133, 157, 158, 159, 160, 161, 173];
    const RIGHT_EYE = [362, 263, 387, 386, 385, 384, 398, 466];
    const MOUTH = [
      61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0,
      37, 39, 40, 185,
    ];

    const distance = (p1, p2) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dz = p1.z - p2.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    const getEyeOpenness = () => {
      const leftEye = landmarks.filter((_, i) => LEFT_EYE.includes(i));
      const rightEye = landmarks.filter((_, i) => RIGHT_EYE.includes(i));
      if (leftEye.length < 4 || rightEye.length < 4) return 50;
      const leftOpen = distance(leftEye[0], leftEye[4]);
      const rightOpen = distance(rightEye[0], rightEye[4]);
      return Math.min(Math.round(((leftOpen + rightOpen) / 2) * 200), 100);
    };

    const getMouthTension = () => {
      const mouthPoints = landmarks.filter((_, i) => MOUTH.includes(i));
      if (mouthPoints.length < 4) return 50;
      const mouthOpen = distance(
        mouthPoints[0],
        mouthPoints[mouthPoints.length - 1],
      );
      return Math.max(0, Math.min(100, 100 - mouthOpen * 300));
    };

    const getBlinkRate = () => (getEyeOpenness() < 30 ? 20 : 5);

    const getHeadPosition = () => {
      const nose = landmarks[1];
      const chin = landmarks[152];
      if (!nose || !chin) return { x: 0, y: 0, z: 0 };
      return {
        x: Math.round((nose.x - 0.5) * 100),
        y: Math.round((nose.y - 0.5) * 100),
        z: Math.round(nose.z * 100),
      };
    };

    return {
      eyeOpenness: getEyeOpenness(),
      mouthTension: getMouthTension(),
      blinkRate: getBlinkRate(),
      headPosition: getHeadPosition(),
    };
  };

  const startCamera = async () => {
    try {
      setStatusMessage("📷 Avvio webcam...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
      }

      const FaceMesh = await loadFaceMesh();
      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks?.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          const metrics = calculateMetrics(landmarks);
          if (metrics) {
            landmarksHistoryRef.current.push(landmarks);
            metricsHistoryRef.current.push(metrics);
            if (landmarksHistoryRef.current.length > 60) {
              landmarksHistoryRef.current.shift();
              metricsHistoryRef.current.shift();
            }
          }
        }
      });

      faceMeshRef.current = faceMesh;
      setIsCameraReady(true);
      setStatusMessage('✅ Volto rilevato! Premi "Scansiona"');

      const detectLoop = async () => {
        if (videoRef.current && faceMeshRef.current) {
          try {
            await faceMeshRef.current.send({ image: videoRef.current });
          } catch (err) {}
        }
        animationRef.current = requestAnimationFrame(detectLoop);
      };
      detectLoop();
    } catch (error) {
      onError("Errore avvio webcam: " + error.message);
      setStatusMessage("Errore: " + error.message);
    }
  };

  const performScan = () => {
    if (metricsHistoryRef.current.length === 0) {
      onError(
        "Nessun dato facciale rilevato. Assicurati di essere inquadrato.",
      );
      return;
    }

    setIsLoading(true);
    setIsDetecting(true);
    setStatusMessage("🧠 Analisi in corso...");

    const lastMetrics =
      metricsHistoryRef.current[metricsHistoryRef.current.length - 1];
    const lastLandmarks =
      landmarksHistoryRef.current[landmarksHistoryRef.current.length - 1];

    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += 10;
      setScanProgress(Math.min(progress, 90));
    }, 200);

    const sessionId = `session_${Date.now()}`;

    analyzeEmotion({
      userId: String(userId),
      landmarks: lastLandmarks.map((l) => [l.x, l.y, l.z]),
      sessionId,
      metrics: lastMetrics,
    })
      .then((result) => {
        clearInterval(scanIntervalRef.current);
        setScanProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setIsDetecting(false);
          setStatusMessage("✅ Scansione completata!");
          stopCamera();
          onScanComplete(result);
        }, 500);
      })
      .catch((error) => {
        clearInterval(scanIntervalRef.current);
        setIsLoading(false);
        setIsDetecting(false);
        onError("Errore scansione: " + error.message);
        setStatusMessage("❌ Errore scansione");
      });
  };

  const stopCamera = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraReady(false);
    setStatusMessage("Webcam fermata");
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  return (
    <div className="camera-container">
      <div className="camera-wrapper">
        {/* Placeholder visibile solo quando camera non è pronta */}
        {!isCameraReady && (
          <div className="camera-placeholder">
            <div className="icon">📷</div>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
              Attiva la webcam per iniziare
            </p>
            <p style={{ color: "#4b5563", fontSize: "0.85rem" }}>
              Inquadra il tuo viso per la scansione
            </p>
          </div>
        )}

        {/* Video SEMPRE nel DOM, nascosto finché non è pronto */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: isCameraReady ? "block" : "none",
            backgroundColor: "#111",
          }}
        />

        {isCameraReady && (
          <div className="camera-overlay">
            {isDetecting ? (
              <>
                <div
                  className="spinner"
                  style={{
                    width: "30px",
                    height: "30px",
                    margin: "0 auto 10px",
                  }}
                ></div>
                <span>Analisi in corso {scanProgress}%</span>
              </>
            ) : (
              "✅ Volto rilevato"
            )}
          </div>
        )}
      </div>

      <div className="camera-controls">
        {!isCameraReady ? (
          <button className="btn-neon" onClick={startCamera}>
            📷 Attiva Webcam
          </button>
        ) : (
          <>
            <button
              className="btn-neon"
              onClick={performScan}
              disabled={isLoading || isDetecting}
            >
              {isLoading ? "⏳ Scansione..." : "🧠 Scansiona"}
            </button>
            <button
              className="btn-neon"
              onClick={stopCamera}
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
              disabled={isLoading}
            >
              🛑 Ferma
            </button>
          </>
        )}
      </div>

      <p
        style={{
          color: "#6b7280",
          fontSize: "0.9rem",
          marginTop: "10px",
          textAlign: "center",
        }}
      >
        {statusMessage}
      </p>
    </div>
  );
};

export default ScanFace;
