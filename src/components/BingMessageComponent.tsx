import dayjs from "dayjs";

interface BingMessageComponentProps {
  message: string;
}

interface ParsedMessage {
  id: string;
  name: string;
  snippet: string;
  url: string;
  datePublished: string;
}

const BingMessageComponent = ({ message }: BingMessageComponentProps) => {
  const parsedMessage = message ? JSON.parse(message) : "";

  return (
    <div className="flex flex-col gap-1">
      {message &&
        parsedMessage.map((content: ParsedMessage, i: number) => {
          return (
            <a
              href={content.url}
              key={content.id}
              target="_blank"
              className="flex flex-col gap-1 p-1"
              rel="noreferrer"
            >
              <div className="text-blue-800 font-bold truncate">
                {i + 1}. {content.name}
              </div>

              <div className="text-sm text-gray-500 line-clamp-3">
                {content.datePublished &&
                  dayjs(content.datePublished).format("YYYY. MM. DD")}
                {content.datePublished && <span className="mx-2">—</span>}
                {content.snippet}
              </div>
            </a>
          );
        })}
    </div>
  );
};

export default BingMessageComponent;
