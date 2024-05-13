"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

async function getData() {
  const res = await fetch("http://localhost:3001/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.text(); // change this line
  console.log(data);
  return data;
}

export default function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    getData()
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return <Link href="/home">Home</Link>;
}
