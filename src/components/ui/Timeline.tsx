import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface TimelineChange {
  field: string;
  action: "added" | "updated" | "removed" | "modified";
  oldValue?: string;
  newValue?: string;
  addedValue?: string;
}

interface TimelineEntry {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  user: string;
  changes?: TimelineChange[];
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const [expandedEntries, setExpandedEntries] = useState(new Set());

  const toggleEntry = (entryId: any) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => {
        const isExpanded = expandedEntries.has(entry.id);
        const hasChanges = entry.changes && entry.changes.length > 0;

        return (
          <div key={entry.id} className="relative">
            {/* Timeline line */}
            {index !== entries.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>
            )}

            {/* Timeline item */}
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div
                className={`w-16 h-16 ${entry.iconBg || "bg-green-100"} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Icon
                  icon={entry.icon || "heroicons:plus-circle"}
                  className={`w-6 h-6 ${entry.iconColor || "text-green-600"}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 ${hasChanges ? "cursor-pointer hover:border-slate-300 dark:hover:border-slate-600" : ""}`}
                  onClick={() => hasChanges && toggleEntry(entry.id)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                        {entry.title}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Icon icon="heroicons:user" className="w-3 h-3" />
                          <span>{entry.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon icon="heroicons:calendar" className="w-3 h-3" />
                          <span>{formatDate(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {hasChanges && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {entry.changes?.length ?? 0} changes
                        </span>
                        <Icon
                          icon={
                            isExpanded
                              ? "heroicons:chevron-up"
                              : "heroicons:chevron-down"
                          }
                          className="w-4 h-4 text-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Expanded content */}
                  {isExpanded && hasChanges && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                        Changes Made:
                      </h5>

                      <div className="space-y-4">
                        {entry.changes?.map((change, changeIndex) => (
                          <div key={changeIndex} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {change.field}
                              </span>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  change.action === "added"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : change.action === "modified"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                }`}
                              >
                                {change.action}
                              </span>
                            </div>

                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {change.action === "added" && (
                                <div>
                                  <span className="block mb-1">Added:</span>
                                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200">
                                    {change.addedValue}
                                  </div>
                                </div>
                              )}

                              {change.action === "modified" && (
                                <div className="space-y-2">
                                  <div>
                                    <span className="block mb-1">From:</span>
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200">
                                      {change.oldValue}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block mb-1">To:</span>
                                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200">
                                      {change.newValue}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
