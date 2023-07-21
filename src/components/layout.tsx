import React, { type PropsWithChildren } from "react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

const PageLayout = (props: PropsWithChildren<{}>) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full border-x border-slate-400 md:max-w-3xl ">
        {props.children}
      </div>
    </main>
  );
};

export default PageLayout;
