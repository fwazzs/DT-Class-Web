/** One of the five Design Thinking phases. Each phase owns a sticky-note color. */
export type Phase = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';

export interface ClassInfo {
  name: string;
  semester: string;
  courseCode: string | null;
  department: string | null;
  university: string | null;
  email: string | null;
}

export interface Group {
  /** 1-based group number, shown as "Group 03". */
  number: number;
  /** Phase color used for the group's HMW note and the showcase tint. */
  phase: Phase;
  projectTitle: string | null;
  /** "How might we …?" statement. */
  hmw: string | null;
  members: string[];
  /** Path under /public, e.g. "/images/groups/01.webp". */
  cover: string | null;
  href: string | null;
}

export interface Lecturer {
  name: string | null;
  title: string | null;
  bio: string | null;
  expertise: string[];
  email: string | null;
  photo: string | null;
}

export interface Student {
  /** 1-based roster number. */
  number: number;
  name: string | null;
  nrp: string | null;
  photo: string | null;
  group: number | null;
  feedback: string | null;
}
