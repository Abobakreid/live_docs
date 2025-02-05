// import { ActiveCollaborators } from "@/components/ActiveCollaborators";
import { getAllDocuments } from "@/actions/room.actions";
import AddDocument from "@/components/AddDocument";
import Document from "@/components/Document";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Home = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-up");
  const { id, emailAddresses } = user;
  const documents = await getAllDocuments(emailAddresses[0].emailAddress);
  return (
    <main className="flex flex-col gap-y-48 h-full">
      <Header>
        <Notifications />
        <SignedIn>
          <UserButton />
        </SignedIn>
        {/* <ActiveCollaborators /> */}
      </Header>
      {documents.length > 0 ? (
        <section className="w-full lg:max-w-[1000px] mx-auto mt-5">
          <div className="flex flex-row justify-between mb-4 items-center">
            <h2 className="font-extrabold text-[clamp(1.5rem,5vw,2rem)]">
              All Documents
            </h2>
            <AddDocument
              userId={id}
              userEmail={emailAddresses[0].emailAddress}
            />
          </div>
          {documents.map(
            (doc: {
              lastConnectionAt: string;
              id: string;
              metadata: {
                creatorId: string;
                email: string;
                title: string;
              };
            }) => (
              <Document
                key={doc.id}
                roomId={doc.id}
                lastConnectionAt={doc.lastConnectionAt}
                metadata={doc.metadata}
              />
            )
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <Image
            src={"/assets/icons/doc.svg"}
            alt="doc icon"
            width={100}
            height={100}
            className="object-contain mb-3"
          />
          <AddDocument userId={id} userEmail={emailAddresses[0].emailAddress} />
        </div>
      )}
    </main>
  );
};

export default Home;
