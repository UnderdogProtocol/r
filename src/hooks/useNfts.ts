import { useQuery } from "react-query";
import { helius } from "@/lib/helius";
import { PublicKey } from "@metaplex-foundation/umi";

const searchNfts = (ownerAddress?: PublicKey, page = 1) => {
  if (!ownerAddress) {
    return Promise.reject("No ownerAddress provided");
  }

  return helius.rpc.searchAssets({
    ownerAddress,
    compressed: true,
    grouping: ["collection", "5tdwhk6Rr9CEJnMitjuoBCeD8NWky5R9smSTYKwzxRjx"],
    page,
    limit: 100,
  });
};

export const useNfts = (ownerAddress?: PublicKey, page = 1) => {
  return useQuery(
    ["searchNfts", ownerAddress, page],
    () => searchNfts(ownerAddress, page),
    { enabled: !!ownerAddress }
  );
};
