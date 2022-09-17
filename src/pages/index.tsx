import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);

  console.log(data);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="text-2xl">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{data[0]?.question}</div>
    </div>
  );
};

export default Home;
