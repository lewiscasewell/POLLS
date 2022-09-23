import { intervalToDuration } from "date-fns";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

type QuestionProps = {
  question: { id: string; createdAt: Date; endsAt: Date; question: string };
};

const QuestionCard: React.FC<QuestionProps> = ({ question }) => {
  const [now, setNow] = React.useState(new Date());
  const { hours, minutes, seconds } = intervalToDuration({
    start: now,
    end: question.endsAt,
  });

  React.useEffect(() => {
    if (question.endsAt > new Date()) {
      const timer = setTimeout(() => setNow(new Date()), 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <Link href={`/question/${question.id}`}>
      <div className="flex flex-col bg-gray-900/50 hover:bg-gray-900/30 transition-colors ease-in rounded-lg cursor-pointer shadow-lg h-[240px]">
        <div className="h-full flex justify-center items-center text-center">
          {question.endsAt > new Date() && (
            <div>
              <p>TIME REMAINING</p>
              <h1 className="text-6xl ">{`${hours?.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}:${minutes?.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}:${seconds?.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}`}</h1>
            </div>
          )}
          {question.endsAt < new Date() && (
            <div>
              <Link href={`/question/${question.id}`}>
                <button className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in">
                  View results
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col bg-gray-900 rounded-b-lg">
          <a className="font-semibold text-lg text-pink-400">
            {question.question}
          </a>
          <span className=" text-xs">{question.createdAt.toDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

const QuestionCards: React.FC<{ search: string }> = ({ search }) => {
  const { data, isLoading, fetchNextPage, hasNextPage } = trpc.useInfiniteQuery(
    ["questions.get-all", { search, limit: 10 }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading || !data)
    return (
      <div className="flex w-full h-full justify-center items-center">
        Loading...
      </div>
    );

  console.log(data);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-baseline">
        <h1 className="text-2xl font-bold text-center">
          {data?.pages[0]?.allQuestions.length === 0
            ? "No results"
            : "Questions asked"}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {data.pages.map((page) => {
          return page.allQuestions.map((question) => {
            return <QuestionCard key={question.id} question={question} />;
          });
        })}
      </div>
      {data?.pages[0]?.allQuestions.length === 0 ? (
        <div className="w-full flex justify-center mt-10 items-center">
          <Link href={{ pathname: "create", search }}>
            <button className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in shadow-xl shadow-pink-500/30">
              Ask this question
            </button>
          </Link>
        </div>
      ) : (
        <>
          {hasNextPage && (
            <button onClick={() => fetchNextPage()}>fetch</button>
          )}
          {!hasNextPage && (
            <div className="w-full flex flex-col justify-center mt-5 gap-3 items-center">
              <p>No more questions</p>
              <Link href="/create">
                <button className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in shadow-xl shadow-pink-500/30">
                  Ask a question
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionCards;
