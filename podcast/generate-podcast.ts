import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";

type PodcastLine = {
  speaker: string;
  hostKey: "A" | "B";
  text: string;
};

const root = process.cwd();
const podcastDir = path.join(root, "podcast");
const outputDir = path.join(podcastDir, "output");
const linesDir = path.join(outputDir, "lines");
const concatFilePath = path.join(outputDir, "concat.txt");
const fullEpisodePath = path.join(outputDir, "podcast-full.mp3");

const apiKey = process.env.ELEVENLABS_API_KEY;
const hostVoiceIds = {
  A: process.env.ELEVENLABS_HOST_A_VOICE_ID,
  B: process.env.ELEVENLABS_HOST_B_VOICE_ID,
} as const;

function ensureDirectories() {
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(linesDir, { recursive: true });
}

function loadLines(): Array<PodcastLine> {
  const filePath = path.join(podcastDir, "podcast-lines.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as Array<PodcastLine>;
}

async function generateClip(text: string, voiceId: string) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ElevenLabs request failed with ${response.status}: ${errorText}`,
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

function tryCombineWithFfmpeg(segmentPaths: Array<string>) {
  writeFileSync(
    concatFilePath,
    segmentPaths.map((filePath) => `file '${filePath.replace(/'/g, "'\\''")}'`).join("\n"),
  );

  const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });

  if (ffmpegCheck.status !== 0) {
    console.log(
      "ffmpeg was not found. Individual line clips were created, but the full episode was not combined.",
    );
    return;
  }

  const combine = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatFilePath,
      "-c",
      "copy",
      fullEpisodePath,
    ],
    { stdio: "inherit" },
  );

  if (combine.status !== 0) {
    throw new Error("ffmpeg failed while combining the podcast clips.");
  }
}

async function main() {
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY.");
  }

  if (!hostVoiceIds.A || !hostVoiceIds.B) {
    throw new Error(
      "Missing ELEVENLABS_HOST_A_VOICE_ID or ELEVENLABS_HOST_B_VOICE_ID.",
    );
  }

  ensureDirectories();

  const lines = loadLines();
  const segmentPaths: Array<string> = [];

  for (const [index, line] of lines.entries()) {
    const voiceId = hostVoiceIds[line.hostKey];

    if (!voiceId) {
      throw new Error(`Missing voice ID for host ${line.hostKey}.`);
    }

    console.log(`Generating line ${index + 1}/${lines.length}: ${line.speaker}`);
    const audioBuffer = await generateClip(line.text, voiceId);
    const filePath = path.join(linesDir, `${String(index + 1).padStart(2, "0")}-${line.hostKey}.mp3`);
    writeFileSync(filePath, audioBuffer);
    segmentPaths.push(filePath);
  }

  tryCombineWithFfmpeg(segmentPaths);

  console.log("Podcast generation complete.");
  console.log(`Line clips: ${linesDir}`);
  console.log(`Combined episode: ${fullEpisodePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
