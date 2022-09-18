import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [questionsSelect, setQuestionsSelect] = React.useState();
  const { data: allQuestions, isLoading: allQuestionsIsLoading } =
    trpc.useQuery(["questions.get-all"]);

  const { data: myQuestions, isLoading: myQuestionsIsLoading } = trpc.useQuery([
    "questions.get-all-my-questions",
  ]);

  if (allQuestionsIsLoading || !allQuestions) return <div>Loading...</div>;
  if (myQuestionsIsLoading || !myQuestions) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-6 max-w-2xl mx-auto h-full min-h-screen">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-10">
        <div className="flex justify-center flex-col items-center mt-2">
          <h1 className="text-4xl font-extrabold text-gray-100 underline">
            Got a question?
          </h1>
          <h2 className="text-3xl">Start a poll...</h2>
          <div className="mt-7 flex gap-5">
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
        </div>
        {/* <>
          {myQuestions.length > 0 && (
            <div>
              <div className="flex justify-between items-baseline">
                <h1 className="text-2xl font-bold mb-3">My questions</h1>
            
              </div>
              <div className="flex flex-col-reverse gap-2">
                {myQuestions.map((question) => {
                  return (
                    <Link key={question.id} href={`/question/${question.id}`}>
                      <a>
                        <span>{question.question}</span>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </> */}
        <div>
          <div className="flex justify-between items-baseline">
            <h1 className="text-2xl font-bold mb-3">Questions asked</h1>
            {/* <select>
              <option>All questions</option>
              <option>My questions</option>
            </select> */}
          </div>
          <div className="flex flex-col-reverse gap-2">
            {allQuestions.map((question) => {
              return (
                <Link key={question.id} href={`/question/${question.id}`}>
                  <div className="flex flex-col bg-gray-900 p-3 rounded-lg cursor-pointer shadow-lg">
                    <a className="font-semibold text-lg">{question.question}</a>

                    <span className=" text-xs">
                      {question.createdAt.toDateString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
