import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

import { MediaObject } from "@/components/MediaObject";
import { useContext } from "@/hooks/useContext";

import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/MediaObject/Header";
import { useNfts } from "@/hooks/useNfts";
import { sleep } from "@/lib";
import { LoadingSection } from "@/components/LoadingSection";
import { Input } from "@/components/Input";

export const IndexView: React.FC<{ subreddits: any[] }> = ({ subreddits }) => {
  const context = useContext();
  const [search, setSearch] = useState("");
  const [minting, setMinting] = useState(false);
  const { data: session } = useSession();
  const linkPda = useMemo(
    () =>
      session?.user?.name
        ? findLinkPda(context, { identifier: session.user.name })[0]
        : undefined,
    [session?.user?.name, context]
  );

  const { data, refetch } = useNfts(linkPda);
  const names = data?.items.map((item) => item.content?.metadata.name);

  if (!subreddits.length || !session?.user) return null;

  return (
    <Container className="font-mono space-y-8 py-16 px-4">
      <div className="flex lg:flex-row flex-col lg:items-center">
        <Header
          title={`Welcome u/${session?.user?.name}`}
          description="Collect cNFTs from your favorite subreddits"
          size="2xl"
        />
        <div className="flex justify-start lg:justify-end">
          <Button
            type="link"
            onClick={() =>
              window.open(`https://xray.helius.xyz/account/${linkPda}`)
            }
            className="text-primary"
          >
            View on XRAY
          </Button>
          <Button
            type="link"
            onClick={() => signOut()}
            className="text-primary"
          >
            Sign Out
          </Button>
        </div>
      </div>
      
      <Input size="lg" onChange={(e) => setSearch((e.target as any).value)} placeholder="r/place" />

      <div className="grid lg:grid-cols-3 gap-4 font-mono">
        {subreddits
          .filter((subreddit) => subreddit.data.community_icon.split("?")[0])
          .filter((subreddit) => !search || subreddit.data.display_name_prefixed.toLowerCase().includes(search.toLowerCase()))
          .map((subreddit) => (
            <div
              className="p-8 bg-dark-light border border-dark-accent rounded-lg flex items-center justify-between"
              key={subreddit.data.title}
            >
              <MediaObject
                media={{ src: subreddit.data.community_icon.split("?")[0] }}
                title={subreddit.data.display_name_prefixed}
              />
              {names?.includes(subreddit.data.display_name_prefixed) ? (
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(
                      `https://xray.helius.xyz/token/${
                        data?.items.find(
                          (item) =>
                            item.content?.metadata.name ===
                            subreddit.data.display_name_prefixed
                        )?.id
                      }`
                    )
                  }
                >
                  Collected
                </Button>
              ) : (
                <Button
                  type="secondary"
                  disabled={minting}
                  onClick={async () => {
                    setMinting(true);
                    await axios.post("/api/create-nft", {
                      name: subreddit.data.display_name_prefixed,
                      image: subreddit.data.community_icon.split("?")[0],
                    });

                    for (let i = 0; i < 9; i++) {
                      await refetch();
                      await sleep(1000);
                    }

                    setMinting(false);
                  }}
                >
                  Collect
                </Button>
              )}
            </div>
          ))}
      </div>
    </Container>
  );
};
