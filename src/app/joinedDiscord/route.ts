import type { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export interface User {
  id: string;
  createdTime: string;
  fields: {
    discord_joined: number;
    Created: string;
    "Last Modified": string;
    discord_id: string;
    discord_code: string;
    wallet_address: string;
  };
}

export async function GET(req: NextRequest, res: NextResponse) {
  const code = getParams(req.url as string);
  const users = await getUsers();
  const user = users.filter((u: User) => u.fields.discord_code === code && u.fields.discord_joined === 1);
  if (user.length === 0) return Response.json({ user: false });
  return Response.json({ user: true });
}

async function getUsers(): Promise<User[]> {
  // https://airtable.com/developers/web/api/get-records
  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}/`;
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  });
  return data.records;
}

function getParams(url: string): string {
  // url = http://localhost:3000/joinedDiscord?code=discordId
  const params = new URLSearchParams(new URL(url).search);
  return params.get("code") as string;
}
