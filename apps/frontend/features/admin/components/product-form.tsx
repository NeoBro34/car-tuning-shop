"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Star, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  adminProductSchema,
  type AdminProductFormValues,
} from "@/features/admin/admin.schema";
import {
  getCarModels,
  type Brand,
  type CarModel,
  type Category,
} from "@/features/products";

const MAX_PRODUCT_IMAGES = 5;
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  "avif",
  "gif",
  "jfif",
  "jpeg",
  "jpg",
  "png",
  "webp",
]);
const IMAGE_ACCEPT = ".avif,.gif,.jfif,.jpeg,.jpg,.png,.webp,image/avif,image/gif,image/jpeg,image/png,image/webp";

type ProductFormProps = {
  brands: Brand[];
  categories: Category[];
  defaultValues?: Partial<AdminProductFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: AdminProductFormValues, mainImageIndex?: number) => Promise<void>;
  submitLabel: string;
};

type ImagePreview = {
  file: File;
  url: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-red-300">{message}</p> : null;
}

function isAllowedImageFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  return file.type.startsWith("image/") && ALLOWED_IMAGE_EXTENSIONS.has(extension);
}

function Section({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4">
        <h3 className="text-base font-black text-white">{title}</h3>
        {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ProductForm({
  brands,
  categories,
  defaultValues,
  isSubmitting = false,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const admin = useTranslations("Admin");
  const common = useTranslations("Common");
  const [brandSearch, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [carModelSearch, setCarModelSearch] = useState("");
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [carModelError, setCarModelError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingCarModels, setIsLoadingCarModels] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState<number | undefined>(undefined);
  const imagePreviewsRef = useRef<ImagePreview[]>([]);
  const previousBrandId = useRef<number | null>(null);

  const formDefaults = useMemo<AdminProductFormValues>(
    () => ({
      brand_id: 0,
      car_model_id: 0,
      category_id: 0,
      discount_price: "",
      full_description: "",
      images: [],
      is_active: true,
      name: "",
      price: "",
      short_description: "",
      sku: "",
      slug: "",
      specifications: [{ key: "", value: "" }],
      stock_quantity: 0,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<AdminProductFormValues>({
    defaultValues: formDefaults,
    resolver: zodResolver(adminProductSchema),
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "specifications",
  });
  const selectedBrandId = useWatch({ control, name: "brand_id" });
  const productName = useWatch({ control, name: "name" });

  const filteredBrands = useMemo(() => {
    const query = brandSearch.trim().toLowerCase();
    return query
      ? brands.filter((brand) => brand.name.toLowerCase().includes(query))
      : brands;
  }, [brandSearch, brands]);

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase();
    return query
      ? categories.filter((category) => category.name.toLowerCase().includes(query))
      : categories;
  }, [categories, categorySearch]);

  const filteredCarModels = useMemo(() => {
    const query = carModelSearch.trim().toLowerCase();
    return query
      ? carModels.filter((model) => model.name.toLowerCase().includes(query))
      : carModels;
  }, [carModelSearch, carModels]);

  useEffect(() => {
    reset(formDefaults);
    previousBrandId.current = formDefaults.brand_id || null;
  }, [formDefaults, reset]);

  useEffect(() => {
    const generatedSlug = slugify(productName ?? "");
    setValue("slug", generatedSlug, { shouldValidate: true });
  }, [productName, setValue]);

  useEffect(() => {
    let isMounted = true;

    async function loadCarModels() {
      if (!selectedBrandId) {
        setCarModels([]);
        setValue("car_model_id", 0, { shouldValidate: true });
        previousBrandId.current = null;
        return;
      }

      const brandChanged =
        previousBrandId.current !== null && previousBrandId.current !== selectedBrandId;
      previousBrandId.current = selectedBrandId;

      if (brandChanged) {
        setValue("car_model_id", 0, { shouldValidate: true });
        setCarModelSearch("");
      }

      setIsLoadingCarModels(true);
      setCarModelError(null);

      try {
        const response = await getCarModels(selectedBrandId);
        if (isMounted) {
          setCarModels(response.items);
        }
      } catch {
        if (isMounted) {
          setCarModelError("Car models could not be loaded.");
          setCarModels([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCarModels(false);
        }
      }
    }

    loadCarModels();

    return () => {
      isMounted = false;
    };
  }, [selectedBrandId, setValue]);

  useEffect(() => {
    imagePreviewsRef.current = imagePreviews;
  }, [imagePreviews]);

  useEffect(
    () => () => {
      imagePreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [],
  );

  function addFiles(files: File[]) {
    const imageFiles = files.filter(isAllowedImageFile);
    const unsupportedCount = files.length - imageFiles.length;
    if (!imageFiles.length) {
      if (unsupportedCount > 0) {
        setImageError("Use JPG, PNG, WEBP, GIF, AVIF, or JFIF images.");
      }
      return;
    }

    setImagePreviews((current) => {
      const availableSlots = MAX_PRODUCT_IMAGES - current.length;
      const acceptedFiles = imageFiles.slice(0, Math.max(availableSlots, 0));
      const rejectedCount = imageFiles.length - acceptedFiles.length;

      if (!acceptedFiles.length) {
        setImageError(`You can upload up to ${MAX_PRODUCT_IMAGES} images.`);
        return current;
      }

      const next = [
        ...current,
        ...acceptedFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ];
      setValue(
        "images",
        next.map((preview) => preview.file),
        { shouldValidate: true },
      );
      setImageError(
        unsupportedCount > 0
          ? "Some files were skipped. Use JPG, PNG, WEBP, GIF, AVIF, or JFIF images."
          : rejectedCount > 0
          ? `Only ${MAX_PRODUCT_IMAGES} images are allowed. Extra images were skipped.`
          : null,
      );
      if (mainImageIndex === undefined) {
        setMainImageIndex(0);
      }
      return next;
    });
  }

  function removeImage(index: number) {
    setImagePreviews((current) => {
      const removed = current[index];
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      setValue(
        "images",
        next.map((preview) => preview.file),
        { shouldValidate: true },
      );
      if (next.length < MAX_PRODUCT_IMAGES) {
        setImageError(null);
      }
      setMainImageIndex((currentMain) => {
        if (next.length === 0) {
          return undefined;
        }
        if (currentMain === index) {
          return 0;
        }
        if (currentMain !== undefined && currentMain > index) {
          return currentMain - 1;
        }
        return currentMain;
      });
      return next;
    });
  }

  async function submit(values: AdminProductFormValues) {
    await onSubmit(values, mainImageIndex);

    if (!defaultValues) {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setImagePreviews([]);
      setMainImageIndex(undefined);
      reset(formDefaults);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <Section
        description="Core product copy used in catalog cards and product detail pages."
        title="Basic Information"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("name")}</span>
            <Input className="mt-2" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">Slug</span>
            <Input className="mt-2" {...register("slug")} />
            <FieldError message={errors.slug?.message} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("sku")}</span>
            <Input className="mt-2" {...register("sku")} />
            <FieldError message={errors.sku?.message} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">Short description</span>
            <Input className="mt-2" {...register("short_description")} />
            <FieldError message={errors.short_description?.message} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-zinc-300">Full description</span>
            <textarea
              className="auto-input mt-2 min-h-32 w-full rounded-md px-3 py-2 text-sm"
              {...register("full_description")}
            />
            <FieldError message={errors.full_description?.message} />
          </label>
        </div>
      </Section>

      <Section
        description="Fitment data keeps the marketplace useful for real tuning shoppers."
        title="Compatibility"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("brand")}</span>
            <Input
              className="mt-2"
              onChange={(event) => setBrandSearch(event.target.value)}
              placeholder="Search brands"
              value={brandSearch}
            />
            <Select className="mt-2" {...register("brand_id", { valueAsNumber: true })}>
              <option value={0}>{common("allBrands")}</option>
              {filteredBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.brand_id?.message} />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-zinc-300">Car model</span>
            <Input
              className="mt-2"
              disabled={!selectedBrandId || isLoadingCarModels}
              onChange={(event) => setCarModelSearch(event.target.value)}
              placeholder="Search models"
              value={carModelSearch}
            />
            <Select
              className="mt-2"
              disabled={!selectedBrandId || isLoadingCarModels}
              {...register("car_model_id", { valueAsNumber: true })}
            >
              <option value={0}>
                {isLoadingCarModels
                  ? "Loading models..."
                  : selectedBrandId
                    ? "Select car model"
                    : "Select brand first"}
              </option>
              {filteredCarModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
            {!isLoadingCarModels && selectedBrandId && carModels.length === 0 ? (
              <p className="mt-1 text-sm text-zinc-500">
                {carModelError ?? "No car models exist for this brand yet."}
              </p>
            ) : null}
            <FieldError message={errors.car_model_id?.message} />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("category")}</span>
            <Input
              className="mt-2"
              onChange={(event) => setCategorySearch(event.target.value)}
              placeholder="Search categories"
              value={categorySearch}
            />
            <Select className="mt-2" {...register("category_id", { valueAsNumber: true })}>
              <option value={0}>{common("allCategories")}</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.category_id?.message} />
          </label>
        </div>
      </Section>

      <Section title="Pricing & Stock">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("price")}</span>
            <Input className="mt-2" step="0.01" type="number" {...register("price")} />
            <FieldError message={errors.price?.message} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("discountPrice")}</span>
            <Input
              className="mt-2"
              step="0.01"
              type="number"
              {...register("discount_price")}
            />
            <FieldError message={errors.discount_price?.message} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">{common("stock")}</span>
            <Input
              className="mt-2"
              min="0"
              type="number"
              {...register("stock_quantity", { valueAsNumber: true })}
            />
            <FieldError message={errors.stock_quantity?.message} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">Product status</span>
            <Select className="mt-2" {...register("is_active", {
              setValueAs: (value) => value === "true",
            })}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </label>
        </div>
      </Section>

      <Section
        description="Upload product photos, remove mistakes, and choose the main catalog image."
        title="Images"
      >
        <div
          className={[
            "rounded-lg border border-dashed p-5 text-center transition",
            isDragOver ? "border-red-300 bg-red-500/10" : "border-white/15 bg-black/20",
          ].join(" ")}
          onDragLeave={() => setIsDragOver(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragOver(false);
            addFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <Upload className="mx-auto h-8 w-8 text-zinc-400" />
          <p className="mt-2 text-sm font-bold text-zinc-200">Drop images here</p>
          <p className="mt-1 text-sm text-zinc-500">
            JPG, PNG, WEBP, GIF, AVIF and JFIF are supported. Upload 1-{MAX_PRODUCT_IMAGES} images.
          </p>
          <label className="mt-4 inline-flex cursor-pointer">
            <span className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-zinc-100 hover:bg-white/10">
              Choose images
            </span>
            <input
              accept={IMAGE_ACCEPT}
              className="sr-only"
              disabled={imagePreviews.length >= MAX_PRODUCT_IMAGES}
              multiple
              onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
              type="file"
            />
          </label>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-500">
            {imagePreviews.length}/{MAX_PRODUCT_IMAGES} images selected
          </span>
          {imageError ? <span className="text-red-300">{imageError}</span> : null}
        </div>
        <FieldError message={errors.images?.message} />

        {imagePreviews.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/30" key={preview.url}>
                <img
                  alt={preview.file.name}
                  className="aspect-square w-full object-cover"
                  src={preview.url}
                />
                <div className="absolute inset-x-2 top-2 flex justify-between gap-2">
                  <button
                    className="rounded-md bg-black/70 p-2 text-white hover:bg-red-600"
                    onClick={() => setMainImageIndex(index)}
                    title="Set main image"
                    type="button"
                  >
                    <Star
                      className={[
                        "h-4 w-4",
                        mainImageIndex === index ? "fill-yellow-300 text-yellow-300" : "",
                      ].join(" ")}
                    />
                  </button>
                  <button
                    className="rounded-md bg-black/70 p-2 text-white hover:bg-red-600"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="truncate px-3 py-2 text-xs text-zinc-400">{preview.file.name}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      <Section title="Specifications">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" key={field.id}>
              <Input
                placeholder="Material, Color, Weight..."
                {...register(`specifications.${index}.key`)}
              />
              <Input
                placeholder="Carbon fiber, Black, 8kg..."
                {...register(`specifications.${index}.value`)}
              />
              <Button
                className="md:w-10"
                onClick={() => remove(index)}
                title="Remove specification"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => append({ key: "", value: "" })}
            type="button"
            variant="secondary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add specification
          </Button>
        </div>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button disabled={isSubmitting || isLoadingCarModels} type="submit">
          {isSubmitting ? admin("saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}
