import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // parse params from url
  const params = req.nextUrl.search;
  return redirect("lestian://open" + params);
  //   return Response.json({ hello: "world" });
}
