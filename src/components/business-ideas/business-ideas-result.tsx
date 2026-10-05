import type { RefObject } from "react";
import type { IdeasResult } from "@/types/business-ideas";

type Props = { result: IdeasResult; headingRef: RefObject<HTMLHeadingElement | null>; contactHref: string | null };
const basisLabels = {
  "public-content": "Starting point from public page content",
  "your-description": "Starting point from your description",
  possibility: "A possibility to explore — not a confirmed finding",
};

export function BusinessIdeasResult({ result, headingRef, contactHref }: Props) {
  return (
    <section className="space-y-6" aria-labelledby="business-ideas-result-title">
      <div className="space-y-2">
        <h3 id="business-ideas-result-title" ref={headingRef} tabIndex={-1} className="text-2xl font-medium">Here’s where I’d start.</h3>
        <p className="break-words">Three ideas for {result.businessName}.</p>
        <p className="text-sm">{result.source === "website" ? "Based on public text from your website and any context you added. We haven’t checked your internal systems, analytics or performance." : "Based on your description only. No website or Google profile was analysed, so these are exploratory suggestions."}</p>
        {Boolean(result.sourceLinks?.length) && <div className="space-y-2 text-sm">
          <p>Pages used:</p>
          <ul className="space-y-1">
            {result.sourceLinks?.map((link) => <li key={link}><a href={link} target="_blank" rel="noopener noreferrer" className="break-all underline">{link}</a></li>)}
          </ul>
        </div>}
      </div>
      <ol className="space-y-6">
        {result.opportunities.map((idea, index) => (
          <li key={idea.area} className="space-y-2 border-t border-current pt-4 [overflow-wrap:anywhere]">
            <h4 className="text-xl font-medium">{String(index + 1).padStart(2, "0")} — {idea.title}</h4>
            <p>{idea.explanation}</p>
            <p><span className="font-semibold">What I’d build: </span>{idea.build}</p>
            <p className="text-sm">{basisLabels[idea.basis]}</p>
            {idea.evidence && <blockquote className="border-l border-current pl-3 text-sm">“{idea.evidence}”</blockquote>}
          </li>
        ))}
      </ol>
      <div className="space-y-3 border-t border-current pt-6">
        <h3 className="text-xl font-medium">Want me to look at it properly?</h3>
        <p>The ideas above were generated automatically. I’ll personally take a look and tell you what I’d actually do.</p>
        {contactHref && <a className="inline-flex min-h-11 items-center border border-current px-4 py-2" href={contactHref} target="_blank" rel="noopener noreferrer">Talk to Ben ↗</a>}
        {contactHref && <p className="text-sm">WhatsApp opens with your business context, goal and ideas. You decide whether to send the message.</p>}
      </div>
    </section>
  );
}
