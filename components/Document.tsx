import { dateConverter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteRoom from "./DeleteRoom";

const Document = ({
  metadata,
  lastConnectionAt,
  roomId,
}: {
  lastConnectionAt: string;
  roomId: string;
  metadata: {
    creatorId: string;
    email: string;
    title: string;
  };
}) => {
  return (
    <div className="flex flex-row flex-nowrap items-center bg-DocumentBg py-4 rounded-md mt-5 gap-x-4">
      <Link
        href={`/document/${roomId}`}
        className=" flex flex-row gap-5 flex-1"
      >
        <div className="pl-3 lg:pl-5">
          <Image
            src={"/assets/icons/doc.svg"}
            alt="Doc Icon"
            width={40}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="col-span-4 flex flex-col">
          <h2 className="line-clamp-1 text-left">
            {metadata.title || "Untitled"}
          </h2>
          <p className="line-clamp-1">
            Created about {dateConverter(lastConnectionAt)}
          </p>
        </div>
      </Link>
      <div className="cursor-pointer mr-3 lg:mr-5">
        <DeleteRoom roomId={roomId} />
      </div>
    </div>
  );
};

export default Document;
