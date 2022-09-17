import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = (props: any) => {
  const { data, isLoading } = trpc.useQuery(["getAllQuestions"]);

  console.log(data);

  if (isLoading || !data) return <div>Loading...</div>;

  return <div>{data[0]?.question}</div>;

  return (
    <div className="text-2xl">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <code>{props.questions}</code>
    </div>
  );
};

export default Home;
