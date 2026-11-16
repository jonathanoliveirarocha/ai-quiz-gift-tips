// Importa produtos parceiros (links de afiliado) de um arquivo JSON para o MongoDB.
// Uso: npm run import:catalog -- caminho/para/produtos.json
// Formato: veja backend/data/catalogo-exemplo.json. Produtos com o mesmo "url" são atualizados.
import fs from 'node:fs';
import path from 'node:path';
import { connectDatabase, closeDatabase, isDbReady } from '../src/db.js';
import { Product } from '../src/models.js';
import { productInput } from '../src/routes.js';

const file = process.argv[2];
if (!file) {
  console.error('Informe o arquivo: npm run import:catalog -- caminho/produtos.json');
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'));
if (!Array.isArray(items)) {
  console.error('O arquivo precisa conter uma lista (array) de produtos.');
  process.exit(1);
}

await connectDatabase();
if (!isDbReady()) {
  console.error('Sem conexão com o MongoDB.');
  process.exit(1);
}

let ok = 0;
for (const [i, item] of items.entries()) {
  try {
    const data = productInput(item);
    await Product.findOneAndUpdate({ url: data.url }, data, { upsert: true, runValidators: true, setDefaultsOnInsert: true });
    ok++;
  } catch (err) {
    console.error(`Item ${i + 1} (${item?.title ?? 'sem título'}): ${err.message}`);
  }
}

console.log(`${ok} de ${items.length} produtos importados.`);
await closeDatabase();
process.exit(0);
