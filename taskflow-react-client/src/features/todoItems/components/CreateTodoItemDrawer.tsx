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
import { useCreateTodoItem } from "../hooks/useCreateTodoItem";
import { useGetPagedAndFilterCategories } from "../../categories/hooks/useGetPagedAndFilterCategories";
import {
  createCreateTodoItemSchemaFactory,
  type CreateTodoItemFormType,
  DEFAULT_CREATE_TODO_ITEM_FORM_VALUES,
} from "../schemas/createTodoItemSchema";

interface CreateTodoItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultStatus?: "Backlog" | "InProgress" | "Blocked" | "Completed";
}

export const CreateTodoItemDrawer = ({
  isOpen,
  onClose,
  onSuccess,
  defaultStatus = "Backlog",
}: CreateTodoItemDrawerProps) => {
  const { t } = useLocale();
  const schema = createCreateTodoItemSchemaFactory(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateTodoItemFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...DEFAULT_CREATE_TODO_ITEM_FORM_VALUES,
      status: defaultStatus,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        ...DEFAULT_CREATE_TODO_ITEM_FORM_VALUES,
        status: defaultStatus || "Backlog",
      });
    }
  }, [isOpen, defaultStatus, reset]);

  const { data: categoriesData } = useGetPagedAndFilterCategories(
    { page: 1, perPage: 100 },
    { enabled: isOpen }
  );

  const categoryOptions: SelectOption[] =
    categoriesData?.data?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  const { mutate: createTodoItem, isPending } = useCreateTodoItem({
    onSuccess: () => {
      showToast(t("pages.todoItems.messages.createSuccess"), "success");
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (data: CreateTodoItemFormType) => {
    createTodoItem({
      params: {
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
      title={t("pages.todoItems.modals.create.title")}
      size="lg"
      position="right"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              ? t("pages.todoItems.actions.creating")
              : t("pages.todoItems.actions.create")}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
