import { describe, expect, it } from 'vitest';
import { CLASS_INFO, GROUPS, LECTURER } from '../data/site';
import { safeEmail, safeHref } from './safeUrl';

describe('safeHref', () => {
  it('keeps anchors, site paths and https', () => {
    expect(safeHref('#group-03')).toBe('#group-03');
    expect(safeHref('/groups/3')).toBe('/groups/3');
    expect(safeHref('https://example.com/p')).toBe('https://example.com/p');
  });
  it('drops dangerous or unexpected schemes', () => {
    for (const bad of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', 'http://example.com', '//evil.com', 'nonsense', '']) {
      expect(safeHref(bad)).toBeNull();
    }
    expect(safeHref(null)).toBeNull();
  });
});

describe('safeEmail', () => {
  it('accepts a plain address and rejects parameter injection', () => {
    expect(safeEmail('lecturer@its.ac.id')).toBe('lecturer@its.ac.id');
    expect(safeEmail('a@b.id?bcc=x@y.z')).toBeNull();
    expect(safeEmail('a@b.id&body=hi')).toBeNull();
    expect(safeEmail('not an email')).toBeNull();
  });
});

// Guards the content file itself: anything filled in must pass the checks above.
describe('site.ts content', () => {
  it('has only safe links and emails', () => {
    for (const g of GROUPS) if (g.href) expect(safeHref(g.href)).not.toBeNull();
    for (const e of [CLASS_INFO.email, LECTURER.email]) if (e) expect(safeEmail(e)).not.toBeNull();
  });
});
