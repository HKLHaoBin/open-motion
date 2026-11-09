import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../app.js', import.meta.url), 'utf8');
const functionSource = source.slice(source.indexOf('  const createDialogMedia'), source.indexOf('  const createMediaElement'));

function harness() {
  const nodes = [];
  const element = (tag = 'div') => {
    const classes = new Set();
    const node = {
      tagName: tag.toUpperCase(), children: [], listeners: {}, attributes: {},
      classList: { add: (v) => classes.add(v), remove: (v) => classes.delete(v), contains: (v) => classes.has(v) },
      append(...children) { for (const child of children) { child.remove?.(); child.parent = this; this.children.push(child); } },
      remove() { if (this.parent) this.parent.children = this.parent.children.filter((child) => child !== this); this.parent = null; },
      setAttribute(key, value) { this.attributes[key] = value; },
      removeAttribute(key) { delete this.attributes[key]; },
      addEventListener(event, fn) { this.listeners[event] = fn; },
      querySelector() { return null; }
    };
    nodes.push(node);
    return node;
  };
  const dialogMedia = element();
  const context = vm.createContext({
    URL, document: { createElement: element }, dialogMedia,
    resolveItemMedia: (item) => item.sourceMedia,
    normalizeBilibiliPlayerUrl: (value) => value?.startsWith('https://player.bilibili.com/player.html?') ? value : '',
    createMediaCover: () => element('img'),
    createMotionPreview: () => element(), createMediaElement: () => element('video')
  });
  vm.runInContext(`let dialogSession = 0;\n${functionSource}\nglobalThis.createDialog = createDialogMedia;`, context);
  const item = { title: 'DrawAI', sourceMedia: { kind: 'bilibili', embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1cn4E6dE23&autoplay=0' } };
  return { create: () => context.createDialog(item), nodes, dialogMedia };
}

test('opening a Bilibili detail retains cover and play button without loading an iframe', () => {
  const h = harness();
  const controller = h.create();
  assert.equal(controller.element.children[0].tagName, 'IMG');
  assert.equal(controller.element.children[1].tagName, 'BUTTON');
  assert.equal(h.nodes.filter((n) => n.tagName === 'IFRAME').length, 0);
  assert.equal(h.dialogMedia.attributes['aria-busy'], undefined);
});

test('explicit play starts one iframe even when cover has not loaded', () => {
  const h = harness();
  const controller = h.create();
  const button = controller.element.children[1];
  button.listeners.click();
  button.listeners.click();
  const frames = h.nodes.filter((n) => n.tagName === 'IFRAME');
  assert.equal(frames.length, 1);
  assert.equal(new URL(frames[0].src).searchParams.get('autoplay'), '1');
  assert.equal(frames[0].attributes.sandbox, 'allow-scripts allow-same-origin allow-presentation');
  assert.equal(h.dialogMedia.attributes['aria-busy'], 'true');
  frames[0].listeners.load();
  assert.equal(controller.element.classList.contains('is-loaded'), true);
  assert.equal(button.parent, null);
  assert.equal(h.dialogMedia.attributes['aria-busy'], undefined);
});

test('destroy prevents stale load callbacks and resets the playing iframe', () => {
  const h = harness();
  const controller = h.create();
  controller.element.children[1].listeners.click();
  const frame = h.nodes.find((n) => n.tagName === 'IFRAME');
  controller.destroy();
  frame.listeners.load();
  assert.equal(frame.src, 'about:blank');
  assert.equal(frame.parent, null);
  assert.equal(controller.element.classList.contains('is-loaded'), false);
});

test('superseded detail cannot start playback', () => {
  const h = harness();
  const old = h.create();
  h.create();
  old.element.children[1].listeners.click();
  assert.equal(h.nodes.filter((n) => n.tagName === 'IFRAME').length, 0);
});

test('iframe error preserves cover and allows a user-driven retry', () => {
  const h = harness();
  const controller = h.create();
  const button = controller.element.children[1];
  button.listeners.click();
  const frame = h.nodes.find((n) => n.tagName === 'IFRAME');
  frame.listeners.error();
  assert.equal(controller.element.children[0].tagName, 'IMG');
  assert.equal(controller.element.classList.contains('is-error'), true);
  assert.equal(button.disabled, false);
  assert.equal(controller.element.children.filter((n) => n.tagName === 'SPAN').length, 0);
  assert.equal(button.parent, controller.element);
  button.listeners.click();
  assert.equal(h.nodes.filter((n) => n.tagName === 'IFRAME').length, 2);
  assert.equal(controller.element.classList.contains('is-error'), false);
});
