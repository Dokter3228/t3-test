import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      let [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        [user] = await clerkClient.users.getUserList({
          // @ts-ignore
          lastname: input.username.split(" ")[1],
        });
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }
      }

      console.log(user);

      return filterUserForClient(user);
    }),
});
