import type { WizardNode } from '@/entities/topic'

export const ANSIBLE_CRASH_WIZARD_TREE: Record<string, WizardNode> = {
  "start": {
    "q": "What failure is preventing your Ansible playbook from executing?",
    "options": [
      {
        "label": "SSH Connection Refused / Permission Denied (publickey)",
        "next": "ssh_err"
      },
      {
        "label": "\"Failed to lock apt cache\" or Package Manager lock",
        "next": "pkg_lock"
      },
      {
        "label": "Undefined variable or Jinja2 template rendering error",
        "next": "var_err"
      },
      {
        "label": "Ansible Vault Decryption Failed / Invalid password",
        "next": "vault_err"
      }
    ]
  },
  "ssh_err": {
    "result": true,
    "title": "Fix SSH Connection & Authentication Failures",
    "body": "Ansible cannot reach the remote target node via OpenSSH.",
    "cmds": [
      "# 1. Test SSH connectivity with ad-hoc ping:",
      "ansible all -i hosts.ini -m ping -u ubuntu --private-key=~/.ssh/id_rsa",
      "",
      "# 2. Disable strict host key checking if newly provisioned:",
      "# export ANSIBLE_HOST_KEY_CHECKING=False"
    ]
  },
  "pkg_lock": {
    "result": true,
    "title": "Resolve Apt/Dpkg Lock Held by System",
    "body": "Ubuntu/Debian unattended upgrades or another apt process holds /var/lib/dpkg/lock-frontend.",
    "cmds": [
      "# 1. Add retries to your apt task in the playbook:",
      "# - name: Install packages with retry",
      "#   ansible.builtin.apt:",
      "#     name: nginx",
      "#     state: present",
      "#   register: apt_res",
      "#   retries: 5",
      "#   delay: 10",
      "#   until: apt_res is not failed"
    ]
  },
  "var_err": {
    "result": true,
    "title": "Fix Undefined Variable & Template Errors",
    "body": "A variable evaluated in a task or Jinja2 template does not exist in host_vars/group_vars.",
    "cmds": [
      "# 1. Check if the target host is actually inside the inventory group",
      "",
      "# 2. Add safe default fallbacks inside Jinja2 templates:",
      "# {{ http_port | default(80) }}"
    ]
  },
  "vault_err": {
    "result": true,
    "title": "Fix Vault Decryption Password Error",
    "body": "Ansible Vault failed to decrypt secret variables.",
    "cmds": [
      "# 1. Test decryption directly:",
      "ansible-vault view vars/secrets.yml --vault-password-file .vault_pass"
    ]
  }
}
