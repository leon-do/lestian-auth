"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const params = window.location.search;
    // console.log(window.location);
    // redirect("lestian://open" + params);
  }, []);

  return <div className="bg-slate-900"></div>;
}
