import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Users, FileText, ThumbsUp, MessageCircle, Eye, Repeat2, Activity } from "lucide-react";
import { PlatformPage } from "@/components/dashboard/PlatformPage";
import { getLinkedIn } from "@/lib/mockData";

export const Route = createFileRoute("/linkedin")({
  head: () => ({ meta: [
    { title: "LinkedIn Analytics — Scalio" },
    { name: "description", content: "Followers, reach, impressions and engagement for Scalio on LinkedIn." },
  ]}),
  component: LinkedInPage,
});

function LinkedInPage() {
  return (
    <PlatformPage
      name="LinkedIn"
      tagline="Professional reach, impressions and thought-leadership engagement"
      icon={Linkedin}
      accent="oklch(0.78 0.18 220)"
      baseSeries={28000}
      compute={(sel) => {
        const d = getLinkedIn(sel);
        return {
          stats: [
            { label: "Followers", value: d.followers, delta: 8.9, icon: Users, accent: "cyan" },
            { label: "Posts", value: d.posts, delta: 4.3, icon: FileText, format: "number", accent: "violet" },
            { label: "Likes", value: d.likes, delta: 11.7, icon: ThumbsUp, accent: "magenta" },
            { label: "Comments", value: d.comments, delta: 7.2, icon: MessageCircle, accent: "cyan" },
            { label: "Reach", value: d.reach, delta: 12.5, icon: Eye, accent: "violet" },
            { label: "Impressions", value: d.impressions, delta: 15.1, icon: Activity, accent: "magenta" },
            { label: "Reposts", value: d.reposts, delta: 5.6, icon: Repeat2, accent: "cyan" },
            { label: "Engagement", value: 5.4, delta: 0.6, format: "percent", accent: "violet" },
          ],
          topItem: { label: "Top Performing Post", title: "How AI is rewriting performance marketing in 2026", views: 184000 },
        };
      }}
    />
  );
}
