"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const params = window.location.search;
    redirect("lestian://open" + params);
  }, []);

  return <div></div>;
}
