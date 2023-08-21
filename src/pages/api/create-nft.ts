import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";
import { authOptions } from "./auth/[...nextauth]";
import { faker } from "@faker-js/faker";
import axios from "axios";

const router = createRouter<NextApiRequest, NextApiResponse>();

const context = createUmi(
  "https://rpc.helius.xyz/?api-key=f961a77f-7072-4316-b9a2-1cab32a4d4a1"
);

router.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.name) return res.status(401).end();

  const linkPda = findLinkPda(context, { identifier: session.user.name })[0];

  const { name, image } = req.body;

  await axios.post(
    "https://api.underdogprotocol.com/v2/projects/5/nfts",
    {
      name,
      image,
      receiverAddress: linkPda,
    },
    { headers: { Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}` } }
  );

  res.status(202).send({ message: "OK" });
});

export default router.handler();
