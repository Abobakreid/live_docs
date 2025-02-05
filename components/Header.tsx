"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/actions/room.actions";

const Header = ({
  children,
  currentUserType,
  roomMetaData,
  roomId,
}: {
  children: ReactNode;
  roomId?: string;
  currentUserType?: string;
  roomMetaData?: {
    creatorId: string;
    email: string;
    title: string;
  };
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [docTitle, setDocTitle] = useState<string>(roomMetaData?.title || "");
  // const [Data, setData] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);

      try {
        if (docTitle) {
          const updatedDocument = await updateDocument({
            metadata: {
              title: docTitle,
            },
            roomId: roomId!,
          });

          if (updatedDocument) {
            setEdit(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const handleFocusedOut = async (e: MouseEvent) => {
      // console.log(e.target, "focused");
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        await updateDocument({
          metadata: {
            title: docTitle,
          },
          roomId: roomId!,
        });
        setEdit(false);
      }
    };

    document.addEventListener("mousedown", handleFocusedOut);

    return () => {
      document.removeEventListener("mousedown", handleFocusedOut);
    };
  }, [edit, docTitle, roomId]);

  useEffect(() => {
    if (edit && !loading) {
      inputRef.current?.focus();
    }
  }, [edit, loading]);

  return (
    <header className="flex flex-row flex-nowrap justify-between items-center py-6">
      <h2 className="text-lg">LiveDocs</h2>
      {roomMetaData && (
        <div ref={containerRef} className="flex flex-row gap-x-2 items-center">
          {edit && !loading ? (
            <Input
              type="text"
              className="bg-none ring-0 outline-none focus-visible:outline-none focus-visible:ring-0 border-0 min-w-96"
              value={docTitle}
              ref={inputRef}
              onChange={(e) => setDocTitle(e.target.value)}
              onKeyDown={updateTitleHandler}
            />
          ) : (
            <p className="text-lg font-semibold">{docTitle}</p>
          )}
          {loading && <p>Loading.....</p>}

          {currentUserType === "editor" && !edit && (
            <Image
              src={"/assets/icons/edit.svg"}
              alt="edit title icon"
              width={100}
              height={100}
              className="object-contain size-8 cursor-pointer"
              onClick={() => setEdit(true)}
            />
          )}

          {currentUserType !== "editor" && !edit && (
            <p className="rounded-md bg-black/50 px-2 py-0.5 text-xs text-blue-100/50">
              View only
            </p>
          )}
        </div>
      )}

      <div className="flex flex-row gap-2 items-center">{children}</div>
    </header>
  );
};

export default Header;
