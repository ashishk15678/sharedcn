"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

function getStars(rating: number, setRating?: (n: number) => void) {
  // 5 stars, allow quarter increments
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let fill = "none";
    if (rating >= i) fill = "#facc15";
    else if (rating > i - 1) {
      // Partial fill for quarters
      const frac = rating - (i - 1);
      if (frac >= 0.75) fill = "#facc15";
      else if (frac >= 0.5) fill = "url(#half)";
      else if (frac >= 0.25) fill = "url(#quarter)";
    }
    stars.push(
      <svg
        key={i}
        width={20}
        height={20}
        viewBox="0 0 24 24"
        className={`cursor-pointer transition-all ${
          rating >= i - 0.25 ? "text-yellow-400" : "text-zinc-300"
        }`}
        onClick={
          setRating
            ? (e) => {
                const rect = (e.target as SVGElement).getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                let value = i - 1 + Math.ceil(percent * 4) / 4;
                if (value > 5) value = 5;
                if (value < 0.25) value = 0.25;
                setRating(value);
              }
            : undefined
        }
        style={{ display: "inline-block" }}
      >
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="50%" stopColor="white" />
          </linearGradient>
          <linearGradient id="quarter">
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="25%" stopColor="white" />
          </linearGradient>
        </defs>
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={fill}
          stroke="#facc15"
          strokeWidth={rating >= i - 0.25 ? 1.5 : 1}
        />
      </svg>
    );
  }
  return <div className="flex gap-1 items-center">{stars}</div>;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(4);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{
    [id: string]: { x: number; y: number };
  }>({});

  useEffect(() => {
    fetch("/api/user/feedback")
      .then((r) => r.json())
      .then(setFeedbacks)
      .finally(() => setLoading(false));
    fetch("/api/token", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.token ? d : null));
  }, []);

  async function submitFeedback() {
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/user/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, rating, isAnonymous }),
    });
    if (res.ok) {
      setDialogOpen(false);
      setContent("");
      setRating(4);
      setIsAnonymous(false);
      setFeedbacks([await res.json(), ...feedbacks]);
    } else {
      const err = await res.json();
      setError(err.error || "Failed to submit feedback");
    }
    setSubmitting(false);
  }

  const canSubmit =
    content.length > 3 && rating >= 1 && rating <= 4 && (user || isAnonymous);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-2 text-center">
          Feedbacks
        </h1>
        <p className="text-zinc-500 text-center mb-10">
          Share your thoughts, ideas, or love for SharedCN. Drag feedbacks
          around for fun!
        </p>
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 relative"
        >
          {loading ? (
            <div className="col-span-2 text-center text-zinc-400">
              Loading...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="col-span-2 text-center text-zinc-400">
              No feedbacks yet.
            </div>
          ) : (
            feedbacks.map((fb, i) => (
              <motion.div
                key={fb.id}
                drag
                dragElastic={0.7}
                dragMomentum={true}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
                whileTap={{ scale: 1.05 }}
                whileDrag={{
                  scale: 1.08,
                  boxShadow: "0 8px 12px rgba(0,0,0,0.18)",
                }}
                dragConstraints={gridRef}
                className="bg-white/40 rounded-2xl shadow-sm border border-zinc-200 p-6 flex flex-col gap-2 cursor-grab relative"
                style={{ zIndex: 10 + i, ...positions[fb.id] }}
                onDragEnd={(_e, info) => {
                  setPositions((prev) => ({
                    ...prev,
                    [fb.id]: {
                      x:
                        info.point.x -
                        (gridRef.current?.getBoundingClientRect().left || 0),
                      y:
                        info.point.y -
                        (gridRef.current?.getBoundingClientRect().top || 0),
                    },
                  }));
                }}
                initial={false}
              >
                <div className="flex flex-col  gap-3 ">
                  <div className="flex flex-row items-center gap-x-4">
                    {fb.isAnonymous || !fb.user ? (
                      <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400 font-bold text-lg">
                        ?
                      </div>
                    ) : (
                      <Image
                        src={fb.user.image || "/avatar.svg"}
                        alt={fb.user.name || "User"}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <div className="font-semibold text-zinc-800 text-sm">
                        {fb.isAnonymous || !fb.user
                          ? "Anonymous"
                          : fb.user.name || "User"}
                      </div>
                      <div>
                        <div className="flex gap-1 items-center mt-1">
                          {getStars(fb.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-zinc-700 text-base mb-2">{fb.content}</div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white text-zinc-400">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <Button
          className="fixed bottom-8 right-8 z-50 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg rounded-full px-6 py-4 text-lg font-bold"
          onClick={() => setDialogOpen(true)}
        >
          Leave Feedback
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md w-full rounded-2xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-zinc-900">
                Leave Feedback
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-medium">
                  Your feedback
                </label>
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What do you think?"
                  className="bg-zinc-100 border-zinc-200 rounded-lg"
                  maxLength={300}
                  disabled={submitting}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-zinc-700 font-medium">Rating</label>
                {getStars(rating, setRating)}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <span className="text-zinc-600 text-sm">
                  Submit as anonymous
                </span>
              </div>
              {!user && !isAnonymous && (
                <div className="text-red-500 text-xs">
                  Sign in required to leave non-anonymous feedback.
                </div>
              )}
              {error && <div className="text-red-500 text-xs">{error}</div>}
            </div>
            <DialogFooter>
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-xl shadow-xl"
                onClick={submitFeedback}
                disabled={!canSubmit || submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
