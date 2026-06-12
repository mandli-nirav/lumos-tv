/**
 * Renders a JSON-LD structured-data script tag.
 *
 * Google parses JSON-LD anywhere in the document (head or body), so the
 * script is emitted in place — no head hoisting required.
 *
 * @param {{ data: Object | Object[] }} props - One schema object or an array of them.
 */
export function JsonLd({ data }) {
  if (!data) return null;
  const schemas = Array.isArray(data) ? data : [data];

  return schemas.map((schema, i) => (
    <script
      key={i}
      type='application/ld+json'
      // `<` is escaped so a `</script>` sequence inside API-provided text
      // (e.g. a movie overview) can never terminate the script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  ));
}
