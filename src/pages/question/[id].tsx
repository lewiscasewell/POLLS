import { PollQuestion, Prisma, Vote } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data } = trpc.useQuery(["questions.get-by-id", { id }]);
  let totalVotes = 0;

  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.vote-on-question",
    {
      onSuccess: () => {
        voteResponse?.map((choice: { _count: number }) => {
          totalVotes += choice._count;
        });
        window.location.reload();
      },
    }
  );

  if (!data || !data?.question) {
    return <div>Question not found</div>;
  }

  const getTotalVotes = (votes: any) => {
    votes?.map((choice: { _count: number }) => {
      totalVotes += choice._count;
    });
  };

  const getPercent = (voteCount: any) => {
    if (voteCount !== undefined && totalVotes > 0)
      return (voteCount / totalVotes) * 100;
    else if (voteCount == undefined) return 0;
  };

  if (data && data != undefined) getTotalVotes(data.votes);
  console.log(totalVotes);
  return (
    <div className="container w-screen min-h-screen p-6">
      <Head>
        <title>Question | {data?.question?.question}</title>
      </Head>
      <header className="flex items-center justify-between w-full mb-10">
        <Link href={"/"}>
          <h1 className="text-xl font-bold cursor-pointer">Back</h1>
        </Link>
        {data?.isOwner && (
          <div className="p-3 bg-gray-700 rounded-md">You made this!</div>
        )}
      </header>

      <main className="max-w-2xl mx-auto">
        <h1 className="mb-10 text-2xl font-bold text-center">
          {data?.question?.question}
        </h1>

        <div className="flex flex-col gap-4">
          {(data?.question?.options as string[])?.map((option, index) => {
            if (data?.isOwner || data?.vote) {
              return (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="font-bold">{(option as any).text}</p>
                    <p>
                      {getPercent(data?.votes?.[index]?._count)?.toFixed()}%
                    </p>
                  </div>
                  <progress
                    className="w-full progress progress-secondary"
                    value={data?.votes?.[index]?._count ?? 0}
                    max={totalVotes}
                  ></progress>
                  <p>
                    {!data?.votes?.[index]?._count
                      ? "No"
                      : data?.votes?.[index]?._count}{" "}
                    {data?.votes?.[index]?._count === 1 ? "vote" : "votes"}
                  </p>
                </div>
              );
            }

            return (
              <button
                onClick={() =>
                  mutate({ questionId: data.question!.id, option: index })
                }
                key={index}
                className="btn"
              >
                {(option as any).text}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <QuestionsPageContent id={id} />;
};

export default QuestionPage;
