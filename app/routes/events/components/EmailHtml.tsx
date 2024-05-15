import EmailGig from "~/data/models/EmailGig";

export function EmailHtml({ gig }: { gig: ReturnType<EmailGig['serialize']> }) {
  return (
    <table className="text-nowrap">
      <tbody dangerouslySetInnerHTML={{ __html: gig.originalHtml ?? "(email html here)" }} />
    </table>
  );
}
