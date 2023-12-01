import type { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface Params {
  code: string;
  address: string;
}

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
  const params = getParams(req.url as string);
  console.log(params)
  const users = await getUsers();
  const user = users.filter((u: User) => u.fields.discord_code === params.code);
  if (user.length === 0) return Response.json({ user: false });
  const success = await updateAddress(params, user[0].id);
  return Response.json({ success });
}

async function updateAddress(
  params: Params,
  recordId: string
): Promise<boolean> {
  try {
    // https://airtable.com/developers/web/api/update-record
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}/${recordId}`;
    await axios.patch(
      url,
      {
        fields: {
          wallet_address: params.address,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function getParams(url: string): Params {
  // url = http://localhost:3000/auth?code=discordCode&address=0x123
  const params = new URLSearchParams(new URL(url).search);
  return {
    code: params.get("code") as string,
    address: params.get("address") as string,
  };
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
