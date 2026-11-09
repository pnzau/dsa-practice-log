import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const runnerArguments = process.argv.slice(2);
const isMarathon = runnerArguments.includes("--marathon");
const hasChallengeName = runnerArguments.some(
  (argument) => !argument.startsWith("--"),
);
const runAll =
  runnerArguments.includes("--all") || (isMarathon && !hasChallengeName);
const requestedChallenge = runnerArguments.find(
  (argument) => !argument.startsWith("--"),
);
const dsaDirectory = resolve(isMarathon ? "src/dsa-marathon" : "src/dsa");

function printSampleCommands(): void {
  if (isMarathon) {
    console.error("Usage: npm run dsa:marathon");
    console.error("       npm run dsa:marathon -- <challenge-name>");
  } else {
    console.error("Usage: npm run dsa -- <challenge-name>");
    console.error("       npm run dsa -- rate_limiter");
    console.error("       npm run dsa:all");
  }
}

function challengePath(challengeName: string): string {
  if (!/^[a-z0-9_]+$/.test(challengeName)) {
    throw new Error(
      "Challenge names may contain only lowercase letters, numbers, and underscores.",
    );
  }

  return resolve(dsaDirectory, `${challengeName}.ts`);
}

const challengePaths =
  runAll
    ? readdirSync(dsaDirectory)
        .filter((fileName) => fileName.endsWith(".ts"))
        .sort()
        .map((fileName) => resolve(dsaDirectory, fileName))
    : requestedChallenge
      ? [challengePath(requestedChallenge)]
      : [];

if (challengePaths.length === 0) {
  if (runAll) {
    console.error(`No TypeScript challenges found in ${dsaDirectory}.`);
  } else {
    printSampleCommands();
  }
  process.exitCode = 1;
} else if (challengePaths.some((filePath) => !existsSync(filePath))) {
  const missingPath = challengePaths.find((filePath) => !existsSync(filePath));
  console.error(`Challenge not found: ${missingPath ?? "unknown"}`);
  process.exitCode = 1;
} else {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--test", ...challengePaths],
    { stdio: "inherit" },
  );

  process.exitCode = result.status ?? 1;
}
