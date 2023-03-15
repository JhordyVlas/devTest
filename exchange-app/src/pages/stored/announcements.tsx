import { useDebounce } from "@/common/hooks";
import { prisma } from "@/common/libs";
import { Announcement, AnnouncementCard } from "@/components/shared";
import { GetServerSideProps } from "next";
import { ScriptProps } from "next/script";
import { useEffect, useState } from "react";

interface Props extends ScriptProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: Props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(announcements);

  const debounceValue = useDebounce<string>(search);

  useEffect(() => {
    const filtered = announcements.filter((value) =>
      value.title.includes(debounceValue)
    );

    setData(filtered);
  }, [debounceValue, announcements]);

  return (
    <main className="grid grid-cols-3 gap-3">
      <div className="col-span-3 flex w-full bg-white rounded-lg py-3 px-5 shadow justify-between items-center">
        <div>
          <h1 className="text-2xl">Saved announcements</h1>
          <p className="block text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quo
            pariatur
          </p>
        </div>
        <div>
          <input
            type="text"
            className="bg-gray-50 border-2 border-gray-300 rounded text-lg px-2 py-1"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {announcements.length == 0 && (
        <div className="flex justify-center col-span-3 p-10">
          <span className="text-xl">There is no saved announcements yet</span>
        </div>
      )}
      {announcements.length > 0 && data.length == 0 ? (
        <div className="flex justify-center col-span-3 p-10">
          <span className="text-2xl">No results found</span>
        </div>
      ) : (
        data.map((props, index) => <AnnouncementCard {...props} key={index} />)
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const announcements = await prisma.announcements.findMany();

  return {
    props: {
      announcements,
    },
  };
};
