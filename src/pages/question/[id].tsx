import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["questions.get-by-id", { id }]);

  if (!isLoading && !data) {
    return <div>Question not found</div>;
  }

  return (
    <div className="p-8 flex flex-col h-full min-h-screen gap-2">
      <Link href="/">
        <a>Back</a>
      </Link>
      {data?.isOwner && <div>You made this question!</div>}
      <div>
        <h1 className="font-bold text-2xl">
          {data?.question?.question}
          {`${data?.question?.question.includes("?") ? "" : "?"}`}
        </h1>
        <div>
          {(data?.question?.options as string[])?.map((option) => (
            <div key={(option as any).text}>{(option as any).text}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>NO ID</div>;
  }

  return <QuestionPageContent id={id} />;
};

export default QuestionPage;
