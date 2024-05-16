import EmailGig from "~/data/models/EmailGig";

export function EmailHtml({ gig }: { gig: ReturnType<EmailGig["serialize"]> }) {
  return (
    <table>
      <tbody
        className="align-top"
        dangerouslySetInnerHTML={{ __html: gig.originalHtml ?? "(email html here)" }}
      />
    </table>
  );
}
