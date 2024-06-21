"use client";

import { useEffect, useRef, useState } from "react";
import "./WebcamRecorder.css";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/hands";

const WebcamRecorder = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [detector, setDetector] =
    useState<handPoseDetection.HandDetector | null>(null);

  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "mediapipe",
    maxHands: 1,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  };

  useEffect(() => {
    const createDetector = async () => {
      const newDetector = await handPoseDetection.createDetector(
        model,
        detectorConfig as any
      );
      setDetector(newDetector);
    };

    createDetector();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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
      stream.getTracks().forEach((track) => track.stop());
      setIsWebcamOn(false);
      setDetector(null);
    }
  };

  const predict = async () => {
    if (videoRef.current && detector && canvasRef.current) {
      const hands = await detector.estimateHands(videoRef.current, {
        flipHorizontal: true,
      });
      console.log(hands);
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        hands.forEach((hand) => {
          const minX = Math.min(...hand.keypoints.map((p) => p.x));
          const maxX = Math.max(...hand.keypoints.map((p) => p.x));
          const minY = Math.min(...hand.keypoints.map((p) => p.y));
          const maxY = Math.max(...hand.keypoints.map((p) => p.y));
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;

          const scaleFactor = 0.2;

          hand.keypoints.forEach((keypoint, index) => {
            ctx.beginPath();
            const radius = 1;

            const scaledX = centerX + (keypoint.x - centerX) * scaleFactor;
            const scaledY = centerY + (keypoint.y - centerY) * scaleFactor;

            ctx.arc(scaledX, scaledY, radius, 0, 2 * Math.PI);
            if (index === 8) {
              ctx.fillStyle = "blue";
            } else {
              ctx.fillStyle = "red";
            }
            ctx.fill();
          });
        });
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const interval = setInterval(predict, 100);
      return () => clearInterval(interval);
    }
  }, [videoRef, detector]);

  return (
    <div className="container">
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
      <video
        ref={videoRef}
        autoPlay
        className="video"
        width="640"
        height="480"
      ></video>
      <canvas ref={canvasRef} className="canvas"></canvas>
      <button onClick={() => alert("Hello World")} className="button">
        Clickme
      </button>
      ;
    </div>
  );
};

export default WebcamRecorder;
