import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery(["questions.get-by-id", { id }]);
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
    return (
      <div className="min-h-screen w-full flex justify-center">
        <p className="mt-20">
          {isLoading ? "Loading..." : "Question not found"}
        </p>
      </div>
    );
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

  const newArray = (data?.question?.options as string[]).map(
    (option, index) => ({ index, text: (option as any).text })
  );

  let merged = [];

  for (let i = 0; i < newArray.length; i++) {
    merged.push({
      ...newArray[i],
      ...data.votes?.find(
        (itemInnder) => itemInnder.choice === newArray[i]?.index
      ),
    });
  }

  const shareLink = `https://polls.lewiscasewell.com${router.asPath}`;

  return (
    <div className="max-w-5xl p-4 mx-auto min-h-screen">
      <Head>
        <title>{data?.question?.question}</title>
      </Head>
      <header className="flex items-center justify-between w-full mb-10">
        <Link href={"/"}>
          <h1 className="text-xl font-bold cursor-pointer">Back</h1>
        </Link>
        {data?.isOwner && (
          <div className="p-3 bg-gray-700 rounded-md">You made this!</div>
        )}
      </header>

      <main className="max-w-2xl mx-auto h-full">
        <>
          <h1 className="mb-10 text-2xl font-bold text-center">
            {data?.question?.question}
          </h1>
          <div className="flex flex-col gap-4">
            {merged.map((option, index) => {
              if (
                data?.isOwner ||
                data?.vote ||
                (data?.question && data?.question?.endsAt < new Date())
              ) {
                if (option._count) {
                  return (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="flex justify-between">
                        <p>{option.text}</p>
                        <p>{getPercent(option._count)?.toFixed()}%</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          style={{
                            width: `${getPercent(option._count)?.toFixed()}%`,
                          }}
                          className={`h-2 bg-pink-500 rounded`}
                        />
                      </div>
                      <div>
                        <p>{option._count} votes</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="flex justify-between">
                        <p>{option.text}</p>
                        <p>0%</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          style={{
                            width: `0%`,
                          }}
                          className={`h-2 bg-pink-500 rounded`}
                        />
                      </div>
                      <div>
                        <p>0 votes</p>
                      </div>
                    </div>
                  );
                }
              }
              return (
                <button
                  onClick={() =>
                    mutate({ questionId: data.question!.id, option: index })
                  }
                  key={index}
                  className="bg-gray-700/50 p-2 font-bold rounded-md hover:bg-gray-700 transition-colors ease-in"
                >
                  {(option as any).text}
                </button>
              );
            })}
          </div>
        </>
        <div className="mt-12 flex justify-center w-full gap-4">
          {data?.question && data?.question?.endsAt < new Date() && (
            <Link href={{ pathname: "create", search: data.question.question }}>
              <button className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in shadow-xl shadow-pink-500/30">
                Ask this again
              </button>
            </Link>
          )}
          <button
            onClick={() => {
              navigator
                .share({
                  title: data.question?.question,
                  text: data.question?.question,
                  url: router.asPath,
                })
                .catch(() => navigator.clipboard.writeText(shareLink));
            }}
            className="bg-pink-500 p-2 font-bold rounded-md hover:bg-pink-600 transition-colors ease-in shadow-xl shadow-pink-500/30"
          >
            Share question
          </button>
        </div>
      </main>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return (
      <div className="min-h-screen w-full flex justify-center">
        <p className="mt-20">Loading...</p>
      </div>
    );
  }

  return <QuestionsPageContent id={id} />;
};

export default QuestionPage;
