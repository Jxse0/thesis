"use client";

import { useEffect, useRef, useState } from "react";
import "./WebcamRecorder.css";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/hands";

const WebcamRecorder = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  };

  let detector: handPoseDetection.HandDetector;

  async function createDetector() {
    detector = await handPoseDetection.createDetector(
      model,
      detectorConfig as any
    );
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStream(stream);

      setIsWebcamOn(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = async () => {
    if (stream) {
      const hands = await detector.estimateHands(videoRef.current as any, {
        flipHorizontal: true,
      });
      console.log(hands);
      stream.getTracks().forEach((track) => track.stop());
      setIsWebcamOn(false);
    }
  };

  useEffect(() => {
    createDetector();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="container">
      <h1 className="title">Webcam Viewer</h1>
      <video ref={videoRef} autoPlay className="video"></video>
      <div className="buttonContainer">
        {!isWebcamOn ? (
          <button onClick={startWebcam} className="button">
            Start Webcam
          </button>
        ) : (
          <button onClick={stopWebcam} className="button">
            Stop Webcam
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamRecorder;
