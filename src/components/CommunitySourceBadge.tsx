import type { CommunitySource, CommunitySourceType } from "@/lib/community-types";

const TYPE_LABELS: Record<CommunitySourceType, string> = {
  fbr_survey: "FBR Survey",
  news_article: "News",
  reddit: "Reddit",
  glassdoor: "Glassdoor",
  bbb: "BBB",
  owner_forum: "Owner Forum",
  youtube: "YouTube",
  podcast: "Podcast",
};

const TYPE_COLORS: Record<CommunitySourceType, string> = {
  fbr_survey: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  news_article: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  reddit: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  glassdoor: "bg-green-500/10 text-green-400 border-green-500/20",
  bbb: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  owner_forum: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  youtube: "bg-red-500/10 text-red-400 border-red-500/20",
  podcast: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

interface Props {
  source: CommunitySource;
}

export default function CommunitySourceBadge({ source }: Props) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${TYPE_COLORS[source.type]} hover:brightness-125 transition-all`}
      title={source.label}
    >
      <span>{TYPE_LABELS[source.type]}</span>
      <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  );
}
