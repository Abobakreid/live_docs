"use client";
import { cn } from "@/lib/utils";
import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

export const ActiveCollaborators = () => {
  const otherUsers = useOthers();

  const Collaborators = otherUsers.map((user) => user.info);
  // console.log(Collaborators, "Coll");

  return (
    <div className="flex flex-row">
      {Collaborators.length > 0 &&
        Collaborators.map((collaborator) => (
          <div key={collaborator.id}>
            <Image
              src={collaborator.avatar}
              alt="collaborator icon"
              width={100}
              height={100}
              className={cn(
                "object-contain size-9 rounded-full ring-2 ring-white border-1",
                `border-[${collaborator.color}]`
              )}
            />
          </div>
        ))}
    </div>
  );
};
