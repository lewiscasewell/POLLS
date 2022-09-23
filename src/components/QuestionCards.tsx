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
      <div className="flex flex-col bg-gray-900/30 rounded-lg cursor-pointer shadow-lg h-[240px]">
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
  const { data: allQuestions, isLoading: allQuestionsIsLoading } =
    trpc.useQuery(["questions.get-all", { search }]);

  if (allQuestionsIsLoading || !allQuestions)
    return (
      <div className="flex w-full h-full justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-baseline">
        <h1 className="text-2xl font-bold">Questions asked</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {allQuestions.map((question) => {
          return <QuestionCard key={question.id} question={question} />;
        })}
      </div>
    </div>
  );
};

export default QuestionCards;
