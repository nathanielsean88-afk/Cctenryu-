// lib/storage.ts
// Penyimpanan pakai JSON file lokal — data reset saat redeploy, tidak butuh database

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJSON<T>(filename: string, fallback: T): T {
  ensureDir()
  const file = path.join(DATA_DIR, filename)
  if (!fs.existsSync(file)) return fallback
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJSON(filename: string, data: unknown) {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2))
}

// ── TYPES ──────────────────────────────────────────────

export type Application = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  city: string
  profession: string
  institution: string
  division: string
  motivation: string
  contribution: string
  referral: string
  portfolio: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  adminNote: string
  reviewedBy: string
  reviewedAt: string
  createdAt: string
}

export type Member = {
  id: string
  clerkId: string
  name: string
  email: string
  imageUrl: string
  division: string
  bio: string
  portfolio: string
  role: 'ADMIN' | 'MEMBER'
  joinedAt: string
}

export type Announcement = {
  id: string
  title: string
  content: string
  authorId: string
  pinned: boolean
  createdAt: string
}

// ── APPLICATIONS ──────────────────────────────────────

export function getApplications(): Application[] {
  return readJSON<Application[]>('applications.json', [])
}

export function saveApplication(app: Application) {
  const apps = getApplications()
  const idx = apps.findIndex(a => a.id === app.id)
  if (idx >= 0) apps[idx] = app
  else apps.push(app)
  writeJSON('applications.json', apps)
}

export function updateApplicationStatus(
  id: string,
  status: 'APPROVED' | 'REJECTED',
  adminNote: string,
  reviewedBy: string
) {
  const apps = getApplications()
  const idx = apps.findIndex(a => a.id === id)
  if (idx < 0) return null
  apps[idx] = { ...apps[idx], status, adminNote, reviewedBy, reviewedAt: new Date().toISOString() }
  writeJSON('applications.json', apps)
  return apps[idx]
}

// ── MEMBERS ──────────────────────────────────────────

export function getMembers(): Member[] {
  return readJSON<Member[]>('members.json', [])
}

export function getMemberByClerkId(clerkId: string): Member | null {
  return getMembers().find(m => m.clerkId === clerkId) ?? null
}

export function saveMember(member: Member) {
  const members = getMembers()
  const idx = members.findIndex(m => m.clerkId === member.clerkId)
  if (idx >= 0) members[idx] = member
  else members.push(member)
  writeJSON('members.json', members)
  return member
}

export function updateMember(clerkId: string, data: Partial<Member>) {
  const members = getMembers()
  const idx = members.findIndex(m => m.clerkId === clerkId)
  if (idx < 0) return null
  members[idx] = { ...members[idx], ...data }
  writeJSON('members.json', members)
  return members[idx]
}

// ── ANNOUNCEMENTS ────────────────────────────────────

export function getAnnouncements(): Announcement[] {
  return readJSON<Announcement[]>('announcements.json', [])
}

export function saveAnnouncement(ann: Announcement) {
  const anns = getAnnouncements()
  anns.unshift(ann)
  writeJSON('announcements.json', anns)
  return ann
}

export function deleteAnnouncement(id: string) {
  const anns = getAnnouncements().filter(a => a.id !== id)
  writeJSON('announcements.json', anns)
}
