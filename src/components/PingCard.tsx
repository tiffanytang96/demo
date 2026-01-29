"use client";

import { motion } from "framer-motion";

interface Ping {
  id: string;
  title: string;
  column: "Inbox" | "In Progress" | "Done";
  tags?: string[];
  priority?: "low" | "medium" | "high";
  createdAt: string;
}

interface PingCardProps {
  ping: Ping;
  onEdit: (ping: Ping) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newColumn: Ping["column"]) => void;
}

export default function PingCard({ ping, onEdit, onDelete, onMove }: PingCardProps) {
  const priorityColors = {
    low: "border-l-blue-400",
    medium: "border-l-yellow-400",
    high: "border-l-red-400",
  };

  const priorityBadgeColors = {
    low: "badge-info",
    medium: "badge-warning",
    high: "badge-error",
  };

  const columnOptions: Ping["column"][] = ["Inbox", "In Progress", "Done"];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className={`card bg-base-100 shadow-sm border-l-4 ${
        ping.priority ? priorityColors[ping.priority] : "border-l-base-300"
      } cursor-pointer`}
      onClick={() => onEdit(ping)}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{
        scale: 1.05,
        boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.25), 0 10px 20px -2px rgba(0, 0, 0, 0.15)",
        cursor: "grabbing",
        rotate: 2
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="card-body p-4 gap-3">
        {/* Header: Drag handle + Priority + Delete */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {/* Drag handle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-base-content/40 cursor-grab active:cursor-grabbing flex-shrink-0"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"
              />
            </svg>

            {/* Priority badge */}
            {ping.priority && (
              <span className={`badge badge-sm ${priorityBadgeColors[ping.priority]}`}>
                {ping.priority}
              </span>
            )}
          </div>

          {/* Delete button */}
          <button
            className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ping.id);
            }}
            aria-label="Delete ping"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium leading-snug text-base-content">
          {ping.title}
        </h3>

        {/* Tags */}
        {ping.tags && ping.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ping.tags.map((tag, index) => (
              <span key={index} className="badge badge-neutral badge-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Timestamp + Move dropdown */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs text-base-content/60">
            {formatTimestamp(ping.createdAt)}
          </span>

          {/* Move to column dropdown */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-xs text-base-content"
              onClick={(e) => e.stopPropagation()}
            >
              Move
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-3 h-3"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-40 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {columnOptions
                .filter((col) => col !== ping.column)
                .map((col) => (
                  <li key={col}>
                    <a onClick={() => onMove(ping.id, col)} className="text-base-content">{col}</a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export type { Ping, PingCardProps };
