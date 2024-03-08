import dayjs from "dayjs";

import useConversationStore, {
  Conversation,
} from "@/state/useConversationStore";

interface ConversationsProps {
  data: { [key: string]: Conversation[] };
}

const Conversations = ({ data }: ConversationsProps) => {
  const { selectedConversationId, setSelectedConversationId } =
    useConversationStore();

  const dataKeys = Object.keys(data).map((key) => key);
  const sortedDatakeys: string[] = dataKeys
    .slice()
    .sort((a, b) => dayjs(b).diff(dayjs(a)));

  function getTitle(text: string) {
    const today = dayjs();
    const year = dayjs(text).format("YYYY");
    const yearDiff = dayjs().diff(text, "year");

    if (yearDiff === 0) {
      if (today.isSame(text, "day")) {
        return "Today";
      } else if (today.subtract(1, "day").isSame(text, "day")) {
        return "Yesterday";
      } else if (today.subtract(7, "day").isSame(text, "day")) {
        return "Previous 7 Days";
      } else if (today.subtract(30, "day").isSame(text, "day")) {
        return "Previous 30 Days";
      } else {
        return dayjs(text).format("MMMM");
      }
    } else if (yearDiff === 1) {
      return "Last Year";
    } else {
      return year;
    }
  }

  return (
    <div className="flex-col flex-1 w-full h-full min-h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] overflow-y-auto">
      {sortedDatakeys.map((key: string, i) => {
        return (
          <div key={`${key}_${i}`} className="relative mt-5">
            <p className="h-9 pb-2 pt-3 px-2 text-xs font-semibold text-gray-400 text-ellipsis overflow-hidden break-all">
              {getTitle(key)}
            </p>
            <ul>
              {data[key].map(({ name, id }: Conversation, i: number) => (
                <li
                  key={`conversation_${i}`}
                  className={`w-full p-2 ${selectedConversationId === id ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer`}
                  onClick={() => setSelectedConversationId(id as number)}
                >
                  <div className="relative grow overflow-hidden whitespace-nowrap text-start">
                    {name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Conversations;
