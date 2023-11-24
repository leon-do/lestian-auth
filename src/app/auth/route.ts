import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface User {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  premium_type: number;
  flags: number;
  banner: any;
  accent_color: any;
  global_name: string;
  avatar_decoration_data: any;
  banner_color: any;
  mfa_enabled: boolean;
  locale: string;
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
  try {
    const { code, address } = getParams(req.url as string);
    const accessToken: AccessToken = await fetchAccessToken(code);
    const user: User = await fetchUser(accessToken.access_token);
    // save discord.id, user.username, code, address to database

    return Response.json({ success: true });
  } catch (error: any) {
    return new Response(error.message || error.toString(), { status: 401 });
  }
}

async function fetchUser(accessToken: string): Promise<User> {
  const { data } = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
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
      redirect_uri: "http://localhost:3000/redirect", // must match discord portal
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data;
}
