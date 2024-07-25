"use client";
import React, { useState, ChangeEvent } from "react";
import "./UploadImage.css";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("http://127.0.0.1:8000/img", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResponse(JSON.stringify(data));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setLoading(false);
        });
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <>
      <h1>Upload Image</h1> <br />
      <div className="container-image">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        {imageUrl && <img src={imageUrl} alt={response} />}
      </div>
    </>
  );
};

export default UploadImage;
