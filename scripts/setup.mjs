// Cria o backend/.env na primeira execução e pede a chave da API do Gemini.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

const root = path.resolve(import.meta.dirname, '..');
const envPath = path.join(root, 'backend', '.env');
const examplePath = path.join(root, 'backend', '.env.example');

if (fs.existsSync(envPath)) {
  console.log('       backend/.env encontrado.');
  process.exit(0);
}

let content = fs.readFileSync(examplePath, 'utf8');

console.log('\n  Primeira execução: configure a chave da API do Gemini.');
console.log('  Crie uma chave grátis em https://aistudio.google.com/apikey\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const key = (await rl.question('  Cole a chave (ou aperte Enter para usar o modo demonstração): ')).trim();
rl.close();

if (key) content = content.replace(/^GEMINI_API_KEY=.*$/m, `GEMINI_API_KEY=${key}`);
fs.writeFileSync(envPath, content);

console.log(
  key
    ? '\n  Chave salva em backend/.env.\n'
    : '\n  Modo demonstração ativado. Para usar o Gemini depois, coloque a chave em backend/.env.\n',
);
