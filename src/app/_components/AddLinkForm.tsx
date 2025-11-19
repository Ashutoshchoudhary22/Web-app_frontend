"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, type CreateLinkInput } from "@/lib/validation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

type Props = {
  baseUrl: string;
};

export function AddLinkForm({ baseUrl }: Props) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      url: "",
      code: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(null);
    setCreatedCode(null);

    const payload = {
      url: values.url.trim(),
      code: values.code?.trim() || undefined,
    };

    const response = await fetch(`${API_BASE_URL}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      setCreatedCode(data.code);
      setServerMessage("Short link created");
      reset({ url: "", code: "" });
      router.refresh();
      return;
    }

    if (response.status === 409) {
      setServerMessage("That code is already taken. Try another one.");
      return;
    }

    const { message } = await response.json().catch(() => ({ message: "" }));
    setServerMessage(message || "Something went wrong. Please retry.");
  });

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40"
    >
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
          1
        </span>
        Create a tiny link
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-200">
            Destination URL
            <input
              type="url"
              placeholder="https://example.com/docs"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              {...register("url")}
            />
          </label>
          {errors.url && (
            <p className="mt-1 text-sm text-rose-400">{errors.url.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-200">
            Custom code (optional)
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/30">
              <span className="select-none text-slate-500">{baseUrl}/</span>
              <input
                type="text"
                placeholder="docs01"
                className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                {...register("code")}
              />
            </div>
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Codes must be 6-8 letters or numbers.
          </p>
          {errors.code && (
            <p className="mt-1 text-sm text-rose-400">{errors.code.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Generate short link"}
      </button>

      {serverMessage && (
        <p className="mt-4 rounded-lg bg-slate-800/80 px-3 py-2 text-sm text-slate-200">
          {serverMessage}
          {createdCode ? (
            <>
              <br />
              <span className="font-semibold text-indigo-300">
                {baseUrl}/{createdCode}
              </span>
            </>
          ) : null}
        </p>
      )}
    </form>
  );
}

