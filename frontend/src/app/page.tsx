"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json(); // change this line
  console.log(data[0]);
  return data;
}

export default function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    getData()
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Link href="/uploadImage">Upload Image</Link>
      <br />
      <Link href="/record">Record</Link>
      <br />
      <Link href="/video">Upload Video</Link>
    </div>
  );
}
