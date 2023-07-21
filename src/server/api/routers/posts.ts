import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    console.log(posts);

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author?.username && !author.fullName)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "authorId for post not found",
        });

      return {
        post,
        author: {
          ...author,
          username: author?.username ?? author?.fullName,
        },
      };
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed!").min(1).max(200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      return await ctx.prisma.post.create({
        data: { authorId, content: input.content },
      });
    }),
});
