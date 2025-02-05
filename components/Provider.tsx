"use client";

import { ReactNode } from "react";

import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { getClerkUsers, getDocumentUsers } from "@/actions/user.actions";
import { useUser } from "@clerk/nextjs";

export function Provider({ children }: { children: ReactNode }) {
  const { user: clerkUser } = useUser();
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      // publicApiKey={
      //   "pk_dev_4rTc3jStArI9j6rylb8GzEj4JKthVw7orb3atun9qeXZth0kAI1EYKv8ilceylDs"
      // }
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser:
            clerkUser?.emailAddresses[0]?.emailAddress || "undefined",
          text,
        });

        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
}
