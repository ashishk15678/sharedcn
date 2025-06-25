"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardClient() {
  const queryClient = useQueryClient();
  const [alias, setAlias] = useState("");
  const [code, setCode] = useState("");

  const { data: components, isLoading } = useQuery({
    queryKey: ["components"],
    queryFn: async () => {
      const res = await fetch("/api/components");
      if (!res.ok) throw new Error("Failed to fetch components");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ alias, code }: { alias: string; code: string }) => {
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, code }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create component");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Component deployed!");
      setAlias("");
      setCode("");
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/components/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete component");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Component deleted!");
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      <form
        className="flex flex-col gap-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate({ alias, code });
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-zinc-300">Alias (unique)</label>
          <input
            className="p-2 rounded bg-zinc-800 text-zinc-100 border border-zinc-700"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-300">Component Code</label>
          <textarea
            className="p-2 rounded bg-zinc-800 text-zinc-100 border border-zinc-700 min-h-[120px] font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-all"
          disabled={createMutation.isPending}
        >
          Deploy Component
        </button>
      </form>
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl text-zinc-200 mb-4">My Components</h2>
        {isLoading ? (
          <div className="text-zinc-400">Loading...</div>
        ) : components && components.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {components.map((c: any) => (
              <li
                key={c.id}
                className="flex flex-col gap-2 border-b border-zinc-800 pb-4"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-100">{c.alias}</span>
                  <button
                    className="text-red-400 hover:text-red-600 text-sm"
                    onClick={() => deleteMutation.mutate(c.id)}
                  >
                    Delete
                  </button>
                </div>
                <pre className="bg-zinc-950 text-zinc-200 p-2 rounded text-sm overflow-x-auto">
                  {c.code}
                </pre>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-zinc-400">No components yet.</div>
        )}
      </div>
    </div>
  );
}
