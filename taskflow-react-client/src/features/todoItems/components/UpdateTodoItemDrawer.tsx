import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Drawer } from "../../../components/ui/drawer";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { Select, type SelectOption } from "../../../components/form/select";
import { FileText, MessageSquare, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { CommentTab } from "./CommentTab";
import { ActivityTab } from "./ActivityTab";
import { useUpdateTodoItem } from "../hooks/useUpdateTodoItem";
import { useGetTodoItemById } from "../hooks/useGetTodoItemById";
import { useGetPagedAndFilterCategories } from "../../categories/hooks/useGetPagedAndFilterCategories";
import {
  createUpdateTodoItemSchemaFactory,
  type UpdateTodoItemFormType,
  DEFAULT_UPDATE_TODO_ITEM_FORM_VALUES,
} from "../schemas/updateTodoItemSchema";

interface UpdateTodoItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  todoItemId: string | null;
}

export const UpdateTodoItemDrawer = ({
  isOpen,
  onClose,
  onSuccess,
  todoItemId,
}: UpdateTodoItemDrawerProps) => {
  const { t } = useLocale();
  const schema = createUpdateTodoItemSchemaFactory(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTodoItemFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_UPDATE_TODO_ITEM_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const { data: categoriesData } = useGetPagedAndFilterCategories(
    { page: 1, perPage: 100 },
    { enabled: isOpen }
  );

  const categoryOptions: SelectOption[] =
    categoriesData?.data?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  // Fetch todoItem data when drawer opens
  const { data: todoItemData, isLoading: isLoadingTodoItem } = useGetTodoItemById(
    todoItemId || "",
    {
      enabled: isOpen && !!todoItemId,
    },
  );

  // Update form values when todoItem data is loaded
  useEffect(() => {
    if (todoItemData && isOpen) {
      reset({
        title: todoItemData.title,
        description: todoItemData.description || "",
        status: todoItemData.status,
        priority: todoItemData.priority,
        dueDate: todoItemData.dueDate
          ? new Date(todoItemData.dueDate).toISOString().slice(0, 16)
          : "",
        categoryId: todoItemData.categoryId,
      });
    }
  }, [todoItemData, isOpen, reset]);

  const { mutate: updateTodoItem, isPending } = useUpdateTodoItem({
    onSuccess: () => {
      showToast(t("pages.todoItems.messages.updateSuccess"), "success");
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (data: UpdateTodoItemFormType) => {
    if (!todoItemId) return;
    updateTodoItem({
      id: todoItemId,
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const statusOptions: SelectOption[] = [
    { value: "Backlog", label: t("pages.todoItems.columns.backlog") },
    { value: "InProgress", label: t("pages.todoItems.columns.inProgress") },
    { value: "Blocked", label: t("pages.todoItems.columns.blocked") },
    { value: "Completed", label: t("pages.todoItems.columns.completed") },
  ];

  const priorityOptions: SelectOption[] = [
    { value: "Low", label: t("pages.todoItems.priority.low") },
    { value: "Medium", label: t("pages.todoItems.priority.medium") },
    { value: "High", label: t("pages.todoItems.priority.high") },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.todoItems.modals.update.title")}
      size="lg"
      position="right"
    >
      {isLoadingTodoItem ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          {/* Tabs Section */}
          <Tabs defaultValue="detail" className="w-full">
            <TabsList className="flex w-full border-b border-zinc-800 bg-transparent p-0 h-auto rounded-none">
              <TabsTrigger 
                value="detail" 
                className="flex items-center gap-2 flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] data-[state=active]:bg-transparent text-zinc-500 hover:text-zinc-300 px-4 py-3 font-medium text-sm transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                 {t("pages.todoItems.tabs.detail")}
              </TabsTrigger>
              <TabsTrigger 
                value="comment" 
                className="flex items-center gap-2 flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] data-[state=active]:bg-transparent text-zinc-500 hover:text-zinc-300 px-4 py-3 font-medium text-sm transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4" />
                {t("pages.todoItems.tabs.comment")}
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="flex items-center gap-2 flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] data-[state=active]:bg-transparent text-zinc-500 hover:text-zinc-300 px-4 py-3 font-medium text-sm transition-all duration-200"
              >
                <Clock className="h-4 w-4" />
                {t("pages.todoItems.tabs.activity")}
              </TabsTrigger>
            </TabsList>
            
            {/* Detail Tab Content */}
            <TabsContent value="detail" className="mt-0 p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                {/* Title */}
                <div className="space-y-2">
            <Label htmlFor="title" isRequired>
              {t("pages.todoItems.forms.title.label")}
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder={t("pages.todoItems.forms.title.placeholder")}
              error={!!errors.title}
              hint={errors.title?.message}
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("pages.todoItems.forms.description.label")}
            </Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder={t("pages.todoItems.forms.description.placeholder")}
              disabled={isPending}
              rows={4}
              className="w-full px-4 py-3.5 text-sm rounded-xl border-2 transition-all duration-200 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 border-zinc-700 focus:border-[#6366f1] focus:ring-[#6366f1]/20 hover:border-zinc-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p className="mt-2 text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" isRequired>
                {t("pages.todoItems.forms.status.label")}
              </Label>
              <Select
                id="status"
                {...register("status")}
                options={statusOptions}
                error={!!errors.status}
                disabled={isPending}
              />
              {errors.status && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" isRequired>
                {t("pages.todoItems.forms.priority.label")}
              </Label>
              <Select
                id="priority"
                {...register("priority")}
                options={priorityOptions}
                error={!!errors.priority}
                disabled={isPending}
              />
              {errors.priority && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">
              {t("pages.todoItems.forms.dueDate.label")}
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...register("dueDate")}
              error={!!errors.dueDate}
              hint={errors.dueDate?.message}
              disabled={isPending}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" isRequired>
              {t("pages.todoItems.forms.categoryId.label")}
            </Label>
            <Select
              id="categoryId"
              {...register("categoryId")}
              options={categoryOptions}
              error={!!errors.categoryId}
              disabled={isPending}
            />
            {errors.categoryId && (
              <p className="mt-2 text-xs text-red-400">
                {errors.categoryId.message}
              </p>
            )}
          </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/50">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    {t("pages.todoItems.actions.cancel")}
                  </Button>
                  <Button type="submit" variant="primary" loading={isPending}>
                    {isPending
                      ? t("pages.todoItems.actions.updating")
                      : t("pages.todoItems.actions.update")}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Comment Tab Content */}
            <TabsContent value="comment" className="mt-0 p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500">
              <CommentTab todoItemId={todoItemId || ""} />
            </TabsContent>
            
            {/* Activity Tab Content */}
            <TabsContent value="activity" className="mt-0 p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500">
              <ActivityTab todoItemId={todoItemId || ""} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Drawer>
  );
};
