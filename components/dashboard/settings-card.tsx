"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { settingsSchema } from "~/types";
import Image from "next/image";
import { Switch } from "~/components/ui/switch";
import { FormError, FormSuccess } from "~/components/auth";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { updateSettings } from "~/server/actions";
import { UploadButton } from "~/lib/utils";

interface SettingsFormProps {
  session: Session;
}

const SettingsCard = (session: SettingsFormProps) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      currentPassword: undefined,
      newPassword: undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      image: session.session.user?.image || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(updateSettings, {
    onSuccess: data => {
      if (data?.error) {
        setError(data.error);
        setSuccess("");
      }
      if (data?.success) {
        setSuccess(data.success);
        setError("");
      }
    },
    onError: error => setError("Error updating settings: " + error),
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => execute(values);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") ? (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <Image
                        className="rounded-full"
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        alt="User image"
                      />
                    )}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change avatar</div>;
                          return <div>Uploading...</div>;
                        },
                      }}
                      onUploadBegin={() => setAvatarUploading(true)}
                      onClientUploadComplete={res => {
                        form.setValue("image", res[0].url);
                        setAvatarUploading(false);
                      }}
                      onUploadError={error => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      className="hidden"
                      placeholder="User image"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two factored authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
