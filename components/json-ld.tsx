/**
 * JSON-LD component for rendering structured data
 * Safely serializes and injects Schema.org structured data into the page
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
