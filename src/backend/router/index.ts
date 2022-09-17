import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db/client";
import superjson from "superjson";
import { questionRouter } from "./questions";
import { createRouter } from "./context";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("questions.", questionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
