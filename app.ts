#!/usr/bin/env node

import { execSync } from "child_process";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import fs from "fs";

interface Arguments {
  ts: boolean;
}

const argv = yargs(hideBin(process.argv)).options({ ts: { type: "boolean", default: false } }).argv as Arguments;

const useTypeScript = argv.ts || false;

const generateFolders = () => {
  try {

    execSync("yarn init -y", { stdio: "inherit" });

    fs.writeFileSync(".gitignore", "node_modules\n.env\nbuild\nyarn.locl\n");
    fs.writeFileSync(".env", "");
    fs.writeFileSync(".env.template", "");
    fs.writeFileSync("README.md", "");

    fs.mkdirSync("src");
    fs.mkdirSync("src/controllers");
    fs.mkdirSync("src/interfaces");
    fs.mkdirSync("src/middlewares");
    fs.mkdirSync("src/routes");
    fs.mkdirSync("src/services");
    fs.mkdirSync("src/utilities");

    const extension = useTypeScript ? "ts" : "js";

    fs.writeFileSync(`src/app.${extension}`, "");
    fs.writeFileSync("README.md", `
      # Cascaron de servidor Express

      ## Instalación
      \`\`\`bash
      yarn install
      \`\`\`
    `);

    execSync("yarn add express dotenv cors", { stdio: "inherit" });
    execSync("yarn add nodemon -D", { stdio: "inherit" });

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    packageJson.main = `./dist/app.js`;

    packageJson.scripts = {
      start: "node ./src/app.js",
      dev: "nodemon ./src/app.js",
    };

    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    if (useTypeScript) {

      execSync("yarn add concurrently @types/express @types/dotenv @types/cors @types/node -D", { stdio: "inherit" });

      fs.writeFileSync("tsconfig.json", `{
        "compilerOptions": {
          "target": "es6",
          "module": "commonjs",
          "outDir": "./dist",
          "strict": true,
          "esModuleInterop": true,
          "skipLibCheck": true,
          "forceConsistentCasingInFileNames": true
        }
      }`);

      packageJson.scripts = {
        start: "node ./dist/app.js",
        dev: "concurrently \"npx tsc --watch\" \"nodemon -q dist/app.js\"",
        build: "npx tsc",
      };

      fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    }
    
    execSync("git init", { stdio: "inherit" });

    console.log("Estructura de directorios creada exitosamente.");
  } catch (err) {
    console.error("Error al generar la estructura de directorios:", err);
  }
}
if (require.main === module){
  generateFolders();
}