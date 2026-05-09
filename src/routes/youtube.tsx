import { createFileRoute } from "@tanstack/react-router";
import { Youtube, Users, Eye, ThumbsUp, ThumbsDown, MessageCircle, Clock, Film } from "lucide-react";
import { PlatformPage } from "@/components/dashboard/PlatformPage";
import { getYouTube } from "@/lib/mockData";

export const Route = createFileRoute("/youtube")({
  head: () => ({ meta: [
    { title: "YouTube Analytics — Scalio" },
    { name: "description", content: "Subscribers, views, watch time and engagement for Scalio's YouTube channel." },
  ]}),
  component: YouTubePage,
});

function YouTubePage() {
  return (
    <PlatformPage
      name="YouTube"
      tagline="Long-form video performance & watch-time analytics"
      icon={Youtube}
      accent="oklch(0.65 0.25 25)"
      baseSeries={42000}
      compute={(sel) => {
        const d = getYouTube(sel);
        return {
          stats: [
            { label: "Subscribers", value: d.subscribers, delta: 12.4, icon: Users, accent: "magenta" },
            { label: "Total Views", value: d.views, delta: 18.2, icon: Eye, accent: "cyan" },
            { label: "Likes", value: d.likes, delta: 9.1, icon: ThumbsUp, accent: "violet" },
            { label: "Watch Time (hrs)", value: d.watchTimeHrs, delta: 14.7, icon: Clock, accent: "magenta" },
            { label: "Comments", value: d.comments, delta: 6.4, icon: MessageCircle, accent: "violet" },
            { label: "Dislikes", value: d.dislikes, delta: -2.1, icon: ThumbsDown, accent: "cyan" },
            { label: "Videos Posted", value: d.videosPosted, delta: 3.0, icon: Film, format: "number", accent: "magenta" },
            { label: "Engagement Ratio", value: d.engagementRatio, delta: 0.8, format: "percent", accent: "cyan" },
          ],
          topItem: { label: "Highest Reaching Video", title: d.topVideo.title, views: d.topVideo.views },
        };
      }}
    />
  );
}
