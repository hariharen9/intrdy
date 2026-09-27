import type { CourseMetadata } from '@/entities/topic'

export const ANSIBLE_METADATA: CourseMetadata = {
  id: 'ansible',
  title: 'Ansible: Zero to Hero & Enterprise Automation',
  slug: 'ansible',
  icon: '⚡',
  badgeText: 'Zero → Hero',
  tagline: 'Learn Ansible from scratch: agentless automation, idempotence, roles, Vault, and enterprise CI/CD',
  description:
    'Start with zero prior knowledge and master configuration management from first principles. Understand agentless architecture over SSH, inventories, ad-hoc execution, idempotent playbooks, Jinja2 templating, modular Roles, Ansible Vault secrets encryption, dynamic cloud inventories, and AWX enterprise orchestration.',
  quote:
    '"Ansible transforms complex infrastructure into simple, human-readable YAML playbooks that are declarative, idempotent, and completely agentless."',
  quoteContext:
    'Michael DeHaan, Creator of Ansible — Automation for Everyone.',
  footerText:
    'built for beginners to senior devops engineers — 24 topics · agentless architecture · roles & vault · complete interview prep',
  storageKey: 'ansible_progress',
  parts: [
    { partNo: 'PART 1', title: 'Foundations & Agentless Architecture', subtitle: 'Idempotency, SSH control node & inventories' },
    { partNo: 'PART 2', title: 'Playbooks & Core Modules', subtitle: 'YAML plays, tasks, core modules & handlers' },
    { partNo: 'PART 3', title: 'Variables, Logic & Templating', subtitle: 'Precedence, facts, loops, when & Jinja2' },
    { partNo: 'PART 4', title: 'Roles, Collections & Vault', subtitle: 'Modular architecture, FQCN & secrets encryption' },
    { partNo: 'PART 5', title: 'Enterprise Automation & CI/CD', subtitle: 'Dynamic cloud inventory, Molecule, AWX & GitOps' },
    { partNo: 'PART 6', title: 'Emergency Tools & Interview Prep', subtitle: 'Troubleshoot wizard, quiz, cheatsheet & senior Q&As' },
  ],
}
