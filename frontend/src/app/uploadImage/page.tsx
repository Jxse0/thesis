"use client";
import React, { useState, ChangeEvent } from "react";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("http://127.0.0.1:8000/img", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResponse(data.message || JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {imageUrl && <img src={imageUrl} alt={response} />}
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default UploadImage;
