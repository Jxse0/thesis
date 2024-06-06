"use client";
import React, { useState, ChangeEvent } from "react";

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
      setLoading(true); // Set loading to true when the upload starts
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("http://127.0.0.1:8000/img", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResponse(data.message || JSON.stringify(data));
          setLoading(false); // Set loading to false when the upload is complete
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setLoading(false); // Set loading to false if there's an error
        });
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {imageUrl && <img src={imageUrl} alt={response} />}
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default UploadImage;
