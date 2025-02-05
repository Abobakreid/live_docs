"use client";
import { createDocument } from "@/actions/room.actions";
import { useRouter } from "next/navigation";
import React from "react";

const AddDocument = ({ userId, userEmail }: AddDocumentProps) => {
  const router = useRouter();

  const handleCreateDocument = async () => {
    try {
      const room = await createDocument({
        userId,
        email: userEmail,
      });
      if (room) router.push(`/document/${room.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={handleCreateDocument} className="bg-[#3371ff] px-4 py-2">
        + Start a blank Document
      </button>
    </div>
  );
};

export default AddDocument;
