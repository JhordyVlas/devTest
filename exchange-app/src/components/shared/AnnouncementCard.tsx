import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";

export type Announcement = {
  id: number;
  link: string;
  title: string;
  content: string;
  date: string;
};

export const AnnouncementCard = ({ title, link, content }: Announcement) => {
  return (
    <a
      href={link}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:bg-gray-100"
    >
      <div className="flex h-1/2 w-full justify-center items-center p-16 bg-gray-100">
        <CursorArrowRaysIcon className="h-16 text-gray-600" />
      </div>
      <div className="flex h-1/2 w-full p-3 flex-col space-y-3">
        <h3 className="line-clamp-1">{title}</h3>
        <div
          className="text-gray-500 text-sm line-clamp-4"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </a>
  );
};
