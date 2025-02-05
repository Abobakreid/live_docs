import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    if (onClickHandler) {
      onClickHandler(type);
    }
  };
  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => accessChangeHandler(type)}
    >
      <SelectTrigger className="w-[180px] focus-visible:ring-0 border-none focus-within:ring-0 focus:ring-0 ">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-none !bg-black ">
        <SelectItem value="viewer">can view</SelectItem>
        <SelectItem value="editor">can edit</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
