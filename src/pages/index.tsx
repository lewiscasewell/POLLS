import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const QuestionCards = dynamic(import("../components/QuestionCards"));

const Home: NextPage = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex flex-col p-6 max-w-5xl mx-auto h-full min-h-screen">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-10">
        <div className="flex gap-5 justify-between">
          <Link href="https://lewiscasewell.com">
            <button className="p-2 font-bold border-pink-500 border-2 rounded-md text-pink-500 shadow-xl shadow-pink-500/30">
              Back to site
            </button>
          </Link>
          <Link href="/create">
            <button className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in shadow-xl shadow-pink-500/30">
              New question
            </button>
          </Link>
        </div>
        <div className="flex justify-center flex-col items-center mt-2">
          <h1 className="text-4xl font-extrabold text-gray-100 underline">
            Got a question?
          </h1>
          <h2 className="text-3xl">Start a poll...</h2>
        </div>
        <div className="w-full flex justify-center">
          <input
            className="w-full max-w-xl bg-gray-900/70 p-2 rounded-md"
            placeholder="Or search for a question"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <QuestionCards search={search} />
      </div>
    </div>
  );
};

export default Home;
