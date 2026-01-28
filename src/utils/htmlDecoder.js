/**
 * Decode HTML entities in a string
 * Converts entities like &#039; to ', &quot; to ", etc.
 */
export function decodeHtmlEntities(text) {
  if (!text || typeof text !== "string") return text;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Parse cancellation description with HTML entities and newline handling
 * Converts &#039; to ', handles \n as line breaks, and trims whitespace
 */
export function parseCancellationDescription(text) {
  if (!text || typeof text !== "string") return text;

  // Decode HTML entities
  let decoded = decodeHtmlEntities(text);

  // Convert literal \n to actual newlines
  decoded = decoded.replace(/\\n/g, "\n");

  return decoded;
}
