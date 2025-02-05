"use server";

import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { liveblocks } from "@/lib/liveblocks";
import { getAccessType, parseStringify } from "@/lib/utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const roomId = uuidv4();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/");
    return room;
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`);
  }
};

export const getDocument = async ({
  // userId,
  roomId,
}: {
  // userId: string;
  roomId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const hasAccess = Object.keys(room.usersAccesses);
    if (!hasAccess) {
      throw new Error("You cannot access this room");
    }

    // revalidatePath("/");
    // console.log(hasAccess, "hasAccess");
    // console.log(room.usersAccesses, "hasAccess");
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while get a room: ${error}`);
  }
};

export const updateDocument = async ({
  metadata,
  roomId,
}: {
  metadata: {
    title: string;
  };
  roomId: string;
}) => {
  try {
    const room = await liveblocks.updateRoom(roomId, {
      metadata,
    });

    revalidatePath(`/document/${roomId}`);
    return room;
  } catch (error) {
    console.log(`Error happened while get a room: ${error}`);
  }
};

export const getAllDocuments = async (userId: string) => {
  try {
    const rooms = await liveblocks.getRooms({
      userId,
    });

    // revalidatePath(`/`);
    return parseStringify(rooms.data);
  } catch (error) {
    console.log(`Error happened while get a All rooms: ${error}`);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    const roomre = await liveblocks.getRoom(roomId);

    // console.log(roomre, "Updated re");

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const newEmail = email.trim();
    const usersAccesses: RoomAccesses = {
      [newEmail]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    // console.log(room, "Updated add");

    if (room) {
      const roomId = uuidv4();
      await liveblocks.triggerInboxNotification({
        userId: newEmail,
        kind: "$documentAccess",
        subjectId: roomId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      });
    }

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
  }
};
