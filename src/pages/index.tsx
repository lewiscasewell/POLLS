import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const QuestionCards = dynamic(import("../components/QuestionCards"));

const Home: NextPage = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex flex-col p-4 max-w-5xl bg-gray-800 mx-auto h-full min-h-screen">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-10">
        <div className="flex gap-5 justify-between">
          <Link href="https://lewiscasewell.com">
            <button className="p-2 font-bold rounded-md text-pink-500 ">
              Back to portfolio
            </button>
          </Link>
          <Link href="/create">
            <button className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in shadow-xl shadow-pink-500/30">
              New question
            </button>
          </Link>
        </div>
        <div className="flex justify-center flex-col items-center mt-2">
          <h1 className="text-4xl font-extrabold text-gray-100">
            Got a question?
          </h1>
          <h2 className="text-3xl">Start a poll...</h2>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-xl rounded-md shadow-lg">
            <input
              className="w-full bg-gray-900/70 p-3 rounded-md "
              placeholder="Search for an existing question"
              onChange={(e) => {
                setTimeout(() => setSearch(e.target.value), 1000);
              }}
            />
          </div>
        </div>
        <QuestionCards search={search} />
      </div>
    </div>
  );
};

export default Home;
