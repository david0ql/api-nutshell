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

    fs.writeFileSync(".gitignore", "node_modules\n.env\nbuild\n");
    fs.writeFileSync(".env", "");
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

    if (useTypeScript) {

      execSync("yarn add @types/express @types/dotenv @types/cors @types/node -D", { stdio: "inherit" });

      fs.writeFileSync("tsconfig.json", `{
        "compilerOptions": {
          "target": "es6",
          "module": "commonjs",
          "outDir": "./build",
          "strict": true,
          "esModuleInterop": true,
          "skipLibCheck": true,
          "forceConsistentCasingInFileNames": true
        }
      }`);

    }


    fs.writeFileSync("nodemon.json", `{
      "watch": ["src"],
      "ext": "${extension}",
      "exec": "ts-node src/app.${extension}"
    }`);
    
    execSync("git init", { stdio: "inherit" });

    console.log("Estructura de directorios creada exitosamente.");
  } catch (err) {
    console.error("Error al generar la estructura de directorios:", err);
  }
}
if (require.main === module){
  generateFolders();
}