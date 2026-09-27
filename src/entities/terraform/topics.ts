import type { Topic, TopicGroup } from '@/entities/topic'

export const TERRAFORM_GROUPS: TopicGroup[] = [
  {
    "id": "foundations",
    "name": "Foundations & Core Workflow"
  },
  {
    "id": "variables-logic",
    "name": "Variables, Data & Dependencies"
  },
  {
    "id": "state-modules",
    "name": "State Management & Modules"
  },
  {
    "id": "drills",
    "name": "Drills & Quick Reference"
  }
]

export const TERRAFORM_TOPICS: Topic[] = [
  {
    "id": "what-is-iac-terraform",
    "group": "foundations",
    "level": "Basics",
    "title": "What is Infrastructure as Code & Why Terraform?",
    "sectionNo": "01",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Imagine you need to spin up an application environment in AWS: a Virtual Private Cloud (VPC), 2 subnets, a security firewall, an EC2 virtual machine, an RDS database, and an S3 bucket for storage.</p>\n        \n        <h3>The Old Way: ClickOps</h3>\n        <p>In the past, engineers opened the AWS/Azure web console and manually clicked through dozens of wizards (commonly nicknamed <strong>\"ClickOps\"</strong>). ClickOps creates major problems:</p>\n        <ul>\n          <li><strong>Slow &amp; Unrepeatable:</strong> Recreating the exact same setup for Staging or Production takes hours and invites human errors.</li>\n          <li><strong>Zero Audit Trail:</strong> Who changed that firewall rule at 3 AM? Why was that port opened? Console clicks leave no Git history.</li>\n          <li><strong>Configuration Drift:</strong> Over time, Dev, Staging, and Production drift apart until bugs only reproduce in production.</li>\n        </ul>\n\n        <h3>The Modern Way: Infrastructure as Code (IaC)</h3>\n        <p><strong>Infrastructure as Code (IaC)</strong> means writing plain text configuration files (committed to Git) that define exactly what servers, networks, and cloud services should exist. Your infrastructure becomes versioned, peer-reviewed in pull requests, and reproducible in seconds.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Manual ClickOps:\n  [Engineer] ──► (Clicks buttons in AWS Console) ──► Hard to replicate, zero Git audit trail\n\nInfrastructure as Code (Terraform):\n  [Code in Git: main.tf] ──► [Terraform Engine] ──► (Calls Cloud APIs) ──► 100% Identical & Repeatable</code></pre></div>\n\n        <h3>Why Terraform? Declarative &amp; Cloud-Agnostic</h3>\n        <ul>\n          <li><strong>Declarative:</strong> You write <em>what</em> the end state should look like (e.g. <code>instance_type = \"t3.micro\"</code>). Terraform figures out <em>how</em> to create or update it.</li>\n          <li><strong>Provider Ecosystem:</strong> One consistent syntax (HCL) works across AWS, Azure, Google Cloud, Cloudflare, GitHub, Kubernetes, and Datadog.</li>\n        </ul>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>IaC replaces error-prone console clicking with version-controlled, automated code.</li>\n          <li>Terraform is declarative: you describe the target state, and Terraform creates or modifies resources to match.</li>\n          <li>Works across all major clouds using a unified syntax (HashiCorp Configuration Language — HCL).</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "core-workflow-init-apply",
    "group": "foundations",
    "level": "Basics",
    "title": "The Core Workflow: Init, Plan, Apply & Destroy",
    "sectionNo": "02",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Every single Terraform project follows the same fundamental <strong>4-step lifecycle workflow</strong>:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐\n│ 1. terraform    │ ────► │ 2. terraform    │ ────► │ 3. terraform    │ ────► │ 4. terraform    │\n│    init         │       │    plan         │       │    apply        │       │    destroy      │\n│ (Downloads      │       │ (Pre-calculates │       │ (Calls APIs to  │       │ (Deletes all    │\n│  plugins/state) │       │  exact diffs)   │       │  make changes)  │       │  managed infra) │\n└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘</code></pre></div>\n\n        <h3>1. <code>terraform init</code></h3>\n        <p>The first command you run in any directory containing <code>.tf</code> files. It scans your code, downloads the required cloud provider plugins (like the AWS provider plugin binary) into a local <code>.terraform/</code> folder, and initializes your state backend.</p>\n\n        <h3>2. <code>terraform plan</code></h3>\n        <p>Reads your local code, queries your cloud provider to see what already exists, and prints an <strong>Execution Plan</strong>. It shows you exactly what actions it will take <em>before</em> touching real cloud resources:</p>\n        <ul>\n          <li><strong style=\"color: var(--teal);\">+ create:</strong> Resource will be created fresh.</li>\n          <li><strong style=\"color: var(--amber);\">~ update in-place:</strong> Resource exists and specific attributes will be modified without destroying it.</li>\n          <li><strong style=\"color: var(--red);\">- destroy:</strong> Resource exists in cloud but was removed from code; will be deleted.</li>\n          <li><strong style=\"color: var(--red);\">+/- replace:</strong> Certain cloud attributes cannot be changed in-place, so the old resource is destroyed and recreated.</li>\n        </ul>\n\n        <h3>3. <code>terraform apply</code></h3>\n        <p>Prompts for human confirmation (<code>yes</code>), and then executes the API calls to build the infrastructure. It updates the state file (<code>terraform.tfstate</code>) immediately upon completion.</p>\n\n        <h3>4. <code>terraform destroy</code></h3>\n        <p>Safely tears down and deletes all resources managed in the current workspace. Ideal for cleaning up temporary test/sandbox environments to avoid cloud bills.</p>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Always run <code>terraform init</code> when cloning a repo or adding new providers.</li>\n          <li>Never skip <code>terraform plan</code>: always review the diff preview before applying.</li>\n          <li>Use <code>terraform destroy</code> to tear down ephemeral test environments cleanly.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "hcl-syntax-first-resource",
    "group": "foundations",
    "level": "Basics",
    "title": "HCL Syntax Essentials & Writing Your First Resource",
    "sectionNo": "03",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Terraform uses <strong>HashiCorp Configuration Language (HCL)</strong>. Files use the <code>.tf</code> extension and are designed to be human-readable and structured.</p>\n\n        <h3>Anatomy of a Resource Block</h3>\n        <p>Every piece of cloud infrastructure is declared using a <code>resource</code> block:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># Format:\n# resource \"&lt;RESOURCE_TYPE&gt;\" \"&lt;LOCAL_RESOURCE_NAME&gt;\" {\n#   attribute1 = value1\n#   attribute2 = value2\n# }\n\nresource \"aws_s3_bucket\" \"app_media\" {\n  bucket = \"mycompany-app-assets-2026-unique\"\n\n  tags = {\n    Environment = \"production\"\n    ManagedBy   = \"Terraform\"\n  }\n}</code></pre></div>\n\n        <h3>Key Rules of HCL</h3>\n        <ul>\n          <li><strong>Resource Type (<code>aws_s3_bucket</code>):</strong> Defined by the cloud provider. Tells Terraform what type of cloud asset to create.</li>\n          <li><strong>Local Name (<code>app_media</code>):</strong> An internal identifier used only within your Terraform code to reference this resource. It does not appear in the AWS console.</li>\n          <li><strong>Resource Addressing:</strong> Other resources can reference this bucket using <code>aws_s3_bucket.app_media.id</code> or <code>aws_s3_bucket.app_media.arn</code>.</li>\n        </ul>\n\n        <h3>Formatting &amp; Validating Code</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Auto-formats all .tf files to canonical HCL style (indentation, alignment)\nterraform fmt\n\n# Checks for syntax and type errors without calling cloud APIs\nterraform validate</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Resource syntax: <code>resource \"&lt;type&gt;\" \"&lt;name&gt;\" { ... }</code>.</li>\n          <li>Local names are used for internal referencing (e.g. <code>aws_s3_bucket.app_media.arn</code>).</li>\n          <li>Run <code>terraform fmt</code> and <code>terraform validate</code> before every commit.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "providers-and-versions",
    "group": "foundations",
    "level": "Basics",
    "title": "Providers, Version Pinning & Authentication",
    "sectionNo": "04",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Terraform itself is just a core engine. It doesn't know how to talk to AWS, Azure, or Kubernetes natively. Instead, it relies on <strong>Providers</strong> &mdash; plugins that translate HCL into cloud API calls.</p>\n\n        <h3>Declaring Providers: <code>terraform.required_providers</code></h3>\n        <p>In your root <code>main.tf</code> or <code>versions.tf</code>, declare the providers and pin their versions:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">terraform {\n  required_version = \">= 1.5.0\"\n\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"  # Allows 5.1, 5.2, but blocks breaking 6.0!\n    }\n  }\n}\n\n# Configure the AWS Provider settings\nprovider \"aws\" {\n  region = \"us-east-1\"\n}</code></pre></div>\n\n        <h3>Provider Authentication Best Practices</h3>\n        <div class=\"callout danger\"><p><strong>Security Rule:</strong> NEVER hardcode <code>access_key</code> and <code>secret_key</code> inside your <code>.tf</code> files! They will inevitably get committed to Git and compromised.</p></div>\n\n        <p>Instead, let the provider read standard environment variables or CLI configurations:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># AWS Provider automatically picks up these standard environment variables:\nexport AWS_ACCESS_KEY_ID=\"AKIA...\"\nexport AWS_SECRET_ACCESS_KEY=\"wJalr...\"\nexport AWS_REGION=\"us-east-1\"\n\n# Or use named profiles from ~/.aws/credentials:\nexport AWS_PROFILE=\"production\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Providers are plugins that translate Terraform code into cloud API requests.</li>\n          <li>Always pin provider versions with <code>~&gt;</code> to prevent unexpected breaking updates.</li>\n          <li>Never hardcode credentials in code &mdash; use environment variables or IAM roles.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "variables-locals-outputs",
    "group": "variables-logic",
    "level": "Intermediate",
    "title": "Variables, Locals & Outputs: Writing Configurable Code",
    "sectionNo": "05",
    "category": "Variables & Logic",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Hardcoding values like server names, instance sizes, or bucket names directly inside resources makes your code inflexible. Terraform provides three tools for managing data: <strong>Input Variables</strong>, <strong>Local Values</strong>, and <strong>Outputs</strong>.</p>\n\n        <h3>1. Input Variables (<code>variables.tf</code>)</h3>\n        <p>Input variables are like function arguments &mdash; they allow you to customize configurations without editing resource code:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">variable \"instance_type\" {\n  type        = string\n  description = \"EC2 instance size\"\n  default     = \"t3.micro\"\n}\n\nvariable \"allowed_ports\" {\n  type        = list(number)\n  description = \"List of ingress firewall ports\"\n  default     = [80, 443]\n}</code></pre></div>\n\n        <p>Assign variable values using a <code>terraform.tfvars</code> file (automatically loaded):</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># terraform.tfvars\ninstance_type = \"t3.small\"\nallowed_ports = [80, 443, 8080]</code></pre></div>\n\n        <h3>2. Local Values (<code>locals.tf</code>)</h3>\n        <p>Locals are internal constants or calculated expressions used within a configuration to avoid repeating yourself (DRY principle):</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">locals {\n  environment = \"production\"\n  owner       = \"finance-team\"\n  name_prefix = \"${local.owner}-${local.environment}\"\n\n  common_tags = {\n    Environment = local.environment\n    Owner       = local.owner\n    ManagedBy   = \"Terraform\"\n  }\n}</code></pre></div>\n\n        <h3>3. Output Values (<code>outputs.tf</code>)</h3>\n        <p>Outputs return values after <code>apply</code> finishes (like function return values), such as public IP addresses or database connection strings:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">output \"server_public_ip\" {\n  description = \"Public IP address of the newly created web server\"\n  value       = aws_instance.web.public_ip\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>variable</code> for customizable inputs (configured in <code>terraform.tfvars</code>).</li>\n          <li>Use <code>locals</code> for internal calculated values and standard tags.</li>\n          <li>Use <code>output</code> to print critical endpoints and pass data between modules.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "dependencies-data-sources",
    "group": "variables-logic",
    "level": "Intermediate",
    "title": "Dependencies & Data Sources: Querying Existing Infra",
    "sectionNo": "06",
    "category": "Variables & Logic",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>How does Terraform know in what order to create resources? And how do you reference resources that already exist in your cloud account?</p>\n\n        <h3>Implicit vs. Explicit Dependencies</h3>\n        <p>Terraform builds an internal dependency graph (DAG) automatically:</p>\n        <ul>\n          <li><strong>Implicit Dependencies (Standard):</strong> When Resource B references an attribute of Resource A, Terraform automatically knows to build Resource A first!</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># 1. Create a security group\nresource \"aws_security_group\" \"web_sg\" {\n  name = \"web-firewall\"\n}\n\n# 2. Reference security group ID inside the instance\nresource \"aws_instance\" \"web\" {\n  ami                    = \"ami-0c55b159cbfafe1f0\"\n  instance_type          = \"t3.micro\"\n  # Implicit dependency: Terraform creates the security group BEFORE the instance!\n  vpc_security_group_ids = [aws_security_group.web_sg.id]\n}</code></pre></div>\n\n        <ul>\n          <li><strong>Explicit Dependencies (<code>depends_on</code>):</strong> Used only when a hidden dependency exists (e.g. an IAM permission must propagate before an S3 upload can succeed):</li>\n        </ul>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">resource \"aws_s3_object\" \"app_config\" {\n  bucket     = \"my-bucket\"\n  key        = \"config.json\"\n  source     = \"./config.json\"\n  depends_on = [aws_iam_role_policy.s3_write_permission]\n}</code></pre></div>\n\n        <h3>Data Sources (<code>data</code> Blocks)</h3>\n        <p>A <strong>Data Source</strong> is a read-only query that fetches existing cloud resources created outside of your current Terraform code (e.g. finding the default VPC or latest Amazon Linux AMI):</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># Query the latest official Ubuntu 22.04 AMI ID dynamically\ndata \"aws_ami\" \"ubuntu\" {\n  most_recent = true\n  owners      = [\"099720109477\"] # Canonical\n\n  filter {\n    name   = \"name\"\n    values = [\"ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*\"]\n  }\n}\n\n# Use the queried AMI ID in your resource\nresource \"aws_instance\" \"web\" {\n  ami           = data.aws_ami.ubuntu.id\n  instance_type = \"t3.micro\"\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Terraform automatically infers creation order through attribute references (implicit dependencies).</li>\n          <li>Use <code>depends_on</code> only when dependencies cannot be inferred automatically.</li>\n          <li>Use <code>data</code> blocks to query existing cloud resources dynamically without hardcoding IDs.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "meta-arguments-count-foreach",
    "group": "variables-logic",
    "level": "Intermediate",
    "title": "Meta-Arguments: Count, For_Each & Lifecycle",
    "sectionNo": "07",
    "category": "Variables & Logic",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Terraform provides special built-in <strong>Meta-Arguments</strong> that alter how resources are created and managed.</p>\n\n        <h3>1. <code>count</code> vs <code>for_each</code>: Creating Multiple Resources</h3>\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>count (Indexed by Integer)</h4>\n            <p>Creates N identical copies indexed by number (<code>[0]</code>, <code>[1]</code>, <code>[2]</code>).<br/>\n            <strong>Gotcha:</strong> If you remove item <code>[1]</code> from a list, Terraform will destroy and shift <code>[2]</code> down, causing unnecessary recreation.</p>\n          </div>\n          <div class=\"card\">\n            <h4>for_each (Keyed by Identifier)</h4>\n            <p>Iterates over a map or set of strings (<code>[\"web\"]</code>, <code>[\"api\"]</code>).<br/>\n            <strong>Best Practice:</strong> Deleting one item only deletes that specific named resource, leaving all others completely untouched.</p>\n          </div>\n        </div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># Example using for_each to create multiple S3 buckets cleanly:\nresource \"aws_s3_bucket\" \"buckets\" {\n  for_each = toset([\"logs\", \"media\", \"backups\"])\n  bucket   = \"mycompany-app-${each.key}-2026\"\n}\n# Creates:\n# aws_s3_bucket.buckets[\"logs\"]\n# aws_s3_bucket.buckets[\"media\"]\n# aws_s3_bucket.buckets[\"backups\"]</code></pre></div>\n\n        <h3>2. The <code>lifecycle</code> Block (Safety Rules)</h3>\n        <p>Customizes resource creation and destruction behavior:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">resource \"aws_db_instance\" \"production_db\" {\n  engine         = \"postgres\"\n  instance_class = \"db.t3.medium\"\n\n  lifecycle {\n    # 1. Rejects any plan that would accidentally delete this database!\n    prevent_destroy = true\n\n    # 2. Provisions the new resource BEFORE deleting the old one (zero-downtime updates)\n    create_before_destroy = true\n\n    # 3. Ignores changes made by external autoscalers or taggers\n    ignore_changes = [tags]\n  }\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Prefer <code>for_each</code> over <code>count</code> for named resources to avoid destructive list-shifting bugs.</li>\n          <li>Use <code>lifecycle { prevent_destroy = true }</code> on production databases and storage buckets.</li>\n          <li>Use <code>ignore_changes</code> to prevent Terraform from undoing external autoscaling tweaks.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "state-and-remote-backends",
    "group": "state-modules",
    "level": "Intermediate",
    "title": "Terraform State & Remote S3/DynamoDB Backends",
    "sectionNo": "08",
    "category": "State & Modules",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>The <strong>State File</strong> (<code>terraform.tfstate</code>) is the heart of Terraform. It is a JSON database that maps the resources declared in your <code>.tf</code> code to their real-world cloud resource IDs, ARNs, and IP addresses.</p>\n\n        <h3>The Dangers of Local State Files</h3>\n        <p>By default, Terraform saves <code>terraform.tfstate</code> on your local laptop. For teams, this is disastrous:</p>\n        <ul>\n          <li><strong>Team Collisions:</strong> If two engineers run <code>apply</code> simultaneously, state is corrupted.</li>\n          <li><strong>Secret Leaks:</strong> State files contain plaintext database passwords and API keys. Committing state to Git is a massive security incident!</li>\n        </ul>\n\n        <h3>Production Standard: Remote Backend with State Locking</h3>\n        <p>In production, state is stored in a centralized cloud bucket (AWS S3, Azure Blob, GCS) with <strong>State Locking</strong> (AWS DynamoDB) to prevent concurrent applies.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">                  ┌───────────────────────────────┐\n                  │ Engineer A / CI: 'tf apply'   │\n                  └──────────────┬────────────────┘\n                                 │ 1. Acquire Lock (DynamoDB)\n                                 ▼\n┌──────────────────────────────────────────────────────────────────┐\n│ AWS S3 Remote Backend: terraform.tfstate (Encrypted & Versioned) │\n└────────────────────────────────┬─────────────────────────────────┘\n                                 ▲\n                                 │ 2. REJECTED: \"State is Locked!\"\n                  ┌──────────────┴────────────────┐\n                  │ Engineer B / CI: 'tf apply'   │\n                  └───────────────────────────────┘</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># Configuring AWS S3 Remote Backend with DynamoDB Locking in versions.tf:\nterraform {\n  backend \"s3\" {\n    bucket         = \"mycompany-tf-state-production\"\n    key            = \"networking/vpc.tfstate\"\n    region         = \"us-east-1\"\n    encrypt        = true\n    dynamodb_table = \"terraform-state-locks\"\n  }\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>The state file is Terraform's single source of truth mapping code to cloud IDs.</li>\n          <li>Never commit <code>terraform.tfstate</code> to Git &mdash; always add <code>*.tfstate</code> to <code>.gitignore</code>.</li>\n          <li>Always use a remote backend (e.g. S3 + DynamoDB) for team collaboration and state locking.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "reusable-modules",
    "group": "state-modules",
    "level": "Intermediate",
    "title": "Building & Using Reusable Terraform Modules",
    "sectionNo": "09",
    "category": "State & Modules",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>As your infrastructure grows, copying and pasting 100 lines of VPC or server code across Dev, Staging, and Prod leads to maintenance nightmares. <strong>Modules</strong> are Terraform's way of packaging related resources into reusable building blocks.</p>\n\n        <h3>Standard Module Folder Layout</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">modules/web_app/\n├── main.tf        # Resources (EC2 instance, security group, load balancer)\n├── variables.tf   # Input variables (instance_type, environment, app_port)\n├── outputs.tf     # Output values (public_ip, instance_id)\n└── README.md      # Documentation</code></pre></div>\n\n        <h3>Calling a Local Module</h3>\n        <p>In your root configuration (e.g. <code>environments/prod/main.tf</code>), invoke the module using the <code>module</code> block:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\"># Call the reusable web_app module for Production\nmodule \"production_web\" {\n  source = \"../../modules/web_app\"\n\n  # Pass input values to module variables:\n  environment   = \"production\"\n  instance_type = \"t3.medium\"\n  app_port      = 8080\n}\n\n# Access module outputs:\noutput \"prod_url\" {\n  value = module.production_web.public_ip\n}</code></pre></div>\n\n        <h3>Using Public Community Modules (Terraform Registry)</h3>\n        <p>You can also use verified open-source modules published on the official Terraform Registry:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">hcl</span></div><pre><code class=\"language-hcl\">module \"vpc\" {\n  source  = \"terraform-aws-modules/vpc/aws\"\n  version = \"5.0.0\"\n\n  name = \"prod-vpc\"\n  cidr = \"10.0.0.0/16\"\n\n  azs             = [\"us-east-1a\", \"us-east-1b\"]\n  private_subnets = [\"10.0.1.0/24\", \"10.0.2.0/24\"]\n  public_subnets  = [\"10.0.101.0/24\", \"10.0.102.0/24\"]\n}</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Modules encapsulate resources, variables, and outputs into reusable components.</li>\n          <li>Always pin the <code>version</code> when consuming third-party registry modules.</li>\n          <li>Reference module outputs from root code using <code>module.&lt;name&gt;.&lt;output_name&gt;</code>.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "state-operations-drift",
    "group": "state-modules",
    "level": "Intermediate",
    "title": "State Operations, Drift & Importing Resources",
    "sectionNo": "10",
    "category": "State & Modules",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>What happens when someone manually alters a firewall rule in the AWS console? Or when you want to bring an existing S3 bucket under Terraform management without deleting it? These are handled via <strong>State Operations &amp; Import</strong>.</p>\n\n        <h3>1. Detecting Configuration Drift (<code>terraform refresh</code> / <code>plan</code>)</h3>\n        <p><strong>Configuration Drift</strong> occurs when the real cloud infrastructure changes outside of Terraform (e.g. manual changes in AWS Console). Running <code>terraform plan</code> automatically refreshes the state against the cloud and highlights any drift.</p>\n\n        <h3>2. Inspecting State Safely (<code>terraform state</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># List all resources currently tracked in the state file\nterraform state list\n\n# Inspect all attributes of a specific resource in state\nterraform state show aws_instance.web\n\n# Rename a resource in code without destroying it in the cloud!\nterraform state mv aws_instance.old_name aws_instance.new_name</code></pre></div>\n\n        <h3>3. Adopting Existing Cloud Resources: <code>terraform import</code></h3>\n        <p>If an S3 bucket or VPC was created manually months ago, you don't have to delete it. You can import it into Terraform management:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Step 1: Write the resource block in your main.tf\n# resource \"aws_s3_bucket\" \"existing_assets\" {\n#   bucket = \"legacy-company-assets\"\n# }\n\n# Step 2: Run import to bind the real cloud resource ID to your code\nterraform import aws_s3_bucket.existing_assets legacy-company-assets\n\n# Step 3: Run plan to verify zero unwanted diffs!\nterraform plan</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>terraform state list</code> and <code>show</code> let you inspect state without opening raw JSON.</li>\n          <li>Use <code>terraform state mv</code> when renaming resources in code to prevent delete/recreate cycles.</li>\n          <li>Use <code>terraform import</code> to adopt existing cloud infrastructure into Terraform safely.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "terraform-troubleshoot-wizard",
    "group": "drills",
    "level": "Intermediate",
    "title": "Interactive Terraform Troubleshooting Decision Wizard",
    "sectionNo": "11",
    "category": "Drills & Reference",
    "body": [
      {
        "t": "p",
        "c": "Encountered a Terraform error? Stale state lock, missing credentials, circular dependencies, or unexpected resource destruction? Use our interactive diagnostic decision wizard to find the exact fix."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "terraform-quiz-cheatsheet",
    "group": "drills",
    "level": "Basics",
    "title": "Terraform Quiz & Quick Reference Cheat Sheet",
    "sectionNo": "12",
    "category": "Drills & Reference",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "What does 'terraform plan' do?",
            "options": [
              "Applies the changes immediately to the cloud provider",
              "Deletes all resources declared in the configuration",
              "Previews the exact changes Terraform will make (+, ~, -) before modifying real resources",
              "Installs the latest version of the Terraform CLI"
            ],
            "correct": 2,
            "explain": "terraform plan compares your code with current cloud state and creates an execution plan showing what will be created (+), updated (~), or destroyed (-) without making actual changes."
          },
          {
            "q": "Why is storing terraform.tfstate in a remote S3 backend with DynamoDB locking recommended for teams?",
            "options": [
              "It makes Terraform run faster by skipping API calls",
              "It prevents team members from overwriting each other's state and prevents concurrent applies",
              "It automatically generates HCL code from cloud consoles",
              "It is required by the AWS Free Tier"
            ],
            "correct": 1,
            "explain": "A remote backend (S3 + DynamoDB) provides a centralized, encrypted single source of truth and uses DynamoDB to lock state during applies, preventing corruption from concurrent runs."
          },
          {
            "q": "What is the key advantage of 'for_each' over 'count' when creating multiple resources?",
            "options": [
              "for_each uses less memory on the control node",
              "for_each keys resources by unique identifier, so removing an item won't destroy and recreate subsequent items",
              "for_each works without declaring providers",
              "count is deprecated in modern Terraform"
            ],
            "correct": 1,
            "explain": "for_each creates resources indexed by unique map/set keys. Unlike count (which uses integer indices), deleting an item from for_each only deletes that specific resource without shifting other items."
          },
          {
            "q": "Which block type is used to QUERY information about existing cloud infrastructure created outside Terraform?",
            "options": [
              "resource",
              "data",
              "variable",
              "output"
            ],
            "correct": 1,
            "explain": "data blocks (Data Sources) perform read-only queries against cloud APIs to retrieve information about existing resources (e.g. querying the latest AMI ID or default VPC ID)."
          },
          {
            "q": "How do you adopt an existing cloud resource into Terraform management without destroying it?",
            "options": [
              "Run terraform destroy followed by terraform apply",
              "Declare the resource in .tf and run 'terraform import <resource.name> <cloud_id>'",
              "Copy the state file from another developer's computer",
              "Change the provider version in required_providers"
            ],
            "correct": 1,
            "explain": "terraform import binds an existing real-world cloud resource ID to a declared resource block in your .tf configuration without destroying or recreating it."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "terraform init",
            "def": "Initializes directory, downloads provider plugins, and configures backend."
          },
          {
            "term": "terraform plan",
            "def": "Generates execution diff showing what resources will be created (+), modified (~), or destroyed (-)."
          },
          {
            "term": "terraform apply",
            "def": "Executes API calls to provision or update infrastructure to match the desired state."
          },
          {
            "term": "terraform destroy",
            "def": "Tears down and deletes all resources managed in the current workspace."
          },
          {
            "term": "terraform fmt",
            "def": "Rewrites configuration files to canonical HCL format and indentation."
          },
          {
            "term": "terraform validate",
            "def": "Verifies syntax, arguments, and type correctness without calling cloud APIs."
          },
          {
            "term": "terraform state list",
            "def": "Lists all resources currently tracked in the state file."
          },
          {
            "term": "terraform import",
            "def": "Adopts an existing real-world cloud resource into Terraform state."
          },
          {
            "term": "terraform force-unlock <ID>",
            "def": "Manually releases a stuck remote state lock after a crashed apply."
          }
        ]
      }
    ]
  }
]
