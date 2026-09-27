import type { QAItem } from '@/entities/topic'

export const ansibleQAFundamentals: QAItem[] = [
  [
    'What is Ansible and how does its architecture differ from Chef, Puppet, and SaltStack?',
    'Ansible is an open-source, agentless configuration management and orchestration engine. While Chef and Puppet use a pull-based client/server model requiring custom agent daemons installed on every managed node, Ansible uses a push-based model over standard OpenSSH (or WinRM for Windows) with temporary Python execution payloads. It requires zero agents on targets, drastically reducing operational overhead.',
  ],
  [
    'Explain the principle of "Idempotency" in Ansible and why it is foundational to infrastructure automation.',
    'An operation is idempotent if applying it once produces the desired state, and applying it multiple consecutive times produces the exact same outcome without causing side effects or redundant changes. In Ansible, if a package is already installed, a user already exists, or a config file matches the template, the task reports `ok` (green) instead of `changed` (yellow), ensuring systems remain stable.',
  ],
  [
    'What is the difference between an Ansible Ad-Hoc command and an Ansible Playbook?',
    'An Ad-Hoc command (`ansible <host-pattern> -m <module> -a <args>`) executes a single task quickly across targets (e.g. rebooting 50 servers or checking disk usage via `ansible all -m shell -a "df -h"`). A Playbook (`ansible-playbook site.yml`) is a repeatable, version-controlled YAML document that defines multi-tier deployment workflows, orchestrating packages, templates, handlers, and roles in order.',
  ],
  [
    'What is the difference between the `command`, `shell`, and `raw` modules?',
    '- `ansible.builtin.command`: Executes a command directly without passing it through a remote shell. Does not support shell variables, pipes (`|`), redirects (`>`), or logic operators (`&&`). Safer against injection.\n- `ansible.builtin.shell`: Executes the command through `/bin/sh` on the remote node, supporting full piping and environment variables.\n- `ansible.builtin.raw`: Sends commands directly over SSH without invoking Python on the target node (used for bootstrapping Python on pristine minimal OS installs or network routers).',
  ],
  [
    'Explain how Handlers work in Ansible and describe when they are triggered.',
    'Handlers are special tasks that only run when explicitly notified by another task that reported a state change (`changed: true`). Multiple tasks can notify the same handler (e.g. 3 tasks notify `Restart Nginx`), but the handler will only execute once at the very end of the play. Handlers are skipped if all notifying tasks report `ok` or if an unhandled error aborts the play earlier.',
  ],
  [
    'What are Ansible Facts and how are they gathered?',
    'Facts are system and hardware properties (CPU cores, RAM, OS distribution, IP addresses, disk partitions) automatically discovered from the remote host at the beginning of a play by running the `setup` module. They are exposed as the `ansible_facts` dictionary and can be used for dynamic decisions (e.g. `when: ansible_facts[\'os_family\'] == "Debian"`). Fact gathering can be disabled with `gather_facts: false` to speed up execution.',
  ],
  [
    'What is the purpose of `become: true` and how does privilege escalation work?',
    '`become: true` allows tasks to execute with elevated privileges (typically `root`) using mechanisms like `sudo`, `su`, or `pbrun`. It can be declared at the play level, role level, block level, or individual task level. The privilege escalation password can be provided via `--ask-become-pass` (`-K`) or configured via passwordless sudo in `/etc/sudoers`.',
  ],
  [
    'What is the difference between `copy` and `template` modules?',
    '- `ansible.builtin.copy`: Transfers a static file directly from the control node (or remote path) to the managed host byte-for-byte without variable substitution.\n- `ansible.builtin.template`: Parses a Jinja2 template (`.j2`) on the control node, interpolates variables, facts, and logic, and writes the rendered static configuration file onto the managed node.',
  ],
  [
    'What are `group_vars` and `host_vars` in an Ansible project?',
    'They are dedicated directories used to organize variable definitions decoupled from playbooks. Files inside `group_vars/<group_name>.yml` apply automatically to all hosts belonging to that inventory group, while files inside `host_vars/<hostname>.yml` apply exclusively to that specific target host, overriding group variables.',
  ],
  [
    'What is the difference between `ansible.cfg` in the current directory vs `/etc/ansible/ansible.cfg`?',
    'Ansible evaluates configuration in strict priority order:\n1. `ANSIBLE_CONFIG` environment variable (highest)\n2. `./ansible.cfg` (in current working directory)\n3. `~/.ansible.cfg` (in user home directory)\n4. `/etc/ansible/ansible.cfg` (system default, lowest).\nPlacing `ansible.cfg` in your project root allows project-specific overrides (inventory paths, roles paths, SSH settings) without modifying system configs.',
  ],
]

export const ansibleQAAdvanced: QAItem[] = [
  [
    'Explain the Ansible Variable Precedence order and how conflicts are resolved.',
    'Ansible has a 22-level variable precedence hierarchy. The general rule from lowest to highest priority is:\n1. Role defaults (`defaults/main.yml` — intentionally lowest, easily overridden)\n2. Inventory file group/host vars\n3. Playbook `group_vars` and `host_vars`\n4. Playbook `vars` block\n5. Role `vars/main.yml` (strongly bound to role)\n6. Registered task variables (`register:`)\n7. Extra vars passed on the CLI (`-e / --extra-vars` — absolute highest, overrides everything).',
  ],
  [
    'How does Ansible Vault work, and how do you protect production secrets in Git repositories?',
    'Ansible Vault uses AES-256 encryption to encrypt entire YAML files (`ansible-vault encrypt credentials.yml`) or individual string variables (`ansible-vault encrypt_string --name "db_pass"`). In CI/CD, the vault password is provided via a secure environment variable or vault password file path (`--vault-password-file`). Multiple vault passwords can be managed across environments using Vault IDs (`--vault-id staging@prompt`, `--vault-id prod@/path/to/key`).',
  ],
  [
    'What is the standard directory structure of an Ansible Role, and what is the responsibility of each folder?',
    'A standard Ansible Role contains:\n- `tasks/main.yml`: Main list of tasks executed by the role\n- `handlers/main.yml`: Handlers triggered by `notify`\n- `templates/`: Jinja2 template files (`.j2`)\n- `files/`: Static files deployed via `copy`\n- `vars/main.yml`: High-priority role variables\n- `defaults/main.yml`: Low-priority default variables intended for user customization\n- `meta/main.yml`: Role metadata, author info, and dependencies on other roles\n- `tests/`: Test playbooks and inventories for Molecule testing.',
  ],
  [
    'What are Dynamic Inventories, and how do they replace static INI/YAML files in cloud environments (AWS, GCP, Azure, K8s)?',
    'In dynamic cloud environments, instances autoscale and IPs change constantly. Dynamic inventory plugins (e.g. `amazon.aws.aws_ec2`, `google.cloud.gcp_compute`) query cloud provider APIs during playbook startup to automatically construct inventory groups based on tags (e.g. `tag_Environment_prod`, `tag_Role_web`), VPC IDs, and regions, completely eliminating manual IP management.',
  ],
  [
    'How do you handle errors, rollbacks, and recovery in Ansible using `block`, `rescue`, and `always`?',
    '`block` groups tasks logically. If any task inside the `block` fails, execution halts and jumps immediately to the `rescue` section, which acts like a `catch` block (e.g. rolling back database migrations or alerting Slack). The `always` section runs unconditionally regardless of success or failure (e.g. removing temporary lock files).',
  ],
  [
    'How can you optimize Ansible execution speed across thousands of nodes?',
    '1. Increase concurrency forks in `ansible.cfg` (`forks = 50` or `100` instead of default 5).\n2. Enable SSH Pipelining (`pipelining = True`) in `ansible.cfg` to reuse SSH connections without transferring temporary Python files to disk.\n3. Enable Fact Caching (Redis / JSON files) so facts are not gathered repeatedly.\n4. Set `gather_facts: false` when system facts are not required.\n5. Use the `free` strategy (`strategy: free`) so fast nodes don\'t wait for slow nodes between tasks.',
  ],
  [
    'What is Molecule and how does it enable Test-Driven Development (TDD) for Ansible roles?',
    'Molecule is the enterprise testing framework for Ansible. It automates testing roles against ephemeral Docker containers, Podman, or cloud VMs. A Molecule test scenario creates test instances, applies the role via `converge.yml`, tests idempotency by re-running the playbook to verify zero changes, and executes verification tests (e.g. Testinfra or Ansible assertions) before destroying the test environment.',
  ],
  [
    'What is the difference between `import_tasks` / `import_role` and `include_tasks` / `include_role`?',
    '- `import_*` (Static): Processed at playbook parsing time before execution starts. Loops cannot be used directly on `import_*`, and variable evaluation happens statically.\n- `include_*` (Dynamic): Processed dynamically at runtime when the task is reached. Supports loops over task lists, dynamic role names based on runtime variables, and evaluates conditions when executed.',
  ],
  [
    'What is AWX / Red Hat Ansible Automation Controller and what enterprise problems does it solve?',
    'AWX is the open-source upstream web UI and REST API for Ansible. It solves enterprise scalability challenges:\n1. Centralized Role-Based Access Control (RBAC) with LDAP/SAML integration\n2. Secure credential storage (SSH keys and passwords are used without exposing them to developers)\n3. Visual Workflow Templates (chaining multiple playbooks with success/failure branching)\n4. Webhook triggers from GitHub/GitLab for GitOps automation\n5. Scheduled cron jobs and interactive user survey forms.',
  ],
  [
    'How do you safely test Ansible Playbooks before running them against production infrastructure?',
    '1. Run syntax validation: `ansible-playbook --syntax-check site.yml`\n2. Run linter: `ansible-lint site.yml` to catch anti-patterns and security violations\n3. Run dry-run check mode with diffs: `ansible-playbook -i inventory.ini site.yml --check --diff`\n4. Execute against isolated staging/ephemeral test environments provisioned by Molecule.',
  ],
]
