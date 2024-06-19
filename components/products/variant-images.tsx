"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";
import { variantSchema } from "~/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UploadDropzone, cn } from "~/lib/utils";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Reorder } from "framer-motion";
import { useState } from "react";

const VariantImages = () => {
  const [active, setActive] = useState<number>(0);
  const { getValues, control, setError } =
    useFormContext<z.infer<typeof variantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });
  return (
    <>
      <FormField
        control={control}
        name="variantImages"
        render={() => (
          <FormItem>
            <FormLabel>Variant images</FormLabel>
            <FormControl>
              <UploadDropzone
                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                onUploadError={error => {
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={files => {
                  for (const file of files) {
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    });
                  }
                  return files;
                }}
                onClientUploadComplete={files => {
                  const images = getValues("variantImages");
                  images.forEach((field, index) => {
                    if (field.url.search("blob") === 0) {
                      const image = files.find(img => img.name === field.name);
                      if (image) {
                        update(index, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        });
                      }
                    }
                  });
                  return;
                }}
                config={{ mode: "auto" }}
                endpoint="variantUploader"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Reorder.Group
              as="tbody"
              values={fields}
              onReorder={e => {
                const activeElement = fields[active];
                e.map((item, index) => {
                  if (item === activeElement) {
                    move(active, index);
                    setActive(index);
                    return;
                  }
                });
                return;
              }}
            >
              {fields.map((field, index) => (
                <Reorder.Item
                  as="tr"
                  key={field.id}
                  value={field}
                  id={field.id}
                  onDragStart={() => setActive(index)}
                  className={cn(
                    field.url.search("blob") === 0
                      ? "animate-pulse transition-all"
                      : "",
                    "text-small font-bold text-muted-foreground hover:text-primary animate-none",
                  )}
                >
                  <TableCell>{index}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>
                    {(field.size / (1024 * 1024)).toFixed()} MB
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Image
                        src={field.url}
                        alt={field.name}
                        className="rounded-md"
                        width={72}
                        height={48}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"ghost"}
                      className="scale-75"
                      onClick={e => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      <TrashIcon className="h-4" />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default VariantImages;
