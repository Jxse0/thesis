"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDarkMode } from "./DarkModeContext";

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  console.log(data[0]);
  return data;
}

export default function Home() {
  const [data, setData] = useState("");
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    getData()
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <button className="toggle-button" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <h1 className="welcome">Welcome to my Thesis Project</h1>
      <div className="links">
        <Link href="/uploadImage">Upload Image</Link>
        <br />
        <Link href="/record">Audio Recorder</Link>
        <br />
        <Link href="/video">Upload Video</Link>
        <br />
        <Link href="/navigation">Webcam Recorder</Link>
      </div>
    </div>
  );
}
