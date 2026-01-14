import { useGetPagedAndFilterActivityLogs } from "../../activityLogs/hooks/useGetPagedAndFilterActivityLogs";
import { useLocale } from "../../../features/common/hooks/useLocale";
import { useUser } from "../../../contexts/userContext";
import type { ActivityLogResponseDto } from "../../activityLogs/types/activityLogResponseDto";

interface ActivityTabProps {
  todoItemId: string;
}

export const ActivityTab = ({ todoItemId }: ActivityTabProps) => {
  const { t, locale } = useLocale();
  const { user } = useUser();

  const { data: activityLogsData, isLoading } = useGetPagedAndFilterActivityLogs(
    todoItemId,
    { page: 1, perPage: 100, field: "creationTime", order: "desc" },
    { enabled: !!todoItemId }
  );

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Today
    if (diffDays === 0) {
      if (diffMins < 1) return t("pages.activityLogs.time.justNow");
      if (diffMins < 60) return t("pages.activityLogs.time.minutesAgo", { count: diffMins });
      if (diffHours < 24) return t("pages.activityLogs.time.hoursAgo", { count: diffHours });
    }

    // Yesterday
    if (diffDays === 1) {
      const timeStr = date.toLocaleTimeString(locale === "tr" ? "tr-TR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return t("pages.activityLogs.time.yesterday", { time: timeStr });
    }

    // Last 7 days
    if (diffDays < 7) {
      return t("pages.activityLogs.time.daysAgo", { count: diffDays });
    }

    // Older dates - full format
    const dateStr = date.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
    const timeStr = date.toLocaleTimeString(locale === "tr" ? "tr-TR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} ${timeStr}`;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      Backlog: t("pages.todoItems.columns.backlog"),
      InProgress: t("pages.todoItems.columns.inProgress"),
      Blocked: t("pages.todoItems.columns.blocked"),
      Completed: t("pages.todoItems.columns.completed"),
    };
    return statusMap[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const priorityMap: Record<string, string> = {
      Low: t("pages.todoItems.priority.low"),
      Medium: t("pages.todoItems.priority.medium"),
      High: t("pages.todoItems.priority.high"),
    };
    return priorityMap[priority] || priority;
  };

  const getStatusBadgeColor = (status: string) => {
    const colorMap: Record<string, string> = {
      Backlog: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
      InProgress: "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/30",
      Blocked: "bg-red-500/20 text-red-400 border-red-500/30",
      Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };
    return colorMap[status] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  };

  const formatActivityMessage = (log: ActivityLogResponseDto) => {
    const isCurrentUser = user?.id === log.userId;
    const userName = isCurrentUser ? t("pages.activityLogs.you") : t("pages.activityLogs.user");
    const userNameClassName = isCurrentUser
      ? "font-bold text-[#6366f1]"
      : "font-bold text-zinc-200";

    switch (log.actionKey) {
      case "LOG_TODO_ITEM_CREATED": {
        const status = log.newValue || "";
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.todoItemCreated", {
              user: "",
              status: "",
            })}{" "}
            <span
              className={`rounded px-2 py-0.5 text-xs border ${getStatusBadgeColor(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </>
        );
      }

      case "LOG_TITLE_CHANGED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.titleChanged", {
              user: "",
              oldValue: log.oldValue || "",
              newValue: log.newValue || "",
            })}
          </>
        );

      case "LOG_DESCRIPTION_CHANGED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.descriptionChanged", { user: "" })}
          </>
        );

      case "LOG_STATUS_CHANGED": {
        const oldStatus = log.oldValue || "";
        const newStatus = log.newValue || "";
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.statusChanged", {
              user: "",
              oldStatus: "",
              newStatus: "",
            })}{" "}
            <span
              className={`rounded px-2 py-0.5 text-xs border ${getStatusBadgeColor(newStatus)}`}
            >
              {getStatusLabel(newStatus)}
            </span>
          </>
        );
      }

      case "LOG_PRIORITY_CHANGED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.priorityChanged", {
              user: "",
              oldPriority: getPriorityLabel(log.oldValue || ""),
              newPriority: getPriorityLabel(log.newValue || ""),
            })}
          </>
        );

      case "LOG_DUE_DATE_CHANGED": {
        const oldDate = log.oldValue
          ? new Date(log.oldValue).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US")
          : t("pages.activityLogs.notSet");
        const newDate = log.newValue
          ? new Date(log.newValue).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US")
          : t("pages.activityLogs.notSet");
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.dueDateChanged", {
              user: "",
              oldDate,
              newDate,
            })}
          </>
        );
      }

      case "LOG_CATEGORY_CHANGED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.categoryChanged", { user: "" })}
          </>
        );

      case "LOG_TODO_ITEM_ARCHIVED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.todoItemArchived", { user: "" })}
          </>
        );

      case "LOG_TODO_ITEM_DELETED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.todoItemDeleted", { user: "" })}
          </>
        );

      case "LOG_TODO_COMMENT_CREATED":
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.commentCreated", { user: "" })}
          </>
        );

      default:
        return (
          <>
            <span className={userNameClassName}>{userName}</span>{" "}
            {t("pages.activityLogs.messages.unknownAction", {
              user: "",
              actionKey: log.actionKey,
            })}
          </>
        );
    }
  };

  const getActivityIconColor = (actionKey: string) => {
    const colorMap: Record<string, string> = {
      LOG_TODO_ITEM_CREATED: "bg-emerald-500",
      LOG_TITLE_CHANGED: "bg-[#6366f1]",
      LOG_DESCRIPTION_CHANGED: "bg-blue-500",
      LOG_STATUS_CHANGED: "bg-purple-500",
      LOG_PRIORITY_CHANGED: "bg-orange-500",
      LOG_DUE_DATE_CHANGED: "bg-yellow-500",
      LOG_CATEGORY_CHANGED: "bg-cyan-500",
      LOG_TODO_ITEM_ARCHIVED: "bg-zinc-500",
      LOG_TODO_ITEM_DELETED: "bg-red-500",
      LOG_TODO_COMMENT_CREATED: "bg-emerald-500",
    };
    return colorMap[actionKey] || "bg-[#6366f1]";
  };

  const activityLogs: ActivityLogResponseDto[] = activityLogsData?.data || [];

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-zinc-400 text-sm">{t("pages.activityLogs.messages.loading")}</div>
        </div>
      ) : activityLogs.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-zinc-400 text-sm">{t("pages.activityLogs.messages.noActivities")}</div>
        </div>
      ) : (
        <div className="relative ml-2 space-y-6 border-l-2 border-zinc-800 pl-6">
          {activityLogs.map((log) => (
            <div key={log.id} className="relative">
              <span
                className={`absolute top-1 -left-[31px] h-3 w-3 rounded-full ${getActivityIconColor(
                  log.actionKey
                )} ring-4 ring-zinc-900`}
              ></span>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {formatActivityMessage(log)}
              </p>
              {log.creationTime && (
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  {formatActivityDate(log.creationTime)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
