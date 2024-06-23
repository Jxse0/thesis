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
  const cursorRef = useRef<HTMLImageElement>(null);

  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig: any = {
    runtime: "mediapipe",
    maxHands: 1,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  };

  useEffect(() => {
    const loadDetector = async () => {
      try {
        const newDetector = await handPoseDetection.createDetector(
          model,
          detectorConfig
        );
        setDetector(newDetector);
      } catch (err) {
        console.error("Error loading hand detector:", err);
      }
    };
    loadDetector();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startWebcam = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
      setIsWebcamOn(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsWebcamOn(false);
      setDetector(null);
    }
  };

  const predict = async () => {
    if (videoRef.current && detector && canvasRef.current) {
      const hands = await detector.estimateHands(videoRef.current, {
        flipHorizontal: true,
      });

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const containerNav: HTMLElement | null =
          document.querySelector(".container-nav");
        const containerNavWidth = containerNav?.offsetWidth || 0;
        const containerNavHeight = containerNav?.offsetHeight || 0;
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        const scaleX = containerNavWidth / videoWidth;
        const scaleY = containerNavHeight / videoHeight;

        hands.forEach((hand) => {
          hand.keypoints.forEach((keypoint, index) => {
            ctx.beginPath();

            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = index === 8 ? "blue" : "red";
            ctx.fill();

            if (index === 8 && cursorRef.current) {
              const scaledX = keypoint.x * scaleX;
              const scaledY = keypoint.y * scaleY;
              cursorRef.current.style.left = `${scaledX}px`;
              cursorRef.current.style.top = `${scaledY}px`;
            }
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
  }, [detector]);

  return (
    <div className="container-nav">
      <img
        ref={cursorRef}
        id="cursor"
        src="https://media.geeksforgeeks.org/wp-content/uploads/20200319212118/cursor2.png"
        width="15"
        height="20"
        alt="Cursor"
      />
      <h1 className="title">Webcam Viewer</h1>
      <div className="video-container">
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
