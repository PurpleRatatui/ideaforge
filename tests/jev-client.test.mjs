import assert from 'node:assert/strict';
import { test } from 'node:test';
import { askJev, resolveJevCredentials, TypeSafeError } from '../lib/killmyidea/typesafe.ts';

const questions = {
  problem: { type: 'score', instructions: 'Is there a real problem?', criteria: ['None', 'Mild', 'Urgent'] },
  category: { type: 'choice', instructions: 'Which category?', criteria: { SaaS: 'Subscription software' } },
  is_understandable: { type: 'noul', instructions: 'The pitch can be understood.' },
};
const fixture = { model: 'test-only', answers: { is_understandable: { type: 'noul', noul: 0.9 } } };

test('credentials stay paired with their provider; empty setup remains unavailable', () => {
  assert.equal(resolveJevCredentials({}), null);
  assert.equal(resolveJevCredentials({ TYPESAFE_API_KEY: ' ', AI_GATEWAY_API_KEY: '' }), null);
  assert.deepEqual(resolveJevCredentials({ AI_GATEWAY_API_KEY: 'gateway-test' }), { apiKey: 'gateway-test', provider: 'vercel' });
  assert.deepEqual(resolveJevCredentials({ TYPESAFE_API_KEY: 'direct-test', AI_GATEWAY_API_KEY: 'gateway-test' }), { apiKey: 'direct-test', provider: 'typesafe' });
});

for (const [provider, url, model, apiKey] of [
  ['typesafe', 'https://api.typesafe.ai/v1/systemone', 'jev-latest', 'direct-test'],
  ['vercel', 'https://ai-gateway.vercel.sh/typesafe/v1/systemone', 'typesafe-ai/jev', 'gateway-test'],
]) {
  test(`${provider} sends all question types unchanged with the matching key and model`, async (t) => {
    t.mock.method(globalThis, 'fetch', async (actualUrl, options) => {
      assert.equal(actualUrl, url);
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, `Bearer ${apiKey}`);
      assert.deepEqual(JSON.parse(options.body), { model, state: { startup_idea: 'Synthetic test idea' }, questions });
      return Response.json(fixture);
    });
    const result = await askJev({ provider, apiKey, state: { startup_idea: 'Synthetic test idea' }, questions });
    assert.deepEqual(result.response, fixture);
  });
}

test('gateway authentication failure does not send its credential to TypeSafe', async (t) => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    requests.push(url);
    return Response.json({ message: 'Invalid credential' }, { status: 401 });
  });
  await assert.rejects(askJev({ provider: 'vercel', apiKey: 'invalid-test', state: 'Synthetic test', questions }), e => e instanceof TypeSafeError && e.status === 401);
  assert.deepEqual(requests, ['https://ai-gateway.vercel.sh/typesafe/v1/systemone']);
});
