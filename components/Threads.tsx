"use client";

import { useThreads } from "@liveblocks/react";

import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { cn } from "@/lib/utils";
import { ThreadData } from "@liveblocks/node";

const ThreadWrapper = ({ thread }: { thread: ThreadData }) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? "active" : null}
      className={cn(
        "w-full max-w-[800px] border shadow-sm lg:w-[350px] transition-all",
        isActive && "!border-blue-500 shadow-md",
        thread.resolved && "opacity-40"
      )}
    />
  );
};
export function Threads() {
  const { threads } = useThreads();

  return (
    <div className="mb-10 space-y-4 lg:w-fit flex w-full flex-col items-center justify-center">
      <Composer className="w-full max-w-[800px]  border shadow-sm lg:w-[350px]" />

      {threads?.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
    // <>
    //   {/* <div className="anchored-threads">
    //     <AnchoredThreads threads={threads} />
    //   </div>
    //   <FloatingThreads className="floating-threads" threads={threads} />
    //   <FloatingComposer className="floating-composer" /> */}
    // </>
  );
}
