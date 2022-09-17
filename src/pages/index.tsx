import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const client = trpc.useContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries("questions.get-all");
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  return (
    <input
      ref={inputRef}
      disabled={isLoading}
      placeholder="Ask a question..."
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          mutate({ question: event.currentTarget.value });
          event.currentTarget.value = "";
        }
      }}
    />
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);

  console.log(data);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-6">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-4">
        <QuestionCreator />
        <div>
          <h1 className="text-2xl font-bold mb-3">Questions asked</h1>
          <div className="flex flex-col-reverse gap-2">
            {data.map((question) => {
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
      </div>
    </div>
  );
};

export default Home;
