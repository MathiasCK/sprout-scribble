import {
  createUploadthing,
  type FileRouter as UploadFileRouter,
} from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB" } }).onUploadComplete(
    async () => {},
  ),
  variantUploader: f({
    image: { maxFileCount: 10, maxFileSize: "4MB" },
  }).onUploadComplete(async () => {}),
} satisfies UploadFileRouter;

export type FileRouter = typeof fileRouter;
