import { createReadStream, existsSync, statSync } from "fs";
import path from "path";

function getPodcastPath() {
  return path.join(process.cwd(), "podcast", "output", "podcast-full.wav");
}

export async function GET(request: Request) {
  const filePath = getPodcastPath();

  if (!existsSync(filePath)) {
    return Response.json(
      { error: "Podcast audio file not found." },
      { status: 404 },
    );
  }

  const fileSize = statSync(filePath).size;
  const range = request.headers.get("range");

  if (!range) {
    const stream = createReadStream(filePath);

    return new Response(stream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache",
      },
    });
  }

  const match = range.match(/bytes=(\d*)-(\d*)/);

  if (!match) {
    return new Response("Invalid range request", { status: 416 });
  }

  const start = match[1] ? Number.parseInt(match[1], 10) : 0;
  const end = match[2] ? Number.parseInt(match[2], 10) : fileSize - 1;

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end >= fileSize ||
    start > end
  ) {
    return new Response("Invalid range request", { status: 416 });
  }

  const stream = createReadStream(filePath, { start, end });

  return new Response(stream as unknown as ReadableStream, {
    status: 206,
    headers: {
      "Content-Type": "audio/wav",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache",
    },
  });
}
