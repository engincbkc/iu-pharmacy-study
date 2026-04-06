import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/i18n/use-i18n";
import { TopicCard } from "@/components/study/topic-card";
import topicsData from "@/data/topics.json";
import type { Topic } from "@/types";

export function TopicsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const topics = topicsData.topics as Topic[];

  const filtered = useMemo(() => {
    if (!search.trim()) return topics;
    const q = search.toLowerCase();
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q) ||
        topic.relatedDrugs.some((d) => d.toLowerCase().includes(q))
    );
  }, [topics, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("topics.title")}</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("topics.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No topics found.</p>
        )}
      </div>
    </div>
  );
}
