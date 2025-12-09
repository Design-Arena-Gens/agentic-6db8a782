/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useMemo, useState } from "react";

interface AgentInsight {
  title: string;
  url: string;
  source?: string;
  author?: string;
  publishedAt?: string;
  summary: string;
  keyPoints: string[];
  keywords: string[];
}

interface AgentContentIdeas {
  headlines: string[];
  blogOutline: string[];
  socialPosts: string[];
  videoScript: string[];
}

interface AgentPayload {
  retrievedAt: string;
  insights: AgentInsight[];
  contentIdeas: AgentContentIdeas;
}

const quickTopics = [
  "AI marketing automation",
  "Sustainable fashion trends",
  "Creator economy updates",
  "Consumer tech launches",
  "Web3 brand activations",
];

const toneOptions = [
  "Insightful",
  "Playful",
  "Urgent",
  "Visionary",
  "Practical",
];

const formatOptions = [
  { id: "blog_outline", label: "Blog Outline" },
  { id: "social_thread", label: "Social Thread" },
  { id: "newsletter", label: "Newsletter" },
  { id: "video_script", label: "Video Script" },
];

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function AgentInterface() {
  const [topic, setTopic] = useState("AI marketing automation");
  const [audience, setAudience] = useState("content creators");
  const [tone, setTone] = useState("Insightful");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    "blog_outline",
    "social_thread",
    "video_script",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<AgentPayload | null>(null);

  const requestAgent = useCallback(
    async (targetTopic: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: targetTopic,
            audience,
            tone,
            contentFormats: selectedFormats,
          }),
        });

        if (!response.ok) {
          const details = await response.json().catch(() => ({}));
          throw new Error(details.error ?? "Unexpected error");
        }

        const data = (await response.json()) as AgentPayload;
        setPayload(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not generate insights. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [audience, selectedFormats, tone],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await requestAgent(topic);
    },
    [requestAgent, topic],
  );

  const toggleFormat = useCallback((value: string) => {
    setSelectedFormats((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }, []);

  const handleQuickTopic = useCallback(
    (value: string) => {
      setTopic(value);
      void requestAgent(value);
    },
    [requestAgent],
  );

  const retrievedAt = useMemo(() => {
    if (!payload?.retrievedAt) return null;
    return formatter.format(new Date(payload.retrievedAt));
  }, [payload?.retrievedAt]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:py-16">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
          Agent Workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Generate fresh intel & content angles in seconds
        </h1>
        <p className="max-w-3xl text-base text-zinc-600">
          This autonomous agent scans the latest coverage, distills the strongest
          talking points, and reshapes them into ready-to-use assets for your next drop,
          thread, or video.
        </p>
      </header>

      <section className="grid gap-6 rounded-3xl border border-zinc-200 bg-white/70 p-6 backdrop-blur sm:grid-cols-[minmax(0,360px)_1fr] sm:p-8">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Focus topic</label>
            <textarea
              className="h-28 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Describe the trend, product launch, or niche you want to explore."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">
              Audience (optional)
            </label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              placeholder="e.g. B2B marketers, Gen Z shoppers, indie hackers"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTone(option)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    tone === option
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">
              Content formats
            </label>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleFormat(option.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    selectedFormats.includes(option.id)
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {loading ? (
              <>
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white" />
                Fetching intel...
              </>
            ) : (
              <>Run agent</>
            )}
          </button>

          <div className="flex flex-wrap gap-2">
            {quickTopics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickTopic(item)}
                className="rounded-full border border-transparent bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-zinc-900 hover:bg-white hover:text-zinc-900"
              >
                {item}
              </button>
            ))}
          </div>
        </form>

        <div className="flex flex-col gap-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!payload && !loading && !error && (
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/60 p-10 text-center text-zinc-500">
              <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4a1.svg"
                alt="Lightbulb icon"
                className="h-10 w-10"
              />
              <p className="text-base font-medium">
                Feed the agent a topic to spin up cross-format content instantly.
              </p>
              <p className="text-sm text-zinc-400">
                It will surface breaking narratives, bulletproof takeaways, and
                publishing-ready hooks.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex animate-pulse flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="h-4 w-1/2 rounded-full bg-zinc-200" />
              <div className="h-4 w-2/3 rounded-full bg-zinc-200" />
              <div className="h-32 rounded-2xl bg-zinc-100" />
              <div className="h-32 rounded-2xl bg-zinc-100" />
            </div>
          )}

          {payload && !loading && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Latest sync
                  </p>
                  <p className="text-sm text-zinc-600">{retrievedAt}</p>
                </div>
                <div className="text-xs text-zinc-400">
                  {payload.insights.length} sources processed
                </div>
              </div>

              <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Insight stream
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {payload.insights.map((insight) => (
                    <article
                      key={insight.url}
                      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
                        <span>{insight.source ?? "Live source"}</span>
                        {insight.publishedAt && (
                          <span>
                            {formatter.format(new Date(insight.publishedAt))}
                          </span>
                        )}
                      </div>
                      <a
                        href={insight.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-semibold text-zinc-900 underline-offset-4 hover:underline"
                      >
                        {insight.title}
                      </a>
                      <p className="text-sm text-zinc-600">{insight.summary}</p>
                      <ul className="flex flex-col gap-1 text-sm text-zinc-600">
                        {insight.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {insight.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Content production kit
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <ContentCard title="Headline ideas" items={payload.contentIdeas.headlines} />
                  <ContentCard title="Blog outline" items={payload.contentIdeas.blogOutline} />
                  <ContentCard title="Social post hooks" items={payload.contentIdeas.socialPosts} />
                  <ContentCard title="Video script beats" items={payload.contentIdeas.videoScript} />
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ContentCardProps {
  title: string;
  items: string[];
}

function ContentCard({ title, items }: ContentCardProps) {
  const [copied, setCopied] = useState(false);

  const copyContent = useCallback(() => {
    if (!items.length) return;

    void navigator.clipboard
      .writeText(items.join("\n"))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch((error) => {
        console.error("Unable to copy content", error);
      });
  }, [items]);

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        <button
          type="button"
          onClick={copyContent}
          className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 transition hover:border-zinc-900 hover:text-zinc-900 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
          disabled={!items.length}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <ul className="flex flex-col gap-2 text-sm text-zinc-600">
        {items.length === 0 ? (
          <li className="rounded-xl bg-zinc-50 px-3 py-2 text-zinc-400">
            Waiting for the agent to surface new angles.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item}
              className="rounded-xl bg-zinc-50 px-3 py-2 leading-relaxed text-zinc-700"
            >
              {item}
            </li>
          ))
        )}
      </ul>
    </article>
  );
}
