"use client";
import Link from "next/link";
import link from "next/link";
import { useEffect } from "react";

async function getData() {
  const res = await fetch(
    "https://www.cs.toronto.edu/%7Ekriz/cifar-10-python.tar.gz"
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  console.log("hi");
  return res.json();
}
export default async function Home() {
  const data = await getData();
  useEffect(() => {
    data;
  }, []);

  return <Link href="/home">Home</Link>;
}
