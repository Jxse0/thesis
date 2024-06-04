"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import "./UploadVideo.css"; // Assuming you have a CSS file for styling

const UploadVideo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentText, setCurrentText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add this line
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setVideoUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsLoading(true); // Add this line
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("http://127.0.0.1:8000/video", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResponse(data);
          console.log(data);
          setIsLoading(false); // Add this line
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setIsLoading(false); // Add this line
        });
    } else {
      alert("Please select a file first.");
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const currentSegment = response.find(
        (segment) => segment.start <= currentTime && segment.end >= currentTime
      );
      if (currentSegment) {
        setCurrentText(currentSegment.text);
      }
    }
  };

  const transcript = () => {
    let transcript = "";
    response.map((segment) => {
      transcript += segment.text;
    });
    return transcript;
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading}>
        Upload Video
      </button>{" "}
      {/* Add disabled attribute here */}
      {isLoading && <p>Loading...</p>} {/* Add this line */}
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {videoUrl && (
        <div className="video-container">
          <video
            src={videoUrl}
            controls
            onTimeUpdate={handleTimeUpdate}
            ref={videoRef}
          />
          {currentText && <div className="video-subtitle">{currentText}</div>}
        </div>
      )}
      <p>{transcript()}</p>
    </div>
  );
};

export default UploadVideo;
