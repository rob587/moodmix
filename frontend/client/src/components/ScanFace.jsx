import React from "react";
import React, { useState, useRef, useEffect } from "react";
import { analyzeEmotion } from "../services/apiService";

const ScanFace = () => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Attiva la webcam");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animationRef = useRef(null);
  const metricsHistoryRef = useRef([]);
  const landmarksHistoryRef = useRef([]);
  const scanIntervalRef = useRef(null);
  return <div></div>;
};

export default ScanFace;
