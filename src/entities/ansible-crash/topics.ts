import type { Topic, TopicGroup } from '@/entities/topic'

export const ANSIBLE_CRASH_GROUPS: TopicGroup[] = [
  {
    "id": "part-1",
    "name": "Part 1: Architecture & Mental Models"
  },
  {
    "id": "part-2",
    "name": "Part 2: Ad-Hoc & Playbook Anatomy"
  },
  {
    "id": "part-3",
    "name": "Part 3: Variables, Templates & Roles"
  },
  {
    "id": "part-4",
    "name": "Part 4: Secrets, Drills & Cheatsheet"
  }
]

export const ANSIBLE_CRASH_TOPICS: Topic[] = [
  {
    "id": "ans-arch",
    "title": "1. Ansible Architecture & The Push Model",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "01",
    "category": "Architecture",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"callout callout-info\"><div class=\"callout-title\">The Agentless Advantage</div><p>Ansible does not require any agent daemon running on target servers. From your control machine, it connects over standard <strong>OpenSSH</strong>, packages small Python scripts for each task, executes them on the remote node, and removes them when done.</p></div>"
      }
    ]
  },
  {
    "id": "ans-inventory",
    "title": "2. Inventory: Defining Your Server Fleet",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "02",
    "category": "Inventory",
    "body": [
      {
        "t": "code",
        "lang": "ini",
        "c": "[webservers]\nweb1.example.com ansible_host=192.168.1.10\nweb2.example.com ansible_host=192.168.1.11\n\n[dbservers]\ndb1.example.com ansible_host=192.168.1.20\n\n[production:children]\nwebservers\ndbservers\n\n[production:vars]\nansible_user=ubuntu\nansible_ssh_private_key_file=~/.ssh/prod_key.pem"
      }
    ]
  },
  {
    "id": "ans-adhoc",
    "title": "3. Ad-Hoc Commands for Quick Operations",
    "group": "part-2",
    "level": "Basics",
    "sectionNo": "03",
    "category": "Ad-Hoc",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Ping all webservers to verify SSH connectivity\nansible webservers -i hosts.ini -m ping\n\n# Check disk space on all production nodes\nansible production -i hosts.ini -m command -a \"df -h /\"\n\n# Restart NGINX across all webservers with sudo\nansible webservers -i hosts.ini -b -m systemd -a \"name=nginx state=restarted\""
      }
    ]
  },
  {
    "id": "ans-playbook",
    "title": "4. Anatomy of an Ansible Playbook",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "04",
    "category": "Playbooks",
    "body": [
      {
        "t": "code",
        "lang": "yaml",
        "c": "---\n- name: Configure Webservers\n  hosts: webservers\n  become: true\n  \n  tasks:\n    - name: Ensure NGINX is installed\n      ansible.builtin.apt:\n        name: nginx\n        state: present\n        update_cache: yes\n\n    - name: Ensure NGINX service is started and enabled on boot\n      ansible.builtin.systemd:\n        name: nginx\n        state: started\n        enabled: yes"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Run syntax check\nansible-playbook -i hosts.ini site.yml --syntax-check\n\n# Dry-run (Check mode — shows what would change without modifying anything)\nansible-playbook -i hosts.ini site.yml --check\n\n# Execute for real\nansible-playbook -i hosts.ini site.yml"
      }
    ]
  },
  {
    "id": "ans-core-modules",
    "title": "5. The Essential Core Modules",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "05",
    "category": "Core Modules",
    "body": [
      {
        "t": "code",
        "lang": "yaml",
        "c": "- name: Manage Linux User\n  ansible.builtin.user:\n    name: deployer\n    groups: sudo\n    append: yes\n    shell: /bin/bash\n\n- name: Create directory with strict permissions\n  ansible.builtin.file:\n    path: /var/www/app\n    state: directory\n    owner: deployer\n    group: deployer\n    mode: '0755'\n\n- name: Copy static configuration file\n  ansible.builtin.copy:\n    src: files/nginx.conf\n    dest: /etc/nginx/nginx.conf\n    owner: root\n    group: root\n    mode: '0644'"
      }
    ]
  },
  {
    "id": "ans-vars-facts",
    "title": "6. Variables, System Facts & Conditionals",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "06",
    "category": "Variables",
    "body": [
      {
        "t": "code",
        "lang": "yaml",
        "c": "- name: Install multiple utility packages\n  ansible.builtin.apt:\n    name: \"{{ item }}\"\n    state: present\n  loop:\n    - curl\n    - git\n    - htop\n    - jq\n\n- name: Install Apache only on RedHat/CentOS nodes\n  ansible.builtin.yum:\n    name: httpd\n    state: present\n  when: ansible_facts['os_family'] == \"RedHat\""
      }
    ]
  },
  {
    "id": "ans-jinja2",
    "title": "7. Dynamic Templates with Jinja2",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "07",
    "category": "Templating",
    "body": [
      {
        "t": "code",
        "lang": "jinja2",
        "c": "server {\n    listen {{ http_port | default(80) }};\n    server_name {{ server_domain }};\n    root /var/www/{{ app_name }};\n\n    worker_processes {{ ansible_facts['processor_vcpus'] }};\n}"
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "- name: Render dynamic NGINX site config\n  ansible.builtin.template:\n    src: templates/app.conf.j2\n    dest: /etc/nginx/sites-available/app.conf\n    owner: root\n    group: root\n    mode: '0644'"
      }
    ]
  },
  {
    "id": "ans-handlers",
    "title": "8. Handlers: Efficient Event-Driven Actions",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "08",
    "category": "Handlers",
    "body": [
      {
        "t": "code",
        "lang": "yaml",
        "c": "tasks:\n  - name: Update NGINX configuration\n    ansible.builtin.template:\n      src: templates/nginx.conf.j2\n      dest: /etc/nginx/nginx.conf\n    notify: Restart NGINX service\n\nhandlers:\n  - name: Restart NGINX service\n    ansible.builtin.systemd:\n      name: nginx\n      state: restarted"
      }
    ]
  },
  {
    "id": "ans-roles",
    "title": "9. Organizing with Ansible Roles",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "09",
    "category": "Architecture",
    "body": [
      {
        "t": "code",
        "lang": "text",
        "c": "roles/nginx/\n├── defaults/\n│   └── main.yml      # Default overridable variables\n├── tasks/\n│   └── main.yml      # List of tasks to execute\n├── handlers/\n│   └── main.yml      # Service restart handlers\n├── templates/\n│   └── nginx.conf.j2 # Jinja2 templates\n└── vars/\n    └── main.yml      # Role-specific constant vars"
      }
    ]
  },
  {
    "id": "ans-vault",
    "title": "10. Secrets with Ansible Vault & Triage Wizard",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "10",
    "category": "Security",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Encrypt an existing secrets file\nansible-vault encrypt vars/secrets.yml\n\n# Edit an encrypted file in your editor\nansible-vault edit vars/secrets.yml\n\n# Run playbook with vault password prompt\nansible-playbook -i hosts.ini site.yml --ask-vault-pass"
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "ans-quiz-cheat",
    "title": "11. Knowledge Check & Essential Ansible Cheat Sheet",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "11",
    "category": "Reference",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "When multiple tasks in a single play notify the same Handler, how many times does the Handler execute?",
            "options": [
              "It executes immediately after each notifying task.",
              "It executes once at the very end of the play.",
              "It executes twice.",
              "It fails with a duplicate handler error."
            ],
            "correct": 1,
            "explain": "Ansible handlers run only ONCE at the end of the entire play, regardless of how many tasks notified them. This prevents restarting services multiple times during a rollout."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "ansible all -i hosts.ini -m ping",
            "def": "Test connectivity to all inventory hosts"
          },
          {
            "term": "ansible all -i hosts.ini -m setup",
            "def": "Gather and display all system facts"
          },
          {
            "term": "ansible web -i hosts.ini -b -a \"reboot\"",
            "def": "Execute command as root on web group"
          },
          {
            "term": "ansible-playbook -i hosts.ini site.yml --check",
            "def": "Dry run check mode"
          },
          {
            "term": "ansible-playbook -i hosts.ini site.yml --limit web1",
            "def": "Run playbook only on a specific host"
          },
          {
            "term": "ansible-playbook -i hosts.ini site.yml --step",
            "def": "Interactively prompt before executing each task"
          },
          {
            "term": "ansible-galaxy init roles/my_role",
            "def": "Scaffold new standard role folder structure"
          }
        ]
      }
    ]
  }
]
