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
          hand.keypoints.forEach((keypoint, index) => {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
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
      <h1 className="title">Webcam Viewer</h1>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          autoPlay
          className="video"
          width="640"
          height="480"
        ></video>
        <canvas
          ref={canvasRef}
          className="canvas"
          width="640"
          height="480"
        ></canvas>
      </div>
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
