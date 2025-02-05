declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];

declare type RoomAccesses = Record<string, AccessType>;

declare type AddDocumentProps = {
  userId: string;
  userEmail: string;
};

declare type UserType = "creator" | "editor" | "viewer";

declare type ShareDocumentDialogProps = {
  roomId: string;
  collaborators?: User[];
  creatorId?: string;
  currentUserType?: UserType;
};

declare type UserTypeSelectorParams = {
  userType: string;
  setUserType: Dispatch<React.SetStateAction<UserType>>;
  onClickHandler?: (value: string) => void;
};

declare type CollaboratorProps = {
  roomId: string;
  email: string;
  creatorId: string;
  collaborator: User;
  user: User;
};

declare type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  userType?: UserType;
  collaboratorId?: string;
};

declare type ShareDocumentParams = {
  roomId: string;
  email: string;
  userType: UserType;
  updatedBy: User;
};

declare type DeleteModalProps = { roomId: string };
