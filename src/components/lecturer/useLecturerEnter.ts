'use client';

import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useFrame } from '@/hooks/useFrame';
import { usePageTop } from '@/hooks/usePageTop';
import { enterProgress, lecturerFrame, tornPolygon } from './lecturerMotion';

interface Nodes {
  page: HTMLElement | null;
  unders: HTMLElement[];
  photo: HTMLElement | null;
  photoTape: HTMLElement | null;
  title: HTMLElement | null;
  card: HTMLElement | null;
  cardTape: HTMLElement | null;
}

function collect(root: HTMLElement): Nodes {
  const one = (k: string): HTMLElement | null => root.querySelector<HTMLElement>(`[data-lec="${k}"]`);
  return {
    page: one('page'),
    unders: Array.from(root.querySelectorAll<HTMLElement>('[data-lec="under"]')),
    photo: one('photo'),
    photoTape: one('photo-tape'),
    title: one('title'),
    card: one('card'),
    cardTape: one('card-tape'),
  };
}

function write(n: Nodes, enter: number): void {
  const f = lecturerFrame(enter);
  if (n.page) {
    n.page.style.transform = f.pageTransform;
    n.page.style.opacity = String(f.pageOpacity);
  }
  n.unders.forEach((el) => {
    el.style.opacity = String(f.underOpacity);
  });
  if (n.photo) {
    n.photo.style.transform = f.photoTransform;
    n.photo.style.opacity = String(f.photoOpacity);
  }
  if (n.photoTape) n.photoTape.style.opacity = String(f.photoTape);
  if (n.title) n.title.style.clipPath = f.titleClip;
  if (n.card) {
    n.card.style.transform = f.cardTransform;
    n.card.style.opacity = String(f.cardOpacity);
  }
  if (n.cardTape) n.cardTape.style.opacity = String(f.cardTape);
}

/**
 * Drives the lecturer entrance from scroll. Elements are found by `data-lec` inside `rootRef`
 * and written imperatively; reduced motion writes the final state once and never subscribes.
 */
export function useLecturerEnter(rootRef: RefObject<HTMLElement | null>, reduced: boolean): void {
  const nodes = useRef<Nodes | null>(null);
  const last = useRef(-1);
  const pageTop = usePageTop(rootRef);

  const update = (vh: number, rectTop: number): void => {
    const root = rootRef.current;
    const n = nodes.current;
    if (!root || !n) return;
    const e = reduced ? 1 : enterProgress(rectTop, vh);
    if (e === last.current) return;
    last.current = e;
    write(n, e);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const n = collect(root);
    nodes.current = n;
    // Torn-paper cut-outs are polygons computed once; they never change.
    root.querySelectorAll<HTMLElement>('[data-torn]').forEach((el) => {
      const [seed, jitter] = (el.dataset.torn ?? '0:0').split(':').map(Number);
      el.style.clipPath = tornPolygon(seed, jitter);
    });
    last.current = -1;
    update(window.innerHeight, root.getBoundingClientRect().top);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `update` only closes over refs and `reduced`
  }, [reduced]);

  useFrame((frame) => update(frame.vh, pageTop.current - frame.scrollY), !reduced);
}
