import * as trpc from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { id } from "date-fns/locale";
import { initScriptLoader } from "next/script";
import { createDeflate } from "zlib";
import { z } from "zod";
import { prisma } from "../../db/client";
import { createQuestionValidator } from "../../shared/create-question-validator";
import { createRouter } from "./context";

export const questionRouter = createRouter()
  .query("get-all", {
    input: z.object({
      search: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ input }) {
      const limit = input.limit ?? 5;
      const { cursor } = input;

      const allQuestions = await prisma.pollQuestion.findMany({
        take: limit + 1,
        where: {
          question: {
            contains: input.search,
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: string | undefined = undefined;
      if (allQuestions.length > limit) {
        const nextItem = allQuestions.pop();
        nextCursor = nextItem!.id;
      }

      return {
        allQuestions,
        nextCursor,
      };
    },
  })
  .query("get-all-my-questions", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];

      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
    },
  })
  .query("get-by-id", {
    input: z.object({ id: z.string() }),

    async resolve({ input, ctx }) {
      const question = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });

      const myVote = await prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      });

      const rest = {
        question,
        vote: myVote,
        isOwner: question?.ownerToken === ctx.token,
      };

      const votes = await prisma.vote.groupBy({
        where: {
          questionId: input.id,
        },
        by: ["choice"],
        _count: true,
      });

      return {
        ...rest,
        votes,
      };
    },
  })
  .mutation("vote-on-question", {
    input: z.object({
      questionId: z.string(),
      option: z.number().min(0).max(10),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("Unauthroized");
      await prisma.vote.create({
        data: {
          questionId: input.questionId,
          choice: input.option,
          voterToken: ctx.token,
        },
      });

      return await prisma.vote.groupBy({
        where: { questionId: input.questionId },
        by: ["choice"],
        _count: true,
      });
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("Unauthorized");
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          endsAt: input.endsAt,
          ownerToken: ctx.token,
        },
      });
    },
  });
