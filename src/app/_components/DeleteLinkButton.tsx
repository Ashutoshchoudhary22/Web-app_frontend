"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

type Props = {
  code: string;
};

export function DeleteLinkButton({ code }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete /${code}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/links/${code}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:border-rose-500/60 hover:bg-rose-500/10 disabled:opacity-50"
    >
      <Trash size={14} />
      Delete
    </button>
  );
}

