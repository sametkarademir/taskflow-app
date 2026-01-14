import { useState } from "react";
import { Send } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";

import { useGetPagedAndFilterTodoComments } from "../../todoComments/hooks/useGetPagedAndFilterTodoComments";
import { useCreateTodoComment } from "../../todoComments/hooks/useCreateTodoComment";
import type { TodoCommentResponseDto } from "../../todoComments/types/todoCommentResponseDto";
import { Button } from "../../../components/form/button";

interface CommentTabProps {
  todoItemId: string;
}

export const CommentTab = ({ todoItemId }: CommentTabProps) => {
  const { t } = useLocale();
  const [commentText, setCommentText] = useState("");

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Bugün
    if (diffDays === 0) {
      if (diffMins < 1) return "Az önce";
      if (diffMins < 60) return `${diffMins} dakika önce`;
      if (diffHours < 24) return `${diffHours} saat önce`;
    }

    // Dün
    if (diffDays === 1) {
      return `Dün ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
    }

    // Son 7 gün
    if (diffDays < 7) {
      return `${diffDays} gün önce`;
    }

    // Daha eski tarihler için tam format
    const dateStr = date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
    const timeStr = date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} ${timeStr}`;
  };

  const { data: commentsData, isLoading, refetch } = useGetPagedAndFilterTodoComments(
    todoItemId,
    { page: 1, perPage: 100, field: "creationTime", order: "asc" },
    { enabled: !!todoItemId }
  );

  const { mutate: createComment, isPending: isCreating } = useCreateTodoComment({
    onSuccess: () => {
      showToast(t("pages.todoComments.messages.createSuccess"), "success");
      setCommentText("");
      refetch();
    },
  });

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    createComment({
      todoItemId,
      params: { content: commentText.trim() },
    });
  };

  const comments: TodoCommentResponseDto[] = commentsData?.data || [];

  return (
    <div className="flex flex-col h-full p-4">
      {/* Comment List */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-zinc-400 text-sm">{t("pages.todoComments.messages.loading")}</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-zinc-400 text-sm">{t("pages.todoComments.messages.noComments")}</div>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group mr-3">
              <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-800 p-3 group-hover:border-zinc-700 transition-colors">
                <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
                {comment.creationTime && (
                  <span className="mt-2.5 block text-[10px] font-medium text-zinc-500">
                    {formatCommentDate(comment.creationTime)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="mt-4 border-t border-zinc-800 pt-4">
        <div className="flex gap-2 items-center">
          <textarea
            placeholder={t("pages.todoComments.forms.comment.placeholder")}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900/50 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:ring-1 focus:ring-[#6366f1] focus:border-[#6366f1] focus:outline-none resize-none"
            rows={7}
            disabled={isCreating}
          />
          <Button
            type="button"
            variant="primary"
            className="h-[32px]"
            onClick={handleSubmit}
            disabled={isCreating || !commentText.trim()}
            loading={isCreating}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
