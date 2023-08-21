import { IndexView } from "@/views/IndexView";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";

export default function HomePage({ subreddits }: { subreddits: any[] }) {
  return <IndexView subreddits={subreddits} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({ req: context.req });

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
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

  return { props: { subreddits: response.data.data.children } };
};
