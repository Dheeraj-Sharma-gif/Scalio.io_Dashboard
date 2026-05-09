import { createFileRoute } from "@tanstack/react-router";
import { Facebook, FileText, Film, Eye, ThumbsUp, MessageCircle, Activity } from "lucide-react";
import { PlatformPage } from "@/components/dashboard/PlatformPage";
import { getFacebook } from "@/lib/mockData";

export const Route = createFileRoute("/facebook")({
  head: () => ({ meta: [
    { title: "Facebook Analytics — Scalio" },
    { name: "description", content: "Reach, posts, reels and engagement for Scalio on Facebook." },
  ]}),
  component: FacebookPage,
});

function FacebookPage() {
  return (
    <PlatformPage
      name="Facebook"
      tagline="Community reach, video views and engagement analytics"
      icon={Facebook}
      accent="oklch(0.55 0.2 255)"
      baseSeries={32000}
      compute={(sel) => {
        const d = getFacebook(sel);
        return {
          stats: [
            { label: "Posts", value: d.posts, format: "number", icon: FileText, accent: "cyan" },
            { label: "Reels", value: d.reels, format: "number", icon: Film, accent: "violet" },
            { label: "Views", value: d.views, delta: 7.2, icon: Eye, accent: "magenta" },
            { label: "Likes", value: d.likes, delta: 4.6, icon: ThumbsUp, accent: "cyan" },
            { label: "Comments", value: d.comments, delta: 3.1, icon: MessageCircle, accent: "violet" },
            { label: "Engagement", value: d.engagement, delta: 0.4, format: "percent", icon: Activity, accent: "magenta" },
          ],
          topItem: { label: "Highest Viewed Content", title: d.topContent.title, views: d.topContent.views },
        };
      }}
    />
  );
}
