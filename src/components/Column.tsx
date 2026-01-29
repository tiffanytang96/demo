"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PingCard, { Ping } from "./PingCard";

interface ColumnProps {
  columnName: "Inbox" | "In Progress" | "Done";
  pings: Ping[];
  onAddPing: (column: Ping["column"]) => void;
  onEditPing: (ping: Ping) => void;
  onDeletePing: (id: string) => void;
  onMovePing: (id: string, newColumn: Ping["column"]) => void;
}

export default function Column({
  columnName,
  pings,
  onAddPing,
  onEditPing,
  onDeletePing,
  onMovePing,
}: ColumnProps) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  return (
    <motion.div
      className={`flex flex-col h-full bg-base-200 rounded-xl p-4 min-w-[320px] max-w-[380px] flex-shrink-0 transition-all duration-200 ${
        isDraggedOver ? "ring-2 ring-primary ring-opacity-50 bg-primary/5" : ""
      }`}
      onDragEnter={() => setIsDraggedOver(true)}
      onDragLeave={() => setIsDraggedOver(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => setIsDraggedOver(false)}
      layout
      animate={{
        scale: isDraggedOver ? 1.01 : 1,
        boxShadow: isDraggedOver 
          ? "0 0 20px rgba(var(--color-primary), 0.3)" 
          : "none",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-base-content">{columnName}</h2>
          <span className="badge badge-sm badge-neutral">{pings.length}</span>
        </div>
        <button
          className="btn btn-ghost btn-sm btn-circle text-base-content"
          onClick={() => onAddPing(columnName)}
          aria-label={`Add ping to ${columnName}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Scrollable Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence mode="popLayout">
          {pings.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32 text-base-content/40 text-sm"
            >
              No pings yet
            </motion.div>
          ) : (
            pings.map((ping) => (
              <motion.div
                key={ping.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <PingCard
                  ping={ping}
                  onEdit={onEditPing}
                  onDelete={onDeletePing}
                  onMove={onMovePing}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export type { ColumnProps };