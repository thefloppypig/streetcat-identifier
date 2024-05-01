import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { FeederData } from "../src/shared/Types"
import { PluginOption } from "vite";
import { feederRoot } from "../src/shared/Const"

function processFeederList() {
    const listDir = readdirSync(feederRoot, { withFileTypes: true });

    const feederIndexMap: FeederData[] = [];

    for (const feeder of listDir) {
        if (feeder.isDirectory()) {
            try {
                const index = readFileSync(`${feederRoot}/${feeder.name}/index.json`, "utf8");
                const json = JSON.parse(index) as FeederData;
                json.__feeder = feeder.name;
                feederIndexMap.push(json);
            } catch (error) {
                console.log(`${feeder.name} has no index.json`)
            }
        }
    }

    writeFileSync(`${feederRoot}/feederList.json`, JSON.stringify(feederIndexMap, undefined, "    "));
}



export const processList: PluginOption = {
    name: "processFeederList",
    async buildStart(options) {
        processFeederList();
    },
}