const SOURCE_METADATA_PATTERN = /^\[\[sources:\s*(.+?)\]\]\s*/i;

export function extractSourceTitles(content: string) {
  const match = content.match(SOURCE_METADATA_PATTERN);

  if (!match) {
    return [];
  }

  return match[1]
    .split("|")
    .map((title) => title.trim())
    .filter(Boolean);
}

export function stripSourceMetadata(content: string) {
  return content.replace(SOURCE_METADATA_PATTERN, "").trimStart();
}
