import type { Topic, TopicGroup } from '@/entities/topic'

export const ANSIBLE_GROUPS: TopicGroup[] = [
  {
    "id": "foundations",
    "name": "Foundations & Agentless Architecture"
  },
  {
    "id": "playbooks",
    "name": "Playbooks & Core Modules"
  },
  {
    "id": "templating",
    "name": "Variables, Logic & Templating"
  },
  {
    "id": "roles-vault",
    "name": "Roles, Collections & Vault"
  },
  {
    "id": "enterprise",
    "name": "Enterprise Automation & CI/CD"
  },
  {
    "id": "interview",
    "name": "Interview Prep & Troubleshooting"
  }
]

export const ANSIBLE_TOPICS: Topic[] = [
  {
    "id": "ansible-foundations-architecture",
    "group": "foundations",
    "level": "Basics",
    "title": "What is Ansible & Configuration Management",
    "sectionNo": "01",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Imagine you manage 50 Linux servers. You need to install Nginx, deploy a security patch, update an SSL certificate, and create a developer user on every single machine. Doing this manually via SSH is error-prone, slow, and impossible to audit. Writing custom Bash scripts helps, but Bash scripts are <strong>imperative</strong> (step-by-step commands) and quickly break when run a second time.</p>\n        \n        <h3>What is Configuration Management?</h3>\n        <p><strong>Configuration Management (CM)</strong> is the practice of defining your infrastructure state as code (IaC), ensuring systems are provisioned, configured, and maintained in a predictable, auditable, and automated manner.</p>\n\n        <h3>Why Ansible? The Agentless Revolution</h3>\n        <p>Earlier tools like <strong>Puppet</strong> and <strong>Chef</strong> rely on an <em>agent-based, pull architecture</em>: every server must run a background daemon that periodically polls a central master server. This means extra CPU/memory overhead, open listener ports, and painful agent upgrade cycles.</p>\n        <p><strong>Ansible is 100% Agentless and Push-based.</strong> It requires NO software or background daemon installed on the target servers &mdash; only standard <strong>OpenSSH</strong> and <strong>Python</strong> (which are already present on virtually every modern Linux server). For Windows nodes, Ansible uses native <strong>WinRM</strong>.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Agent-Based (Puppet / Chef):\n  [Central Server] ◄─── (Pulls config every 30 mins) ─── [Node: Running Agent Daemon]\n\nAgentless Push (Ansible):\n  [Control Node / Laptop / CI Runner]\n        │\n        ├── SSH (Port 22) ──► [Server A: Standard Linux + Python]\n        ├── SSH (Port 22) ──► [Server B: Standard Linux + Python]\n        └── WinRM (5986)  ──► [Server C: Windows + PowerShell]</code></pre></div>\n\n        <h3>The Principle of Idempotency</h3>\n        <p><strong>Idempotency</strong> means running a task once achieves the desired target state, and running it 1,000 more times does nothing if the state is already satisfied. You declare <em>what</em> the system should look like (Declarative), and Ansible figures out <em>how</em> to get there safely.</p>\n        <ul>\n          <li><strong>Bash (Imperative):</strong> <code>apt-get install nginx</code> &mdash; runs apt every time, regardless of whether Nginx is installed.</li>\n          <li><strong>Ansible (Declarative &amp; Idempotent):</strong> <code>state: present</code> &mdash; checks if Nginx is installed. If yes: reports <code>ok</code> (green). If no: installs it and reports <code>changed</code> (yellow).</li>\n        </ul>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Ansible is agentless: Connects over standard SSH for Linux and WinRM for Windows.</li>\n          <li>Idempotency guarantees that executing playbooks repeatedly is safe and produces predictable state.</li>\n          <li>Ansible combines configuration management, application deployment, and multi-tier orchestration in simple human-readable YAML.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "control-node-managed-nodes",
    "group": "foundations",
    "level": "Basics",
    "title": "Control Node Setup & SSH Connectivity",
    "sectionNo": "02",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>To run Ansible, you need to understand the relationship between the <strong>Control Node</strong> and <strong>Managed Nodes</strong>.</p>\n\n        <h3>Control Node vs Managed Nodes</h3>\n        <ul>\n          <li><strong>Control Node:</strong> Any machine where Ansible is installed (your macOS/Linux laptop, a dedicated bastion VM, or a Jenkins/GitHub Actions CI container). Windows cannot be a native Control Node (though it can run inside WSL2).</li>\n          <li><strong>Managed Nodes (Targets):</strong> The servers, containers, or network devices being configured. Managed nodes only need Python 3.8+ and SSH.</li>\n        </ul>\n\n        <h3>Installation &amp; Setup</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Install Ansible on Ubuntu / Debian\nsudo apt update && sudo apt install -y ansible-core python3-pip\n\n# Or install via Python Pip (Recommended for exact version pinning)\npip install ansible-core\n\n# Verify installation\nansible --version</code></pre></div>\n\n        <h3>Configuration Hierarchy (<code>ansible.cfg</code>)</h3>\n        <p>Ansible searches for its configuration file in the following order (first found wins):</p>\n        <ol>\n          <li><code>ANSIBLE_CONFIG</code> (Environment variable)</li>\n          <li><code>./ansible.cfg</code> (In current working directory &mdash; recommended per-project)</li>\n          <li><code>~/.ansible.cfg</code> (In user home directory)</li>\n          <li><code>/etc/ansible/ansible.cfg</code> (Global system default)</li>\n        </ol>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">ini</span></div><pre><code class=\"language-ini\"># Sample production-ready ./ansible.cfg\n[defaults]\ninventory = ./inventory.ini\nremote_user = ubuntu\nprivate_key_file = ~/.ssh/id_ed25519\nhost_key_checking = False\nforks = 20\ntimeout = 30\nstdout_callback = yaml\n\n[privilege_escalation]\nbecome = True\nbecome_method = sudo\nbecome_user = root\nbecome_ask_pass = False</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Control Node executes Ansible; Managed Nodes execute tasks pushed over SSH.</li>\n          <li>Always place an <code>ansible.cfg</code> in your project root to keep project configurations self-contained.</li>\n          <li>Use SSH Key-based authentication (Ed25519 or RSA) for seamless passwordless automation.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "inventories-static-dynamic",
    "group": "foundations",
    "level": "Basics",
    "title": "Inventories: Static Files, Groups & Variables",
    "sectionNo": "03",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>The <strong>Inventory</strong> defines <em>what</em> machines Ansible manages. Inventories can be written in simple INI format or YAML, and support hierarchical groupings, host aliases, and connection parameters.</p>\n\n        <h3>1. INI Format Inventory (<code>inventory.ini</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">ini</span></div><pre><code class=\"language-ini\"># Individual host with custom connection parameters\ndb1 ansible_host=10.0.1.20 ansible_user=postgres ansible_port=22\n\n# Grouping servers by role\n[webservers]\nweb1 ansible_host=10.0.1.10\nweb2 ansible_host=10.0.1.11\nweb[3:5] ansible_host=10.0.1.1[2:4]  # Range expansion (web3, web4, web5)\n\n[databases]\ndb1\n\n# Nested Parent Groups (group of groups using :children)\n[production:children]\nwebservers\ndatabases</code></pre></div>\n\n        <h3>2. YAML Format Inventory (<code>inventory.yml</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">all:\n  children:\n    webservers:\n      hosts:\n        web1:\n          ansible_host: 10.0.1.10\n        web2:\n          ansible_host: 10.0.1.11\n    databases:\n      hosts:\n        db1:\n          ansible_host: 10.0.1.20\n          ansible_user: postgres\n    production:\n      children:\n        webservers:\n        databases:</code></pre></div>\n\n        <h3>Organizing Variables: <code>group_vars</code> and <code>host_vars</code></h3>\n        <p>Never hardcode environment variables directly inside playbooks. Instead, create dedicated directory structures next to your inventory:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">my-ansible-project/\n├── inventory.ini\n├── group_vars/\n│   ├── all.yml          # Variables applied to EVERY host in inventory\n│   ├── webservers.yml   # Variables applied only to [webservers] group\n│   └── databases.yml    # Variables applied only to [databases] group\n└── host_vars/\n    └── web1.yml         # Variable overrides specific to host 'web1'</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Inventories map hosts into functional groups (<code>webservers</code>, <code>databases</code>, <code>production</code>).</li>\n          <li>Use <code>group_vars/</code> and <code>host_vars/</code> directories for clean, scalable configuration management.</li>\n          <li>Two default magic groups always exist: <code>all</code> (contains every host) and <code>ungrouped</code>.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "ad-hoc-commands",
    "group": "foundations",
    "level": "Basics",
    "title": "Ad-Hoc Commands & Rapid Diagnostics",
    "sectionNo": "04",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Before writing full Playbooks, Ansible provides <strong>Ad-Hoc Commands</strong>. An Ad-Hoc command is a quick, one-line execution of a single module across an inventory group. It is perfect for rapid diagnostics, emergency patching, or checking cluster health.</p>\n\n        <h3>Ad-Hoc Command Syntax</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">ansible &lt;host-pattern&gt; -i &lt;inventory&gt; -m &lt;module&gt; -a \"&lt;arguments&gt;\" [options]</code></pre></div>\n\n        <h3>Practical Daily Ad-Hoc Examples</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Test connectivity and Python execution on all hosts\nansible all -i inventory.ini -m ping\n\n# 2. Check disk usage across all webservers\nansible webservers -m command -a \"df -h /\"\n\n# 3. Restart a systemd service with sudo privileges (-b = become)\nansible webservers -b -m ansible.builtin.systemd -a \"name=nginx state=restarted\"\n\n# 4. Install security package across all nodes concurrently with 50 forks (-f)\nansible all -b -f 50 -m ansible.builtin.apt -a \"name=curl state=present update_cache=yes\"\n\n# 5. Copy a file directly to remote hosts\nansible webservers -b -m ansible.builtin.copy -a \"src=./motd.txt dest=/etc/motd mode=0644\"\n\n# 6. Gather and display hardware facts for a specific host\nansible db1 -m ansible.builtin.setup -a \"filter=ansible_memtotal_mb\"</code></pre></div>\n\n        <h3>Choosing the Right Execution Module: <code>command</code> vs <code>shell</code> vs <code>raw</code></h3>\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>command (Default)</h4>\n            <p>Executes binary directly. No shell variables, pipes (<code>|</code>), or redirection. Safe against shell injection.</p>\n          </div>\n          <div class=\"card\">\n            <h4>shell</h4>\n            <p>Executes through <code>/bin/sh</code> on remote host. Supports pipes (<code>grep</code>, <code>awk</code>), redirects (<code>&gt;</code>), and environment vars.</p>\n          </div>\n          <div class=\"card\">\n            <h4>raw</h4>\n            <p>Bypasses the Ansible module subsystem completely. Runs raw SSH commands without needing Python on the target.</p>\n          </div>\n        </div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use Ad-Hoc commands for fast one-off tasks without writing a playbook.</li>\n          <li>The <code>ping</code> module tests SSH connection and Python execution &mdash; not ICMP network ping!</li>\n          <li>Use <code>-b</code> (become) to execute tasks with root / sudo privileges.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "yaml-playbook-anatomy",
    "group": "playbooks",
    "level": "Basics",
    "title": "YAML Syntax & Playbook Anatomy",
    "sectionNo": "05",
    "category": "Playbooks",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>While Ad-Hoc commands run single tasks, <strong>Playbooks</strong> are the heart of Ansible. A Playbook is a declarative YAML file that orchestrates multi-step configuration, deployment, and operational workflows across ordered tiers of servers.</p>\n\n        <h3>Anatomy of a Playbook</h3>\n        <p>A Playbook contains one or more <strong>Plays</strong>. A Play maps a group of hosts to a list of ordered <strong>Tasks</strong>.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">---\n# Play 1: Configure Web Tier\n- name: Setup and configure production Nginx webservers\n  hosts: webservers\n  become: true\n  gather_facts: true\n\n  vars:\n    http_port: 80\n    app_root: /var/www/html\n\n  tasks:\n    - name: Ensure Nginx package is installed\n      ansible.builtin.apt:\n        name: nginx\n        state: present\n        update_cache: yes\n\n    - name: Deploy custom index page\n      ansible.builtin.copy:\n        content: \"&lt;h1&gt;Welcome to Production Cluster&lt;/h1&gt;\"\n        dest: \"{{ app_root }}/index.html\"\n        mode: '0644'\n\n    - name: Ensure Nginx service is running and enabled on boot\n      ansible.builtin.systemd:\n        name: nginx\n        state: started\n        enabled: true\n\n# Play 2: Configure Database Tier\n- name: Setup PostgreSQL database servers\n  hosts: databases\n  become: true\n  tasks:\n    - name: Install PostgreSQL server\n      ansible.builtin.apt:\n        name: postgresql\n        state: present</code></pre></div>\n\n        <h3>Executing a Playbook</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Run playbook against inventory\nansible-playbook -i inventory.ini site.yml\n\n# Check syntax without executing\nansible-playbook -i inventory.ini site.yml --syntax-check\n\n# Step-through mode: prompts for confirmation before every task\nansible-playbook -i inventory.ini site.yml --step\n\n# Limit execution to a single specific host\nansible-playbook -i inventory.ini site.yml --limit web1</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Playbooks map target host groups to sequential lists of idempotent tasks.</li>\n          <li>Always begin YAML files with <code>---</code> and use strict 2-space indentation (never tabs!).</li>\n          <li>Always give every Play and Task a descriptive <code>name:</code> for clear execution logs.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "core-builtin-modules",
    "group": "playbooks",
    "level": "Intermediate",
    "title": "Essential Built-in Modules",
    "sectionNo": "06",
    "category": "Playbooks",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Ansible includes hundreds of built-in modules in the <code>ansible.builtin</code> collection. Mastering the core modules covers 90% of all real-world infrastructure automation needs.</p>\n\n        <h3>1. Package Management (<code>apt</code>, <code>yum</code>, <code>package</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Install packages on Debian/Ubuntu\n  ansible.builtin.apt:\n    name:\n      - curl\n      - git\n      - htop\n    state: present  # present = install if missing, latest = upgrade to latest, absent = remove</code></pre></div>\n\n        <h3>2. File &amp; Directory Operations (<code>file</code>, <code>copy</code>, <code>lineinfile</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># Create directory with strict permissions\n- name: Create secure application directory\n  ansible.builtin.file:\n    path: /opt/myapp\n    state: directory\n    owner: www-data\n    group: www-data\n    mode: '0750'\n\n# Ensure a specific line exists in a config file (idempotent regex matching)\n- name: Ensure SSH password authentication is disabled\n  ansible.builtin.lineinfile:\n    path: /etc/ssh/sshd_config\n    regexp: '^#?PasswordAuthentication'\n    line: 'PasswordAuthentication no'\n    validate: '/usr/sbin/sshd -t -f %s'</code></pre></div>\n\n        <h3>3. Service Management (<code>systemd</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Reload daemon and ensure Nginx is started and enabled on boot\n  ansible.builtin.systemd:\n    name: nginx\n    state: started\n    enabled: true\n    daemon_reload: yes</code></pre></div>\n\n        <h3>4. User &amp; Group Management (<code>user</code>, <code>group</code>, <code>authorized_key</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Create deployer user with sudo access\n  ansible.builtin.user:\n    name: deployer\n    shell: /bin/bash\n    groups: sudo\n    append: yes\n\n- name: Deploy SSH public key for deployer\n  ansible.builtin.authorized_key:\n    user: deployer\n    state: present\n    key: \"ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG... devops@company.com\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>ansible.builtin.package</code> for OS-agnostic package installations.</li>\n          <li>Use <code>lineinfile</code> with <code>validate:</code> to avoid corrupting critical system configurations (e.g. <code>sshd_config</code>, <code>sudoers</code>).</li>\n          <li>Always specify explicit <code>mode:</code>, <code>owner:</code>, and <code>group:</code> on file tasks.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "idempotency-check-mode",
    "group": "playbooks",
    "level": "Intermediate",
    "title": "Mastering Idempotency & Dry-Run Check Mode",
    "sectionNo": "07",
    "category": "Playbooks",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>In production operations, you must be able to verify exactly what changes a playbook will make <em>before</em> touching live production servers. Ansible provides <strong>Check Mode</strong> (<code>--check</code>) and <strong>Diff Mode</strong> (<code>--diff</code>) for zero-risk dry runs.</p>\n\n        <h3>Dry-Run Execution: <code>--check</code> &amp; <code>--diff</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Run playbook in dry-run mode: does not write changes to target servers\nansible-playbook -i inventory.ini site.yml --check\n\n# Combine with --diff to see line-by-line file diffs that would be applied:\nansible-playbook -i inventory.ini site.yml --check --diff</code></pre></div>\n\n        <h3>Preserving Idempotency with <code>changed_when</code> &amp; <code>failed_when</code></h3>\n        <p>When running arbitrary scripts with <code>command</code> or <code>shell</code>, Ansible cannot know if state actually changed. By default, it always flags the task as <code>changed: true</code>. You can override this behavior using <code>changed_when</code>:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Run database migration tool\n  ansible.builtin.command: /usr/local/bin/migrate status\n  register: migration_output\n  # Task only reports 'changed' if migrations were actually executed!\n  changed_when: \"'MIGRATIONS_APPLIED' in migration_output.stdout\"\n  # Task only fails if the return code is not 0 AND not 2 (where 2 means noop)\n  failed_when: migration_output.rc not in [0, 2]\n\n- name: Extract archive only if target directory is absent\n  ansible.builtin.command: tar -xzf /tmp/app.tar.gz -C /opt/app\n  args:\n    creates: /opt/app/bin/server  # Skips task if file already exists!</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Always test production playbooks with <code>ansible-playbook --check --diff</code> before running them live.</li>\n          <li>Use <code>args.creates</code> or <code>args.removes</code> on command/shell tasks to make them idempotent.</li>\n          <li>Use <code>changed_when: false</code> for read-only inspection commands to prevent false positives.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "handlers-event-driven",
    "group": "playbooks",
    "level": "Intermediate",
    "title": "Handlers: Event-Driven Service Restarts",
    "sectionNo": "08",
    "category": "Playbooks",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>If you update 3 separate configuration files for Nginx in a playbook, you do not want Nginx to restart 3 consecutive times during the deployment. <strong>Handlers</strong> solve this by executing service reloads or restarts <em>only once</em>, at the very end of the play, and only if at least one notifying task made a change.</p>\n\n        <h3>How Handlers Work</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">---\n- name: Configure Web Application\n  hosts: webservers\n  become: true\n\n  tasks:\n    - name: Update Nginx main configuration\n      ansible.builtin.template:\n        src: nginx.conf.j2\n        dest: /etc/nginx/nginx.conf\n      notify: Restart Nginx\n\n    - name: Update virtual host site config\n      ansible.builtin.template:\n        src: app.site.j2\n        dest: /etc/nginx/sites-available/app\n      notify: Restart Nginx\n\n  handlers:\n    - name: Restart Nginx\n      ansible.builtin.systemd:\n        name: nginx\n        state: restarted</code></pre></div>\n\n        <h3>Advanced Handler Control: <code>flush_handlers</code> &amp; <code>force_handlers</code></h3>\n        <ul>\n          <li><strong>Immediate Execution (<code>meta: flush_handlers</code>):</strong> Forces all currently pending handlers to run immediately in the middle of a play, instead of waiting for the play to finish (e.g. restart database before running app migrations).</li>\n          <li><strong>Surviving Task Failures (<code>force_handlers: true</code>):</strong> By default, if a later task fails, pending handlers are skipped. Setting <code>force_handlers: true</code> ensures handlers still run.</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Deploy App and flush handlers immediately\n  hosts: webservers\n  force_handlers: true\n  tasks:\n    - name: Deploy TLS certs\n      ansible.builtin.copy:\n        src: cert.pem\n        dest: /etc/ssl/certs/app.pem\n      notify: Reload Nginx\n\n    - name: Flush handlers right now\n      ansible.builtin.meta: flush_handlers\n\n    - name: Run health check against restarted service\n      ansible.builtin.uri:\n        url: https://localhost/health\n        status_code: 200</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Handlers only run if the notifying task reported <code>changed: true</code>.</li>\n          <li>Multiple tasks notifying the same handler will trigger that handler only once.</li>\n          <li>Use <code>ansible.builtin.meta: flush_handlers</code> to execute pending handlers mid-playbook.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "variables-and-precedence",
    "group": "templating",
    "level": "Intermediate",
    "title": "Variables & The 22-Level Precedence Hierarchy",
    "sectionNo": "09",
    "category": "Templating",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Variables make playbooks reusable across environments (Dev, Staging, Production). Because variables can be defined in inventories, playbooks, roles, and CLI flags, Ansible uses a strict <strong>22-level precedence hierarchy</strong> to resolve conflicts.</p>\n\n        <h3>Key Variable Locations</h3>\n        <ul>\n          <li><strong>Role Defaults (<code>roles/app/defaults/main.yml</code>):</strong> Lowest priority. Intended as default fallback values that can be easily overridden.</li>\n          <li><strong>Inventory Group/Host Vars (<code>group_vars/</code>, <code>host_vars/</code>):</strong> Environment-level configs (e.g. database host per cluster).</li>\n          <li><strong>Playbook <code>vars</code> block:</strong> Declared inside the play definition.</li>\n          <li><strong>Role Vars (<code>roles/app/vars/main.yml</code>):</strong> High priority. Constants strongly tied to the role logic.</li>\n          <li><strong>Registered Variables (<code>register:</code>):</strong> Captures dynamic output of previous tasks.</li>\n          <li><strong>Extra Vars (<code>-e / --extra-vars</code>):</strong> Absolute highest priority &mdash; overrides everything!</li>\n        </ul>\n\n        <h3>Simplified Precedence Cheat Sheet (Lowest to Highest)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">1. Role Defaults (defaults/main.yml)       ◄── LOWEST (Easily overridden)\n2. Inventory group_vars / all.yml\n3. Inventory group_vars / <group>.yml\n4. Inventory host_vars / <host>.yml\n5. Playbook vars\n6. Role vars (vars/main.yml)\n7. Block / Task vars\n8. Registered task variables (register:)\n9. Extra Vars (-e 'var=value')              ◄── HIGHEST (Absolute Override)</code></pre></div>\n\n        <h3>Capturing Task Output: <code>register</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Check kernel version\n  ansible.builtin.command: uname -r\n  register: kernel_info\n\n- name: Print captured output\n  ansible.builtin.debug:\n    msg: \"Target host is running Linux kernel {{ kernel_info.stdout }}\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Put reusable defaults in <code>defaults/main.yml</code>; put immutable constants in <code>vars/main.yml</code>.</li>\n          <li>Extra vars passed on CLI (<code>-e \"env=prod\"</code>) will override all other variable definitions.</li>\n          <li>Use <code>register:</code> to capture output, stdout, return codes, and status from any task.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "facts-and-magic-variables",
    "group": "templating",
    "level": "Intermediate",
    "title": "Ansible Facts & Magic Variables",
    "sectionNo": "10",
    "category": "Templating",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>When a playbook starts, Ansible executes the <code>setup</code> module behind the scenes to discover everything about the target host (CPU cores, IP addresses, OS distribution, disk partitions). These are called <strong>Facts</strong>.</p>\n\n        <h3>Using Ansible Facts</h3>\n        <p>Modern Ansible exposes facts under the structured <code>ansible_facts</code> dictionary:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Configure OS-specific package repository\n  ansible.builtin.apt_repository:\n    repo: \"ppa:ondrej/php\"\n    state: present\n  when: ansible_facts['os_family'] == \"Debian\"\n\n- name: Allocate memory based on total system RAM\n  ansible.builtin.template:\n    src: jvm.options.j2\n    dest: /etc/elasticsearch/jvm.options\n  vars:\n    heap_size_mb: \"{{ (ansible_facts['memtotal_mb'] / 2) | int }}\"</code></pre></div>\n\n        <h3>Performance Optimization: Disabling Fact Gathering</h3>\n        <p>Fact gathering takes 1-3 seconds per host over SSH. If your playbook does not need system facts, disable it for dramatic speedups:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Fast Docker container deployment\n  hosts: all\n  gather_facts: false  # Skips running setup module!</code></pre></div>\n\n        <h3>Essential Magic Variables</h3>\n        <ul>\n          <li><code>inventory_hostname</code>: Name of current target host as defined in the inventory.</li>\n          <li><code>groups</code>: Dictionary of all inventory groups and their member hosts (e.g. <code>groups['databases']</code>).</li>\n          <li><code>hostvars</code>: Dictionary allowing access to variables and facts of <em>other</em> hosts!</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># Example: Generate load balancer config pointing to all webserver private IPs\n# In nginx.conf.j2:\nupstream backend_nodes {\n{% for host in groups['webservers'] %}\n    server {{ hostvars[host]['ansible_host'] }}:8080;\n{% endfor %}\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Facts are system properties discovered via the <code>setup</code> module.</li>\n          <li>Access other hosts' facts dynamically using <code>hostvars[other_host]['var_name']</code>.</li>\n          <li>Set <code>gather_facts: false</code> when system facts are not required to cut execution time in half.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "loops-and-conditionals",
    "group": "templating",
    "level": "Intermediate",
    "title": "Control Flow: Loops, Conditionals & Lookups",
    "sectionNo": "11",
    "category": "Templating",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Ansible provides declarative constructs for iteration (<code>loop</code>) and conditional execution (<code>when</code>), letting you adapt task behavior dynamically without writing procedural code.</p>\n\n        <h3>1. Iteration with <code>loop</code></h3>\n        <p>Use <code>loop</code> to iterate over simple lists or complex lists of dictionaries:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># Simple list loop\n- name: Install utility packages\n  ansible.builtin.apt:\n    name: \"{{ item }}\"\n    state: present\n  loop:\n    - htop\n    - jq\n    - tmux\n    - net-tools\n\n# List of dictionaries with custom loop variable name\n- name: Create developer user accounts\n  ansible.builtin.user:\n    name: \"{{ user.name }}\"\n    uid: \"{{ user.uid }}\"\n    shell: /bin/bash\n    state: present\n  loop:\n    - { name: 'alice', uid: 1050 }\n    - { name: 'bob', uid: 1051 }\n  loop_control:\n    loop_var: user\n    label: \"{{ user.name }}\"  # Keeps console output clean</code></pre></div>\n\n        <h3>2. Conditionals with <code>when</code></h3>\n        <p>Tasks execute only if the <code>when</code> condition evaluates to true. Note: do NOT put <code>{{ }}</code> inside <code>when</code> clauses!</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Install Apache on RedHat / Rocky Linux\n  ansible.builtin.yum:\n    name: httpd\n    state: present\n  when: ansible_facts['os_family'] == \"RedHat\" and environment_tier == \"production\"\n\n- name: Restart app service only if config changed AND not in dry-run\n  ansible.builtin.systemd:\n    name: myapp\n    state: restarted\n  when:\n    - config_file_result.changed\n    - not ansible_check_mode</code></pre></div>\n\n        <h3>3. Lookup Plugins</h3>\n        <p>Lookups evaluate data on the <strong>Control Node</strong> during playbook execution (reading local files, environment variables, or password stores):</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Read local public SSH key from control node\n  ansible.builtin.authorized_key:\n    user: ubuntu\n    key: \"{{ lookup('file', '~/.ssh/id_rsa.pub') }}\"\n\n- name: Read environment variable from control node\n  ansible.builtin.debug:\n    msg: \"CI Build ID is {{ lookup('env', 'BUILD_NUMBER') | default('local-run') }}\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>loop:</code> instead of legacy <code>with_items:</code> for cleaner iteration.</li>\n          <li>Never use <code>{{ }}</code> inside <code>when:</code> statements &mdash; expressions are already evaluated as Jinja2.</li>\n          <li>Lookups execute on the <em>control node</em>, not the remote managed host.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "jinja2-templating",
    "group": "templating",
    "level": "Advanced",
    "title": "Jinja2 Templating Deep Dive",
    "sectionNo": "12",
    "category": "Templating",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Ansible leverages the Python <strong>Jinja2</strong> templating engine to generate dynamic configuration files (Nginx, Apache, Prometheus, PostgreSQL) based on host variables, cluster topology, and environment facts.</p>\n\n        <h3>Template Syntax Basics</h3>\n        <ul>\n          <li><code>{{ variable_name }}</code>: Expression output (prints the evaluated value).</li>\n          <li><code>{% for item in list %} ... {% endfor %}</code>: Control structure loops.</li>\n          <li><code>{% if condition %} ... {% else %} ... {% endif %}</code>: Control structure conditionals.</li>\n          <li><code>{# comment #}</code>: Comment ignored during rendering.</li>\n        </ul>\n\n        <h3>Essential Jinja2 Filters</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># 1. Fallback default if undefined:\n{{ db_port | default(5432) }}\n\n# 2. Type conversions:\n{{ max_connections | int * 2 }}\n{{ is_enabled | bool }}\n\n# 3. JSON / YAML formatting:\n{{ my_dict | to_json }}\n{{ my_list | to_nice_yaml }}\n\n# 4. List transformations and filtering:\n{{ groups['webservers'] | map('extract', hostvars, 'ansible_host') | join(',') }}</code></pre></div>\n\n        <h3>Real-World Example: Dynamic Nginx Configuration (<code>templates/nginx.conf.j2</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">jinja2</span></div><pre><code class=\"language-jinja2\"># Autogenerated by Ansible - DO NOT EDIT MANUALLY\nevents {\n    worker_connections {{ nginx_worker_connections | default(1024) }};\n}\n\nhttp {\n    upstream app_cluster {\n        {% for server in groups['webservers'] %}\n        server {{ hostvars[server]['ansible_host'] }}:{{ app_port }};\n        {% endfor %}\n    }\n\n    server {\n        listen 80;\n        server_name {{ domain_name }};\n\n        {% if enable_ssl | default(false) %}\n        return 301 https://$host$request_uri;\n        {% else %}\n        location / {\n            proxy_pass http://app_cluster;\n            proxy_set_header Host $host;\n            proxy_set_header X-Real-IP $remote_addr;\n        }\n        {% endif %}\n    }\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Template files use the <code>.j2</code> extension and are parsed by <code>ansible.builtin.template</code>.</li>\n          <li>Use Jinja2 filters like <code>default()</code>, <code>to_json</code>, and <code>map()</code> to manipulate data cleanly.</li>\n          <li>Always add a comment header warning developers that the file is managed by Ansible.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "ansible-roles-architecture",
    "group": "roles-vault",
    "level": "Intermediate",
    "title": "Structuring with Roles & Ansible Galaxy",
    "sectionNo": "13",
    "category": "Roles & Vault",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Writing monolithic 500-line playbooks is impossible to maintain. <strong>Roles</strong> are Ansible's packaging mechanism for organizing tasks, handlers, variables, files, and templates into modular, reusable components.</p>\n\n        <h3>Standard Role Directory Structure</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">roles/nginx/\n├── defaults/\n│   └── main.yml        # Lowest priority default variables (user overridable)\n├── vars/\n│   └── main.yml        # High priority internal role constants\n├── tasks/\n│   └── main.yml        # Main list of tasks executed by this role\n├── handlers/\n│   └── main.yml        # Service restart handlers (e.g. Restart Nginx)\n├── templates/\n│   └── nginx.conf.j2   # Jinja2 template files\n├── files/\n│   └── static.html     # Static files deployed via copy module\n├── meta/\n│   └── main.yml        # Author info, license, and role dependencies\n└── README.md</code></pre></div>\n\n        <h3>Creating and Using a Role</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Scaffold standard role structure in one command\nansible-galaxy role init roles/nginx</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># In your site.yml playbook:\n---\n- name: Deploy Production Web Stack\n  hosts: webservers\n  become: true\n  roles:\n    - role: common\n    - role: security\n    - role: nginx\n      vars:\n        nginx_worker_connections: 4096\n        app_port: 3000</code></pre></div>\n\n        <h3>Ansible Galaxy: Community &amp; Enterprise Reusability</h3>\n        <p><strong>Ansible Galaxy</strong> is the public repository of community-created roles and collections (like npm for Node.js or PyPI for Python). You declare dependencies in <code>requirements.yml</code>:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># requirements.yml\nroles:\n  - name: geerlingguy.docker\n    version: 7.4.4\n  - name: geerlingguy.postgresql\n    version: 3.4.0</code></pre></div>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Install all role dependencies\nansible-galaxy install -r requirements.yml -p roles/</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Roles break complex automation into modular, testable, and reusable folders.</li>\n          <li><code>defaults/main.yml</code> holds user-overridable variables; <code>vars/main.yml</code> holds internal constants.</li>\n          <li>Use <code>requirements.yml</code> to pin and version-control external Galaxy dependencies.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "ansible-collections-fqcn",
    "group": "roles-vault",
    "level": "Intermediate",
    "title": "Ansible Collections & Modern Namespaces",
    "sectionNo": "14",
    "category": "Roles & Vault",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>In legacy Ansible (v2.9 and earlier), all modules lived inside a single monolithic Python repository. In modern Ansible (v2.10+), the ecosystem was reorganized into <strong>Ansible Collections</strong>.</p>\n\n        <h3>What is an Ansible Collection?</h3>\n        <p>A Collection is a self-contained distribution format that bundles <strong>Modules</strong>, <strong>Plugins</strong> (lookup, callback, inventory), <strong>Roles</strong>, and documentation under a vendor namespace (e.g. <code>amazon.aws</code>, <code>community.general</code>, <code>kubernetes.core</code>).</p>\n\n        <h3>Fully Qualified Collection Names (FQCN)</h3>\n        <p>Modern best practice requires referencing modules using their <strong>FQCN</strong> (<code>&lt;namespace&gt;.&lt;collection&gt;.&lt;module&gt;</code>):</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Legacy Monolithic Syntax (Deprecated):\n  apt:\n    name: nginx\n\nModern FQCN Syntax (Standard):\n  ansible.builtin.apt:\n    name: nginx\n\nCloud / Third-party Modules:\n  amazon.aws.ec2_instance:\n  community.docker.docker_container:\n  kubernetes.core.k8s:</code></pre></div>\n\n        <h3>Managing Collections in <code>requirements.yml</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># requirements.yml\ncollections:\n  - name: community.general\n    version: \">=8.0.0\"\n  - name: amazon.aws\n    version: \"7.1.0\"\n  - name: kubernetes.core\n    version: \"5.0.0\"</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Install all required collections\nansible-galaxy collection install -r requirements.yml</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Always use Fully Qualified Collection Names (FQCN) like <code>ansible.builtin.copy</code> in tasks.</li>\n          <li>Collections decouple cloud and community plugins from the core Ansible engine release cycle.</li>\n          <li>Install third-party collections via <code>ansible-galaxy collection install</code>.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "ansible-vault-secrets",
    "group": "roles-vault",
    "level": "Advanced",
    "title": "Ansible Vault: Encrypting Production Secrets",
    "sectionNo": "15",
    "category": "Roles & Vault",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Never commit plaintext passwords, private SSH keys, or database credentials to Git. <strong>Ansible Vault</strong> provides built-in AES-256 encryption, allowing you to store encrypted sensitive files or individual variables safely inside version control.</p>\n\n        <h3>1. Encrypting Entire Secret Files</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Encrypt an existing YAML file\nansible-vault encrypt group_vars/production/vault.yml\n\n# Edit the encrypted file in your default editor ($EDITOR)\nansible-vault edit group_vars/production/vault.yml\n\n# View contents without decrypting on disk\nansible-vault view group_vars/production/vault.yml\n\n# Permanently decrypt file\nansible-vault decrypt group_vars/production/vault.yml</code></pre></div>\n\n        <h3>2. Encrypting Individual Inline Variables (<code>encrypt_string</code>)</h3>\n        <p>Instead of encrypting a whole file (which makes git diffs unreadable), you can encrypt only the sensitive variable string:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\">ansible-vault encrypt_string 'SuperSecretDBPassword123!' --name 'db_password'</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># Paste the output directly into group_vars/all.yml:\ndb_user: app_user\ndb_password: !vault |\n          $ANSIBLE_VAULT;1.1;AES256\n          663836373862376662363539316335343438343735313936643936653063383838383833333333\n          6430346337373365313038336239323733363364376435660a3733383464316131376332613563</code></pre></div>\n\n        <h3>3. Running Playbooks with Vault in CI/CD</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Prompt interactively for password\nansible-playbook -i inventory.ini site.yml --ask-vault-pass\n\n# Pass password from a secure local file (e.g. injected in CI runner)\nansible-playbook -i inventory.ini site.yml --vault-password-file ~/.vault_pass.txt\n\n# Multi-Environment Vault IDs (Dev vs Staging vs Prod)\nansible-playbook -i inventory.ini site.yml   --vault-id dev@~/.vault_dev.txt   --vault-id prod@~/.vault_prod.txt</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Ansible Vault uses AES-256 encryption to secure credentials directly inside Git repositories.</li>\n          <li>Use <code>ansible-vault encrypt_string</code> to keep non-sensitive keys visible in Git diffs.</li>\n          <li>Use <code>--vault-id</code> to manage distinct decryption keys across Dev, Staging, and Production.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "error-handling-blocks",
    "group": "roles-vault",
    "level": "Advanced",
    "title": "Advanced Error Handling & Recovery",
    "sectionNo": "16",
    "category": "Roles & Vault",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>In enterprise deployments, tasks can fail due to network hiccups, locks, or transient dependency errors. Ansible provides robust exception handling through <strong>Blocks</strong> (<code>block</code>, <code>rescue</code>, <code>always</code>), retries, and failure controls.</p>\n\n        <h3>1. The <code>block</code>, <code>rescue</code>, and <code>always</code> Pattern</h3>\n        <p>Similar to <code>try-catch-finally</code> in programming languages:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Upgrade application with automated rollback on failure\n  block:\n    - name: Download new application release\n      ansible.builtin.get_url:\n        url: https://artifacts.company.com/app-v2.0.tar.gz\n        dest: /tmp/app-v2.0.tar.gz\n\n    - name: Run database migration\n      ansible.builtin.command: /opt/myapp/bin/migrate up\n\n    - name: Restart application service\n      ansible.builtin.systemd:\n        name: myapp\n        state: restarted\n\n  rescue:\n    - name: EMERGENCY ROLLBACK: Revert database migration\n      ansible.builtin.command: /opt/myapp/bin/migrate rollback\n\n    - name: Restore previous stable application binary\n      ansible.builtin.copy:\n        src: /opt/myapp.backup/bin/server\n        dest: /opt/myapp/bin/server\n        remote_src: true\n\n    - name: Send PagerDuty / Slack incident alert\n      community.general.slack:\n        token: \"{{ slack_token }}\"\n        msg: \"Deployment failed on {{ inventory_hostname }}! Rollback completed.\"\n\n  always:\n    - name: Clean up temporary deployment artifacts\n      ansible.builtin.file:\n        path: /tmp/app-v2.0.tar.gz\n        state: absent</code></pre></div>\n\n        <h3>2. Retry Loops (<code>until</code>, <code>retries</code>, <code>delay</code>)</h3>\n        <p>Handle transient network operations or waiting for a service to become healthy:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">- name: Wait for web service health check to return HTTP 200\n  ansible.builtin.uri:\n    url: http://localhost:8080/health\n    status_code: 200\n  register: result\n  until: result.status == 200\n  retries: 15       # Try up to 15 times\n  delay: 4          # Wait 4 seconds between attempts (total 60s max)</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>block</code> groups tasks; <code>rescue</code> catches failures and executes rollback logic; <code>always</code> runs cleanup.</li>\n          <li>Use <code>until</code> / <code>retries</code> / <code>delay</code> for reliable polling and health check verification.</li>\n          <li>Use <code>any_errors_fatal: true</code> if a single host failure should immediately abort the entire multi-host play.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "dynamic-cloud-inventory",
    "group": "enterprise",
    "level": "Advanced",
    "title": "Dynamic Cloud Inventories (AWS, GCP, Azure)",
    "sectionNo": "17",
    "category": "Enterprise",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>In modern cloud environments, VMs autoscaling up and down have ephemeral IP addresses. Maintaining static <code>inventory.ini</code> files is impossible. <strong>Dynamic Inventory Plugins</strong> query cloud provider APIs at runtime to build real-time inventory graphs automatically.</p>\n\n        <h3>AWS EC2 Dynamic Inventory (<code>aws_ec2.yml</code>)</h3>\n        <p>Create a dynamic inventory configuration ending in <code>aws_ec2.yml</code> or <code>aws_ec2.yaml</code>:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># aws_ec2.yml\nplugin: amazon.aws.aws_ec2\nregions:\n  - us-east-1\n  - us-west-2\n\n# Only fetch running EC2 instances\nfilters:\n  instance-state-name: running\n\n# Group instances automatically based on EC2 Tags and VPC\nkeyed_groups:\n  # Creates groups like: tag_Environment_production, tag_Environment_staging\n  - key: tags['Environment']\n    prefix: env\n  # Creates groups like: tag_Role_web, tag_Role_database\n  - key: tags['Role']\n    prefix: role\n  # Group by AWS Region (e.g. region_us_east_1)\n  - key: placement.region\n    prefix: region\n\n# Set the IP Ansible connects to (prefer private IP inside VPC)\nhostnames:\n  - private-ip-address\n  - dns-name\n\ncompose:\n  ansible_host: private_ip_address\n  ansible_user: ubuntu</code></pre></div>\n\n        <h3>Inspecting and Using Dynamic Inventory</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Graph all discovered cloud hosts and automatic tagged groups\nansible-inventory -i aws_ec2.yml --graph\n\n# Run playbook targeting only production webservers in AWS\nansible-playbook -i aws_ec2.yml site.yml --limit \"env_production:&role_web\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Dynamic inventory plugins query AWS/GCP/Azure/Kubernetes APIs at playbook execution time.</li>\n          <li>Use <code>keyed_groups</code> to automatically group instances by tags (<code>env_prod</code>, <code>role_web</code>).</li>\n          <li>Never hardcode cloud IP addresses in static inventory files.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "testing-molecule-lint",
    "group": "enterprise",
    "level": "Advanced",
    "title": "Testing & Quality: Ansible-Lint & Molecule",
    "sectionNo": "18",
    "category": "Enterprise",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Treating Infrastructure as Code (IaC) requires the same rigorous testing standards as application code: static analysis, linting, and automated integration testing. <strong>Ansible-Lint</strong> and <strong>Molecule</strong> provide enterprise-grade testing workflows.</p>\n\n        <h3>1. Static Analysis with <code>ansible-lint</code></h3>\n        <p><code>ansible-lint</code> scans playbooks and roles for syntax violations, deprecated module usage, missing FQCNs, security flaws, and anti-patterns:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Run linter on all playbooks and roles\nansible-lint site.yml roles/</code></pre></div>\n\n        <h3>2. Test-Driven Development with Molecule</h3>\n        <p><strong>Molecule</strong> automates testing roles in isolated, ephemeral test containers (Docker, Podman, or Vagrant VMs). It runs a full test matrix:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">Molecule Test Matrix Lifecycle:\n  1. dependency  ──► Install Galaxy dependencies\n  2. lint        ──► Run ansible-lint and yamllint\n  3. create      ──► Spin up ephemeral test Docker container\n  4. converge    ──► Run your role against the container\n  5. idempotence ──► Re-run role! Verify ZERO changes (0 changed tasks)\n  6. verify      ──► Run Testinfra / Ansible test assertions\n  7. destroy     ──► Teardown and delete test container</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Initialize molecule scenario in a role\ncd roles/nginx\nmolecule init scenario\n\n# Execute full automated test sequence\nmolecule test</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Integrate <code>ansible-lint</code> into pre-commit hooks and pull request CI gates.</li>\n          <li>Molecule tests role idempotency by executing twice and failing if the second run produces any <code>changed</code> tasks.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "awx-automation-controller",
    "group": "enterprise",
    "level": "Intermediate",
    "title": "Enterprise Orchestration: AWX & Tower",
    "sectionNo": "19",
    "category": "Enterprise",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Running Ansible CLI commands from individual developer laptops does not scale in large enterprises. <strong>AWX</strong> (and its commercial Red Hat product, <strong>Ansible Automation Controller / Tower</strong>) provides a web UI, REST API, RBAC, and centralized orchestration engine.</p>\n\n        <h3>Key Enterprise Problems AWX Solves</h3>\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>1. Secure Credential Vault</h4>\n            <p>SSH keys, cloud tokens, and Vault passwords are stored securely in AWX. Developers can launch deployments without ever seeing or possessing the root SSH private keys.</p>\n          </div>\n          <div class=\"card\">\n            <h4>2. Role-Based Access Control (RBAC)</h4>\n            <p>Integrates with LDAP, Active Directory, and SAML/SSO. Assign granular permissions: Team A can only run playbooks against Staging; Team B can run Production.</p>\n          </div>\n          <div class=\"card\">\n            <h4>3. Visual Workflow Templates</h4>\n            <p>Chain multiple playbooks together visually with conditional logic: <em>\"If Provisioning succeeds ──► Deploy App; If fails ──► Send Slack Alert\"</em>.</p>\n          </div>\n          <div class=\"card\">\n            <h4>4. Surveys &amp; Webhooks</h4>\n            <p>Turn playbooks into self-service forms for non-technical users (e.g. dropdown to select branch and environment). Trigger deployments automatically via GitHub/GitLab webhooks.</p>\n          </div>\n        </div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>AWX provides centralized scheduling, RBAC, credential isolation, and audit logging.</li>\n          <li>Job Templates combine an Inventory, Playbook, Project, and Credential into an executable button or API endpoint.</li>\n          <li>Visual Workflow DAGs orchestrate complex multi-team deployment pipelines.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "ansible-cicd-gitops",
    "group": "enterprise",
    "level": "Advanced",
    "title": "Ansible in Modern CI/CD & GitOps Pipelines",
    "sectionNo": "20",
    "category": "Enterprise",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>How does Ansible fit into modern DevOps workflows alongside <strong>Terraform</strong>, <strong>Docker</strong>, <strong>Kubernetes</strong>, and <strong>GitHub Actions</strong>?</p>\n\n        <h3>The Division of Labor: Terraform vs Ansible</h3>\n        <ul>\n          <li><strong>Terraform (Infrastructure Provisioning):</strong> Creates the raw resources (VPCs, Subnets, Security Groups, EC2 instances, RDS databases, EKS clusters).</li>\n          <li><strong>Ansible (Configuration &amp; Orchestration):</strong> Configures the software <em>inside</em> those OS instances (installs packages, tunes kernels, configures Nginx, deploys systemd services).</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">Modern Enterprise CI/CD Pipeline:\n  [Git Repository] ──(Push)──► [GitHub Actions / GitLab CI]\n                                        │\n                    ┌───────────────────┴───────────────────┐\n                    ▼                                       ▼\n           [Step 1: Terraform]                     [Step 2: Ansible]\n     Provisions Cloud VMs, VPC,              Configures OS, Users, Security,\n     and outputs IP addresses                Installs Apps & Starts Services</code></pre></div>\n\n        <h3>GitHub Actions Workflow Example</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\"># .github/workflows/deploy.yml\nname: Deploy Production Infrastructure\non:\n  push:\n    branches: [main]\n\njobs:\n  ansible-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout Code\n        uses: actions/checkout@v4\n\n      - name: Set up Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: '3.11'\n\n      - name: Install Ansible & Dependencies\n        run: |\n          pip install ansible-core ansible-lint\n          ansible-galaxy collection install amazon.aws\n\n      - name: Run Ansible Lint\n        run: ansible-lint site.yml\n\n      - name: Execute Playbook\n        env:\n          ANSIBLE_VAULT_PASSWORD: ${{ secrets.VAULT_PASSWORD }}\n          SSH_PRIVATE_KEY: ${{ secrets.PROD_SSH_KEY }}\n        run: |\n          echo \"$SSH_PRIVATE_KEY\" > /tmp/ssh_key && chmod 600 /tmp/ssh_key\n          echo \"$ANSIBLE_VAULT_PASSWORD\" > /tmp/vault_pass\n          ansible-playbook -i aws_ec2.yml site.yml             --private-key /tmp/ssh_key             --vault-password-file /tmp/vault_pass</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use Terraform to provision infrastructure; use Ansible to configure and orchestrate operating systems.</li>\n          <li>Store Vault passwords securely in CI secrets (GitHub Secrets / HashiCorp Vault).</li>\n          <li>Combine automated linting and syntax checks in CI before deploying playbooks to production.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "ansible-troubleshoot-wizard",
    "group": "interview",
    "level": "Advanced",
    "title": "Interactive Ansible Emergency & Diagnostic Wizard",
    "sectionNo": "21",
    "category": "Interview",
    "body": [
      {
        "t": "p",
        "c": "Hit an unexpected Ansible failure? Unreachable SSH hosts, sudo permission errors, undefined variables, or failing handlers? Use our interactive diagnostic decision wizard to find the exact resolution commands."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "ansible-quiz",
    "group": "interview",
    "level": "Intermediate",
    "title": "Ansible Comprehensive Knowledge Quiz",
    "sectionNo": "22",
    "category": "Interview",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "Why is Ansible referred to as an 'agentless' automation tool?",
            "options": [
              "Because it only works inside Docker containers",
              "Because it connects over standard SSH/WinRM and requires no daemon on managed nodes",
              "Because it does not support multi-threading",
              "Because it cannot execute Python scripts"
            ],
            "correct": 1,
            "explain": "Ansible is agentless because it executes tasks over standard OpenSSH (Linux) or WinRM (Windows) by sending temporary Python payloads, eliminating background agent daemons."
          },
          {
            "q": "What does Ansible's principle of 'Idempotency' guarantee?",
            "options": [
              "That playbooks will run faster on every subsequent execution",
              "That executing a playbook repeatedly brings the system to the desired state without unwanted side-effects",
              "That playbooks cannot be stopped once started",
              "That tasks are always executed in parallel"
            ],
            "correct": 1,
            "explain": "Idempotency ensures that running a task multiple times produces the exact same end state as running it once, reporting 'ok' if the target state is already satisfied."
          },
          {
            "q": "Which variable scope has the ABSOLUTE HIGHEST precedence in Ansible?",
            "options": [
              "Role defaults (defaults/main.yml)",
              "Playbook vars",
              "Inventory group_vars",
              "Extra vars passed on the command line (-e / --extra-vars)"
            ],
            "correct": 3,
            "explain": "Extra vars passed on the command line with -e or --extra-vars have the highest precedence in Ansible's 22-level hierarchy and override all other scopes."
          },
          {
            "q": "When do Handlers execute during a playbook run?",
            "options": [
              "Immediately whenever a notifying task is encountered",
              "Only once at the very end of the play, provided the notifying task reported 'changed: true'",
              "Before any tasks in the play start",
              "Continuously in the background"
            ],
            "correct": 1,
            "explain": "Handlers run at the end of the play, executing only once even if notified by multiple tasks, and only if at least one notifying task changed state."
          },
          {
            "q": "What is the purpose of the 'ansible.builtin.meta: flush_handlers' directive?",
            "options": [
              "To delete all handlers permanently",
              "To force all currently pending notified handlers to run immediately mid-playbook",
              "To restart the control node",
              "To clear the Ansible fact cache"
            ],
            "correct": 1,
            "explain": "meta: flush_handlers triggers all pending handlers immediately at that exact position in the task list rather than waiting for the end of the play."
          }
        ]
      }
    ]
  },
  {
    "id": "ansible-cheatsheet",
    "group": "interview",
    "level": "Basics",
    "title": "Ansible Command, Module & Precedence Reference Sheet",
    "sectionNo": "23",
    "category": "Interview",
    "body": [
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "ansible all -m ping",
            "def": "Tests SSH connectivity and remote Python execution across all inventory hosts."
          },
          {
            "term": "ansible-playbook -i inv.ini site.yml --check --diff",
            "def": "Performs a safe dry-run showing side-by-side line diffs without modifying targets."
          },
          {
            "term": "ansible-playbook site.yml --limit web1",
            "def": "Restricts execution of a multi-host playbook to only a single target host."
          },
          {
            "term": "ansible-vault encrypt_string",
            "def": "Encrypts an individual sensitive string variable using AES-256 for safe Git storage."
          },
          {
            "term": "ansible.builtin.lineinfile",
            "def": "Ensures a particular line is in a file or replaces an existing line using regex."
          },
          {
            "term": "ansible.builtin.template",
            "def": "Renders a Jinja2 (.j2) template from the control node onto the managed host."
          },
          {
            "term": "ansible.builtin.systemd",
            "def": "Manages systemd service states (started, stopped, restarted, reloaded) and boot enablement."
          },
          {
            "term": "ansible-galaxy role init <name>",
            "def": "Scaffolds a standard modular role directory structure (tasks, handlers, vars, defaults, templates)."
          },
          {
            "term": "meta: flush_handlers",
            "def": "Forces all pending notified handlers to execute immediately mid-play."
          },
          {
            "term": "forks = 50",
            "def": "ansible.cfg setting to increase parallel host concurrency from default 5 to 50."
          }
        ]
      }
    ]
  },
  {
    "id": "ansible-interview-qa",
    "group": "interview",
    "level": "Advanced",
    "title": "Senior & Staff DevOps Ansible Interview Bank",
    "sectionNo": "24",
    "category": "Interview",
    "body": [
      {
        "t": "troubleshoot",
        "items": [
          {
            "scenario": "Senior Interview: 'How do you optimize Ansible execution speed across a fleet of 2,000 servers?'",
            "diagnosis": "Default Ansible settings use 5 forks, enable synchronous fact gathering on every play, and lack SSH connection reuse.",
            "fix": "1. Increase concurrency forks in ansible.cfg: `forks = 50` or `100`.\n2. Enable SSH Pipelining (`pipelining = True`) in ansible.cfg to execute Python modules without copying files to disk.\n3. Enable Redis/JSON Fact Caching and set `gather_facts: false` on plays that don't need facts.\n4. Use `strategy: free` to allow fast nodes to proceed without waiting for slow nodes."
          },
          {
            "scenario": "Production Disaster: 'A critical playbook task failed halfway through modifying 100 servers. How do you recover?'",
            "diagnosis": "By default, Ansible stops execution on failed hosts. Without error handling, partial updates leave systems in an inconsistent state.",
            "fix": "1. Re-run only on failed hosts using the retry file: `ansible-playbook site.yml --limit @site.retry`.\n2. Wrap dangerous multi-step operations in `block` / `rescue` structures with automated rollback tasks.\n3. Ensure all tasks are strictly idempotent so re-running the full playbook is safe."
          },
          {
            "scenario": "Staff DevOps: 'How do you structure an enterprise repository containing 50+ roles across Dev, Staging, and Production?'",
            "diagnosis": "Monolithic playbooks and shared variable files cause configuration drift and accidental cross-environment pollution.",
            "fix": "1. Separate inventories per environment (`inventories/staging/`, `inventories/production/`).\n2. Use modular Roles stored in `roles/` with explicit `defaults/main.yml` for defaults and `group_vars/` for environment overrides.\n3. Encrypt environment secrets with separate Ansible Vault IDs (`--vault-id staging@...`, `--vault-id prod@...`).\n4. Automate linting and Molecule testing in CI before merging PRs."
          }
        ]
      }
    ]
  }
]
