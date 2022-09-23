import React, { useEffect, useRef } from "react";
import { trpc } from "../utils/trpc";
import { add } from "date-fns";

import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../shared/create-question-validator";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";

const CreateQuestionForm: React.FC<{ search: string }> = ({ search }) => {
  const router = useRouter();

  const tomorrow = add(new Date(), { days: 1 });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      question: search,
      endsAt: tomorrow,
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<CreateQuestionInputType>({
      name: "options", // unique name for your Field Array,
      control, // control props comes from useForm (optional: if you are using FormContext)
    });

  const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
  });

  if (isLoading || data)
    return (
      <div className="flex items-center justify-center min-h-screen antialiased">
        <p className="text-white/40">Loading...</p>
      </div>
    );

  console.log(errors);

  return (
    <div className="min-h-screen p-6 antialiased text-gray-100">
      <Head>
        <title>Start a poll</title>
      </Head>
      <header className="flex justify-between w-full header">
        <Link href={"/"}>
          <h1 className="text-lg font-bold cursor-pointer">Back</h1>
        </Link>
      </header>
      <div className="max-w-xl py-12 mx-auto md:max-w-2xl">
        <h2 className="text-2xl font-bold">Create a new poll</h2>

        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
          className="w-full"
        >
          <div className="w-full mt-8">
            <div className="w-full my-10 form-control">
              <label className="label">
                <span className="text-base font-semibold label-text">
                  Your Question
                </span>
              </label>
              <input
                {...register("question")}
                type="text"
                className="block w-full text-gray-500 rounded-md input input-bordered"
                placeholder="Type a question..."
              />
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="grid w-full grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2">
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section
                      className="flex items-center space-x-3"
                      key={field.id}
                    >
                      <input
                        placeholder="Type an option..."
                        {...register(`options.${index}.text`, {
                          required: true,
                        })}
                        className="w-full font-medium text-gray-500 input input-bordered"
                      />
                      <button type="button" onClick={() => remove(index)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </section>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center my-3">
              <button
                type="button"
                value="Add more options"
                className="btn btn-ghost"
                onClick={() => append({ text: "" })}
              >
                Add options
              </button>
            </div>
            <div className="w-full mt-10">
              <input
                type="submit"
                className="w-full btn"
                value="Create question"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: React.FC<{ search: string }> = ({ search }) => {
  return <CreateQuestionForm search={search} />;
};

export default QuestionCreator;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      search: query.search || null,
    },
  };
};
