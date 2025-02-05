"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/actions/room.actions";
const ShareDialog = ({
  roomId,
  creatorId,
  currentUserType,
  collaborators,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<string>("viewer");

  const shareDocumentHandler = async () => {
    setLoading(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: user.info,
    });

    setLoading(false);
  };

  // console.log(collaborators, "collaborators");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex gap-1 px-4 bg-white text-black rounded-md py-1"
        disabled={currentUserType !== "editor"}
      >
        <Image
          src="/assets/icons/share.svg"
          alt="share"
          width={20}
          height={20}
          className="min-w-4 md:size-5 invert "
        />
        <p className="mr-1 hidden sm:block">Share</p>
      </DialogTrigger>
      <DialogContent className=" w-full max-w-[400px] rounded-xl border-none bg-cover px-5 py-7 shadow-xl sm:min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>

        <label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </label>
        <div className="flex items-center gap-3 border-[1px] border-solid border-slate-200">
          <div className="flex flex-1 rounded-md focus-within:border-solid focus-within:border-slate-200">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className=" focus-within:outline-none focus-within:border-none focus-within:ring-0 focus-visible:ring-0 rounded-none border-none ring-0 "
            />
            <UserTypeSelector
              userType={currentUserType!}
              setUserType={setUserType}
            />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="flex h-full gap-1 px-5"
            disabled={loading}
          >
            {loading ? "Sending..." : "Invite"}
          </Button>
        </div>

        <div className="my-2 space-y-2">
          <div className="flex flex-col">
            {collaborators &&
              collaborators.length > 0 &&
              collaborators.map((collaborator) => (
                <Collaborator
                  key={collaborator.collaboratorId}
                  roomId={roomId}
                  creatorId={creatorId!}
                  email={collaborator.email}
                  collaborator={collaborator}
                  user={user.info}
                />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
