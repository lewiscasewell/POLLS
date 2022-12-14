import React, { useEffect, useRef, useState } from "react";
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

const CreateQuestionForm: React.FC = () => {
  const router = useRouter();
  const questionUrl = router.asPath.split("/create?")[1]?.replace(/%20/g, " ");
  console.log();
  const tomorrow = add(new Date(), { days: 1 });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      question: questionUrl,
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
      <div className="min-h-screen w-full flex justify-center">
        <p className="mt-20">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4 antialiased text-gray-100">
      <Head>
        <title>Start a poll</title>
      </Head>
      <header className="flex justify-between w-full">
        <Link href={"/"}>
          <h1 className="text-lg font-bold cursor-pointer">Back</h1>
        </Link>
      </header>
      <div className=" max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold">Create a new poll</h2>
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
          className="w-full mt-5"
        >
          <div className="w-full">
            <div className="w-full">
              <input
                {...register("question")}
                type="text"
                className="w-full rounded-md p-3 bg-gray-900/70 mb-4"
                placeholder="Type a question..."
              />
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-2">
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
                        className="w-full font-medium rounded-md p-3 bg-gray-900/70"
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
            <div className="flex items-center justify-center my-6">
              <button
                type="button"
                value="Add more options"
                className="border-2 rounded-md p-2"
                onClick={() => append({ text: "" })}
              >
                Add another option
              </button>
            </div>
            <div className="w-full mt-10">
              <input
                type="submit"
                className="bg-gray-700/50 w-full p-2 font-bold rounded-md hover:bg-gray-700 transition-colors ease-in"
                value="Create question"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: React.FC = () => {
  return <CreateQuestionForm />;
};

export default QuestionCreator;
