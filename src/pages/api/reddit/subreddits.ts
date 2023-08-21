import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(async (req, res) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const response = await axios.get(
    "https://oauth.reddit.com/subreddits/mine/subscriber?limit=100",
    {
      headers: {
        Authorization: `bearer ${token?.access_token}`,
        "User-Agent": "r.underdogprotocol.com (by /u/helloitskevo)",
      },
    }
  );

  res.status(200).send(response.data.data.children);
});

export default router.handler();
