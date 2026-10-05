import type { IdeaIconName } from "@/types/content";

type IconName = IdeaIconName | "link" | "plus" | "check" | "whatsapp" | "restart" | "back" | "close";

const paths: Record<IconName, string> = {
  calendar: "M4 6.5h16v13H4zM4 10.5h16M8.5 4v4M15.5 4v4",
  gear: "M12 9.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5ZM12 3.5l1.6 2.3 2.75-.6.6 2.75L19.5 9.5 18.3 12l1.2 2.5-2.55 1.55-.6 2.75-2.75-.6L12 20.5l-1.6-2.3-2.75.6-.6-2.75L4.5 14.5 5.7 12 4.5 9.5l2.55-1.55.6-2.75 2.75.6Z",
  monitor: "M3.5 5h17v11h-17zM9 20h6M12 16v4",
  bulb: "M9.5 17.5h5M10 20.5h4M12 3.5a5.5 5.5 0 0 0-3.2 10c.5.4.7.9.7 1.5v1h5v-1c0-.6.2-1.1.7-1.5A5.5 5.5 0 0 0 12 3.5Z",
  compass: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM15.5 8.5l-2 5-5 2 2-5Z",
  search: "M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM15 15l5 5",
  chart: "M5 20v-5M10 20V9M15 20v-7M20 20V5",
  users: "M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 19.5c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5M16 4.8a3.5 3.5 0 0 1 0 6.4M17.5 15.3c1.8.6 3 2 3.5 4.2",
  flow: "M4 6.5h5v4H4zM15 13.5h5v4h-5zM9 8.5h3.5v7H15",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  sparkle: "M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5ZM18.5 16.5c.2 1.3.7 1.8 2 2-1.3.2-1.8.7-2 2-.2-1.3-.7-1.8-2-2 1.3-.2 1.8-.7 2-2Z",
  pin: "M12 20.5s6-5.4 6-10.5a6 6 0 1 0-12 0c0 5.1 6 10.5 6 10.5ZM12 7.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z",
  cube: "M12 3.5 19.5 7.5v9L12 20.5 4.5 16.5v-9ZM4.5 7.5 12 11.5l7.5-4M12 11.5v9",
  phone: "M7.5 3.5h9v17h-9zM11 17.5h2",
  bag: "M5 8h14l-1 12.5H6ZM9 8V7a3 3 0 0 1 6 0v1",
  link: "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1",
  plus: "M12 5v14M5 12h14",
  check: "M5.5 12.5l4 4 9-9",
  whatsapp:
    "M4.5 19.5l1.1-3.9A8 8 0 1 1 8.6 18.4ZM9.2 8.2c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.7-.1l1.5.7c.3.1.4.3.4.5v.5c0 .4-.2.9-.7 1.2-.6.4-1.6.5-3-.1-1.8-.8-3.4-2.4-4.2-4.2-.6-1.3-.4-2.4 0-3.1Z",
  restart: "M5 12a7 7 0 1 0 2.05-4.95M5 4.5V8h3.5",
  back: "M19 12H5M10.5 6.5 5 12l5.5 5.5",
  close: "M6.5 6.5l11 11M17.5 6.5l-11 11",
};

type IdeaIconProps = Readonly<{
  name: IconName;
  className?: string;
}>;

export function IdeaIcon({ name, className }: IdeaIconProps) {
  return (
    <svg
      className={className ? `idea-icon ${className}` : "idea-icon"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
