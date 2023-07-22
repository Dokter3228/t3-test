import Head from "next/head";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/LoadingSpinner";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import PageLayout from "~/components/layout";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUserName.useQuery({
    username,
  });

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>404</div>;

  console.log(data);

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <PageLayout>
        <div className="border-b border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={username + "'s profile pic"}
            width={48}
            height={48}
          />
          <div>{username}</div>
        </div>
      </PageLayout>
    </>
  );
};

import { prisma } from "~/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetStaticProps, type NextPage } from "next";
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context?.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");
  function replaceEncodedSpaces(str: string) {
    return str.replace(/@|%20/g, function (match) {
      if (match === "@") {
        return "";
      } else if (match === "%20") {
        return " ";
      } else {
        return "";
      }
    });
  }
  const username = replaceEncodedSpaces(slug);

  await ssg.profile.getUserByUserName.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
    revalidate: 60,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
