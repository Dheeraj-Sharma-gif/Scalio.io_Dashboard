import { createFileRoute } from "@tanstack/react-router";
import { Twitter, FileText, Users, Activity, Eye, ThumbsUp, Repeat2 } from "lucide-react";
import { PlatformPage } from "@/components/dashboard/PlatformPage";
import { getTwitter } from "@/lib/mockData";

export const Route = createFileRoute("/twitter")({
  head: () => ({ meta: [
    { title: "X (Twitter) Analytics — Scalio" },
    { name: "description", content: "Posts, reach, views and engagement for Scalio on X." },
  ]}),
  component: TwitterPage,
});

function TwitterPage() {
  return (
    <PlatformPage
      name="Twitter (X)"
      tagline="Real-time conversation, reach and viral velocity"
      icon={Twitter}
      accent="oklch(0.83 0.18 80)"
      baseSeries={56000}
      compute={(sel) => {
        const d = getTwitter(sel);
        return {
          stats: [
            { label: "Posts", value: d.posts, format: "number", icon: FileText, accent: "cyan" },
            { label: "Followers", value: d.followers, delta: 11.2, icon: Users, accent: "violet" },
            { label: "Reach", value: d.reach, delta: 14.8, icon: Activity, accent: "magenta" },
            { label: "Views", value: d.views, delta: 17.6, icon: Eye, accent: "cyan" },
            { label: "Likes", value: d.likes, delta: 8.4, icon: ThumbsUp, accent: "violet" },
            { label: "Reposts", value: d.reposts, delta: 6.7, icon: Repeat2, accent: "magenta" },
            { label: "Engagement", value: d.engagement, delta: 0.7, format: "percent", icon: Activity, accent: "cyan" },
          ],
          topItem: { label: "Top Performing Post", title: "We just generated a 60s ad in 3 minutes — and it converted like crazy.", views: 482000 },
        };
      }}
    />
  );
}
