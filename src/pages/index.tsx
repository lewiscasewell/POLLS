import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const client = trpc.useContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries("questions.get-all");
      client.invalidateQueries("questions.get-all-my-questions");
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

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
  const [questionsSelect, setQuestionsSelect] = React.useState();
  const { data: allQuestions, isLoading: allQuestionsIsLoading } =
    trpc.useQuery(["questions.get-all"]);

  const { data: myQuestions, isLoading: myQuestionsIsLoading } = trpc.useQuery([
    "questions.get-all-my-questions",
  ]);

  if (allQuestionsIsLoading || !allQuestions) return <div>Loading...</div>;
  if (myQuestionsIsLoading || !myQuestions) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-6">
      <Head>
        <title>Start a poll</title>
        <meta name="description" content="Got a question? Start a poll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-4">
        <QuestionCreator />
        {myQuestions.length > 0 && (
          <div>
            <div className="flex justify-between items-baseline">
              <h1 className="text-2xl font-bold mb-3">My questions</h1>
              {/* <select>
              <option>All questions</option>
              <option>My questions</option>
            </select> */}
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
