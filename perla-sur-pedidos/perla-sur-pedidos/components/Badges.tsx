import type { Source } from "@/lib/types";

const SOURCE_STYLES: Record<Source, { label: string; className: string }> = {
  whatsapp: {
    label: "WhatsApp",
    className: "text-herb border-herb/40 bg-herb/10",
  },
  instagram: {
    label: "Instagram",
    className: "text-achiote border-achiote/40 bg-achiote/10",
  },
  llamada: {
    label: "Llamada",
    className: "text-turmeric border-turmeric/40 bg-turmeric/10",
  },
};

export function SourceBadge({ source }: { source: Source }) {
  const s = SOURCE_STYLES[source];
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] leading-none ${s.className}`}
    >
      {s.label}
    </span>
  );
}

export function OwnerBadge({ owner }: { owner: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surfaceRaised px-2 py-0.5 text-[11px] text-muted">
      {owner}
    </span>
  );
}
