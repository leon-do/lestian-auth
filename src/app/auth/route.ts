import type { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  username: string;
}

interface AccessToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface Params {
  code: string;
  address: string;
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { code } = getParams(req.url as string);
  try {
    const accessToken = await fetchAccessToken(code);
    const user = await fetchUser(accessToken.access_token);
    const upserted = await upsertUser(user.id, code);
    return Response.json({ success: upserted });
  } catch (error: any) {
    console.error(error);
    return Response.json({ success: false });
  } finally {
    return redirect(`lestian://open?code=${code}`);
  }
}

async function upsertUser(id: string, code: string) {
  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  await axios.patch(
    url,
    {
      typecast: true,
      performUpsert: {
        fieldsToMergeOn: ["discord_id"],
      },
      records: [
        {
          fields: {
            discord_id: id,
            discord_code: code,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    }
  );
}

async function fetchUser(accessToken: string): Promise<User> {
  const response = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

function getParams(url: string): Params {
  // url = http://localhost:3000/auth?code=discordCode&address=0x123
  const params = new URLSearchParams(new URL(url).search);
  return {
    code: params.get("code") as string,
    address: params.get("address") as string,
  };
}

async function fetchAccessToken(code: string): Promise<AccessToken> {
  const { data } = await axios.post(
    "https://discord.com/api/oauth2/token",
    {
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_SECRET_ID as string,
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/auth", // must match discord portal
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data;
}
