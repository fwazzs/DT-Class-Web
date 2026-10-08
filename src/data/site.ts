import type { ClassInfo, Group, Lecturer, Phase, Student } from '@/types';

// Content lives here. `null` renders as a visible [placeholder] until the real value is filled in.

export const CLASS_INFO: ClassInfo = {
  name: 'Design Thinking Class C',
  semester: '2026',
  courseCode: null,
  department: null,
  university: null,
  email: null,
};

export const PHASE_ORDER: Phase[] = ['empathize', 'define', 'ideate', 'prototype', 'test'];

export const GROUPS: Group[] = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  phase: PHASE_ORDER[i % 5],
  projectTitle: null,
  hmw: null,
  members: [],
  cover: null,
  href: null,
}));

export const LECTURER: Lecturer = {
  name: null,
  title: null,
  bio: null,
  expertise: [],
  email: null,
  photo: null,
};

export const STUDENTS: Student[] = Array.from({ length: 50 }, (_, i) => ({
  number: i + 1,
  name: null,
  nrp: null,
  photo: null,
  group: null,
  feedback: null,
}));
