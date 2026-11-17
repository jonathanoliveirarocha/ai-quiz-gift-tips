// Links de afiliado: se algo aqui quebrar, a comissão zera sem nenhum erro visível no site.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.ACTIVE_STORES = 'amazon,shopee';
process.env.AMAZON_ASSOCIATE_TAG = 'padrao-20';
process.env.AMAZON_TRACKING_IDS = 'instagram=insta-20, tiktok=tt-20';
process.env.AFFILIATE_TEMPLATE_SHOPEE = 'https://shopee.com.br/search?keyword={query}&utm_source=an_123&utm_medium=affiliates&utm_content={canal}';
process.env.AFFILIATE_TEMPLATE_MERCADOLIVRE = '';
process.env.SHOPEE_APP_ID = '';

const { buildStoreLinks, affiliateWarnings } = await import('../src/services/stores.js');

test('toda sugestão tem Amazon e Shopee, nessa ordem', () => {
  const links = buildStoreLinks('fone bluetooth');
  assert.deepEqual(
    links.map((l) => l.store),
    ['amazon', 'shopee'],
  );
  assert.ok(links.every((l) => l.affiliate));
});

test('Amazon usa a tag padrão e a tag do canal', () => {
  assert.match(buildStoreLinks('kindle')[0].url, /^https:\/\/www\.amazon\.com\.br\/s\?k=kindle&tag=padrao-20$/);
  assert.match(buildStoreLinks('kindle', 'instagram')[0].url, /&tag=insta-20$/);
  assert.match(buildStoreLinks('kindle', 'canal-desconhecido')[0].url, /&tag=padrao-20$/);
});

test('template da Shopee recebe termo e canal codificados', () => {
  const shopee = buildStoreLinks('caneca térmica', 'tiktok')[1];
  assert.equal(
    shopee.url,
    'https://shopee.com.br/search?keyword=caneca%20t%C3%A9rmica&utm_source=an_123&utm_medium=affiliates&utm_content=tiktok',
  );
});

test('sem alerta de configuração quando Amazon e Shopee estão configuradas', () => {
  assert.deepEqual(affiliateWarnings(), []);
});
