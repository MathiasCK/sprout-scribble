"use server";

import { revalidatePath } from "next/cache";
import db from "~/server";
import { posts } from "~/server/schema";

export const createPost = async (formData: FormData) => {
  const title = formData.get("title")?.toString();

  if (!title) {
    return { error: "Title is required" };
  }

  const post = await db.insert(posts).values({
    title: formData.get("title") as string,
  });

  revalidatePath("/");

  return { success: post };
};

export const getPosts = async () => {
  try {
    const postsData = await db.query.posts.findMany({
      columns: {
        title: true,
        id: true,
      },
    });

    if (!postsData || postsData.length === 0) {
      return { error: "No posts found" };
    }

    return { success: postsData };
  } catch (e) {
    return { error: "An unexpected error occurred" };
  }
};
