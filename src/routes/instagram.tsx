import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Image, Film, Eye, ThumbsUp, MessageCircle, Share2, Activity } from "lucide-react";
import { PlatformPage } from "@/components/dashboard/PlatformPage";
import { getInstagram } from "@/lib/mockData";

export const Route = createFileRoute("/instagram")({
  head: () => ({ meta: [
    { title: "Instagram Analytics — Scalio" },
    { name: "description", content: "Reels, posts, reach and engagement for Scalio on Instagram." },
  ]}),
  component: InstagramPage,
});

function InstagramPage() {
  return (
    <PlatformPage
      name="Instagram"
      tagline="Reels, stories and visual storytelling performance"
      icon={Instagram}
      accent="oklch(0.7 0.27 340)"
      baseSeries={86000}
      compute={(sel) => {
        const d = getInstagram(sel);
        return {
          stats: [
            { label: "Posts", value: d.posts, format: "number", icon: Image, accent: "magenta" },
            { label: "Reels", value: d.reels, format: "number", icon: Film, accent: "violet" },
            { label: "Views", value: d.views, delta: 22.4, icon: Eye, accent: "cyan" },
            { label: "Likes", value: d.likes, delta: 14.8, icon: ThumbsUp, accent: "magenta" },
            { label: "Comments", value: d.comments, delta: 9.7, icon: MessageCircle, accent: "violet" },
            { label: "Shares", value: d.shares, delta: 18.1, icon: Share2, accent: "cyan" },
            { label: "Reach", value: d.reach, delta: 19.2, icon: Activity, accent: "magenta" },
            { label: "Engagement", value: d.engagement, delta: 1.4, format: "percent", accent: "violet" },
          ],
          topItem: { label: "Highest Viewed Reel", title: d.topReel.title, views: d.topReel.views },
        };
      }}
    />
  );
}
