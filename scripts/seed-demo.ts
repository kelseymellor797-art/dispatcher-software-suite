import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { demoDispatchState } from "../src/domain/seed";

const outputPath = join(process.cwd(), "demo-data.json");
writeFileSync(outputPath, JSON.stringify(demoDispatchState, null, 2));
console.log(`Wrote fictional demo data to ${outputPath}`);
