"use client";
import React, { useState, useRef } from "react";

const RecordPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [response, setResponse] = useState<string>("");

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      fetch("http://127.0.0.1:8000/transcript", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResponse(data.message || JSON.stringify(data));
          console.log(response);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleDelete = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setResponse("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Record Audio</h1>
      {isRecording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
      {audioURL && (
        <div>
          <audio src={audioURL} controls />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      {response && (
        <div>
          <p>{response}</p>
          <button onClick={handleDelete}>Clear</button>
        </div>
      )}
    </div>
  );
};

export default RecordPage;
