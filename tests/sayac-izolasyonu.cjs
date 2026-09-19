// Isolated JS/DOM stubs, not browser layout or campaign validity verification.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let timerId = 0;
const timers = new Map();
const events = [];
const context = vm.createContext({
    document: { readyState: 'complete', addEventListener: (_, fn) => events.push(fn) },
    setInterval: fn => { timers.set(++timerId, fn); return timerId; },
    clearInterval: id => timers.delete(id)
});
const roots = [];
for (const file of ['flash-sayac.twig', 'flash-urun.twig']) {
    const source = fs.readFileSync('canlitema/' + file, 'utf8');
    assert(!/id="(days|hours|minutes|seconds)"/.test(source));
    for (let instance = 0; instance < 2; instance++) {
        const fields = new Map();
        const root = { isConnected: true, querySelector: key => {
            if (!fields.has(key)) fields.set(key, { textContent: 'untouched' });
            return fields.get(key);
        }};
        context.document.currentScript = { previousElementSibling: root };
        vm.runInContext(source.match(/<script>([\s\S]*?)<\/script>/)[1], context);
        assert.equal(fields.size, 4);
        assert([...fields.values()].every(x => x.textContent !== 'untouched'));
        roots.push(root);
    }
}
assert.equal(timers.size, 4);
assert.equal(context.updateCountdown, undefined);
assert.equal(context.getNextMonday, undefined);
for (const root of roots) root.isConnected = false;
for (const fn of [...timers.values()]) fn();
assert.equal(timers.size, 0);
console.log('PASS four countdown instances: scoped fields, no global functions, detached timers stopped. Campaign schedule unverified.');
