import { getDocument } from "@/actions/room.actions";
import { getClerkUsers } from "@/actions/user.actions";
import { ActiveCollaborators } from "@/components/ActiveCollaborators";
import Header from "@/components/Header";
import { Room } from "@/components/Room";
import ShareDialog from "@/components/ShareDialog";
import Editor from "@/components/TextEditor";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
const Document = async ({
  params: { documentId },
}: {
  params: { documentId: string };
}) => {
  const user = await currentUser();
  if (!user) redirect("/sign-up");

  const room = await getDocument({
    // userId: user.id,
    roomId: documentId,
  });

  if (!room) redirect("/");

  const emails = Object.keys(room.usersAccesses);
  const newEmails = emails.map((email) => email.trim());
  const clerksUsers = await getClerkUsers({ userIds: newEmails });
  // console.log(clerksUsers, "clerksUsers");
  const usersData = clerksUsers?.map((user: User) => {
    const collaboratorId = uuidv4();
    return {
      ...user,
      userType: "viewer",
      collaboratorId,
    };
  });

  // console.log(newEmails, "users lovop");

  const currentType = room.usersAccesses[
    user.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  // console.log(usersData, "session");
  return (
    <Room roomId={documentId}>
      <Header
        roomMetaData={room?.metadata}
        roomId={documentId}
        currentUserType={currentType}
      >
        <ShareDialog
          roomId={documentId}
          creatorId={user.id}
          currentUserType={currentType}
          collaborators={usersData!}
        />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ActiveCollaborators />
      </Header>
      {/* roomId={documentId} */}
      <Editor currentType={currentType} roomId={documentId} />
    </Room>
  );
};

export default Document;
