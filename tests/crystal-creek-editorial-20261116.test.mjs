import test from 'node:test';
import assert from 'node:assert/strict';
import {crystalCreekCaseStudyPage} from '../marketing/restored-homeowner-pages.mjs';

const page = crystalCreekCaseStudyPage(path => path);

test('real Crystal Creek story speaks directly for the local builder', () => {
 assert.match(page.body, /When these Crystal Creek homeowners reached out to us/);
 assert.match(page.body, /Andrew dug by hand with a garden trowel/);
 assert.match(page.body, /two concrete support posts/);
 assert.match(page.body, /two feet/);
 assert.match(page.body, /recess the shower pan without compromising structural support/);
 assert.doesNotMatch(page.body, /the original account describes|previously published October 2026 Wix|restored from/);
});

test('keeps actual photo provenance, working original media and accessible page link', () => {
 assert.match(page.body, /https:\/\/www\.instagram\.com\/p\/DV162KsgUxP\//);
 assert.match(page.body, /real construction video and jobsite photographs appear below on this page/);
 assert.match(page.body, /href="\/accessible-aging-in-place-remodeling"/);
 assert.doesNotMatch(page.body, /href="\/accessible-remodeling"/);
 assert.match(page.body, /Every accessibility remodel starts with different framing/);
});

test('keeps approved metadata and conversion actions', () => {
 assert.match(page.title, /Crystal Creek Accessible Bathroom/);
 assert.match(page.description, /wheelchair-accessible shower and closet in Crystal Creek/);
 assert.equal(page.modified, '2026-11-18');
 assert.match(page.body, /Talk with Andrew about your project/);
 assert.match(page.body, /tel:\+19283500940/);
});
