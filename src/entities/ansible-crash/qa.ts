import type { QAItem } from '@/entities/topic'

export const ansibleCrashQAFundamentals: QAItem[] = [
  [
    "What does \"Agentless Architecture\" mean in Ansible and why is it an advantage?",
    "Unlike Puppet or Chef which require installing, upgrading, and securing background daemon agents on every target server, Ansible connects over standard OpenSSH (or WinRM for Windows) and executes Python code directly. There is zero software to maintain on target nodes."
  ],
  [
    "What is \"Idempotency\" in configuration management?",
    "Idempotency means executing a playbook once, twice, or a hundred times results in the exact same target state without side effects. If NGINX is already installed and running, Ansible reports \"ok\" (green) and skips reinstalling it, only changing state if a difference exists."
  ],
  [
    "What is the difference between the \"command\" module and the \"shell\" module?",
    "• command: Runs commands directly via exec without passing through a shell (no pipes |, redirects >, or environment variable expansions work, but it is safer).\n• shell: Runs commands through /bin/sh, enabling full shell features like pipes, redirects, and environment variables."
  ]
]

export const ansibleCrashQAAdvanced: QAItem[] = [
  [
    "What is an Ansible Handler and when does it execute?",
    "A Handler is a special task that only runs when notified by another task that reported a \"changed\" state. Handlers run once at the very end of the play (e.g. restarting NGINX only if the configuration template file actually changed)."
  ],
  [
    "How does Ansible Vault protect sensitive secrets in Git repositories?",
    "Ansible Vault encrypts YAML files (or specific variable strings) with AES-256 using a password or key file. You can safely commit encrypted vault files to Git and pass \"--vault-password-file\" during playbook execution."
  ]
]
