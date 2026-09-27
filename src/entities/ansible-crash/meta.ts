import type { CourseMetadata }
from '@/entities/topic'

export const ANSIBLE_CRASH_METADATA: CourseMetadata = {
  "id": "ansible-crash",
  "title": "Ansible: Fast-Track Crash Course",
  "slug": "ansible-crash",
  "icon": "📜",
  "badgeText": "⚡ Fast-Track · ~40 min",
  "tagline": "Agentless automation simplified: Inventories, Playbooks, core modules, Jinja2 templates, Roles & Vault",
  "description": "A high-yield, zero-to-automation crash course to master Ansible in 40 minutes. Understand the agentless SSH push model, idempotency, writing declarative YAML playbooks, templating configs with Jinja2, handlers, roles, and encrypting secrets with Ansible Vault.",
  "quote": "\"Automation is not about doing things faster; it is about doing things identically, reliably, and predictably every single time.\"",
  "quoteContext": "Michael DeHaan — Creator of Ansible",
  "footerText": "fast-track crash course — 11 focused topics · agentless push · idempotency · jinja2 & roles · ansible cheatsheet",
  "storageKey": "ansible_crash_progress",
  "parts": [
    {
      "partNo": "PART 1",
      "title": "Mental Models & The Agentless Push",
      "subtitle": "Push over SSH, Idempotency, and Inventory structure (INI & YAML)"
    },
    {
      "partNo": "PART 2",
      "title": "Ad-Hoc Commands & Playbook Anatomy",
      "subtitle": "Ad-hoc execution, Playbook structure, tasks, and core system modules"
    },
    {
      "partNo": "PART 3",
      "title": "Variables, Templates, Handlers & Roles",
      "subtitle": "Jinja2 templating, loops, conditionals, event handlers, and Ansible Galaxy roles"
    },
    {
      "partNo": "PART 4",
      "title": "Secrets, Drills & Cheatsheet",
      "subtitle": "Ansible Vault, Playbook triage wizard, quiz, and essential CLI cheat sheet"
    }
  ]
}
