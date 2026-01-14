import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { clsx } from "clsx";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useGetCategoryById } from "../hooks/useGetCategoryById";
import {
  createUpdateCategorySchemaFactory,
  type UpdateCategoryFormType,
  DEFAULT_UPDATE_CATEGORY_FORM_VALUES,
} from "../schemas/updateCategorySchema";
import { PRESET_COLORS } from "../constants/presetColors";

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryId: string | null;
}

export const UpdateCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
}: UpdateCategoryModalProps) => {
  const { t } = useLocale();
  const schema = createUpdateCategorySchemaFactory(t);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateCategoryFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_UPDATE_CATEGORY_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Fetch category data when modal opens
  const { data: categoryData, isLoading: isLoadingCategory } = useGetCategoryById(
    categoryId || "",
    {
      enabled: isOpen && !!categoryId,
    },
  );

  // Update form values when category data is loaded
  useEffect(() => {
    if (categoryData && isOpen) {
      const colorHex = categoryData.colorHex || "";
      reset({
        name: categoryData.name,
        description: categoryData.description || "",
        colorHex: colorHex,
      });
      setSelectedColor(colorHex);
    }
  }, [categoryData, isOpen, reset]);

  const { mutate: updateCategory, isPending } = useUpdateCategory({
    onSuccess: () => {
      showToast(t("pages.categories.messages.updateSuccess"), "success");
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (data: UpdateCategoryFormType) => {
    if (!categoryId) return;
    updateCategory({ id: categoryId, data: { ...data, colorHex: selectedColor || undefined } });
  };

  const handleClose = () => {
    reset();
    setSelectedColor("");
    onClose();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue("colorHex", color);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.categories.modals.update.title")}
      size="md"
    >
      {isLoadingCategory ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" isRequired>
              {t("pages.categories.forms.name.label")}
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("pages.categories.forms.name.placeholder")}
              error={!!errors.name}
              hint={errors.name?.message}
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("pages.categories.forms.description.label")}
            </Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder={t("pages.categories.forms.description.placeholder")}
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

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>
              {t("pages.categories.forms.colorHex.label")}
            </Label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  disabled={isPending}
                  className={clsx(
                    "relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedColor === color
                      ? "border-white shadow-lg shadow-white/20 scale-110"
                      : "border-zinc-700 hover:border-zinc-600"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-lg" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedColor && (
              <p className="text-xs text-zinc-400 mt-1">
                {t("pages.categories.forms.colorHex.selected")}: {selectedColor}
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
              {t("pages.categories.actions.cancel")}
            </Button>
            <Button type="submit" variant="primary" loading={isPending}>
              {isPending
                ? t("pages.categories.actions.updating")
                : t("pages.categories.actions.update")}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
