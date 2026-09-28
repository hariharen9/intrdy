import type { Topic, TopicGroup } from '@/entities/topic'

export const TERRAFORM_GROUPS: TopicGroup[] = [
  { id: 'foundations', name: 'PART 1: Foundations, HCL & Core Workflow' },
  { id: 'advanced_hcl', name: 'PART 2: Advanced HCL, Loops & Dynamic Blocks' },
  { id: 'state_refactoring', name: 'PART 3: State Management, Refactoring & Mock UI' },
  { id: 'enterprise_cicd', name: 'PART 4: Enterprise Architecture, CI/CD & SRE Drills' },
]

export const TERRAFORM_TOPICS: Topic[] = [
  // -------------------------------------------------------------
  // MODULE 1: What is IaC & The 3 Worlds of Terraform
  // -------------------------------------------------------------
  {
    id: 'iac-foundations',
    group: 'foundations',
    level: 'Beginner',
    title: '1. What is Infrastructure as Code & The 3 Worlds of Terraform',
    sectionNo: '01',
    body: [
      {
        t: 'p',
        c: 'In the era before Infrastructure as Code (IaC), cloud infrastructure was provisioned via **ClickOps** (manually clicking through web consoles) or running unversioned shell scripts. IaC treats infrastructure specification with the same rigor as application source code: versioned in Git, peer-reviewed via Pull Requests, and automatically tested.',
      },
      {
        t: 'cards',
        title: 'ClickOps vs Imperative Scripts vs Declarative Terraform',
        items: [
          {
            h: 'ClickOps (Web Console)',
            c: '• Manual and impossible to reliably replicate across dev, staging, and prod.\n• Zero audit trail of who changed firewall rules or instance sizes.\n• Inevitable configuration drift between environments.',
            chips: ['Anti-Pattern', 'High Risk'],
          },
          {
            h: 'Imperative Scripts (Bash / AWS CLI)',
            c: '• Specifies HOW to do something step-by-step.\n• Fails halfway if an API error occurs, leaving half-built orphan resources.\n• Not idempotent: running the script twice often fails or creates duplicate resources.',
            chips: ['Fragile', 'Step-by-Step'],
          },
          {
            h: 'Declarative IaC (Terraform / OpenTofu)',
            c: '• You specify WHAT the target end-state should be.\n• Terraform automatically calculates the dependency graph and minimum API diffs.\n• 100% Idempotent: running apply repeatedly produces the exact same end state.',
            chips: ['Declarative', 'Idempotent'],
          },
        ],
      },
      {
        t: 'p',
        c: 'To understand how Terraform operates under the hood, you must master the relationship between the **3 Worlds of Terraform**:',
      },
      {
        t: 'flow',
        heading: 'The 3 Worlds Reconciled by Terraform Engine',
        tone: 'good',
        steps: [
          { label: 'Desired State', sub: '*.tf code committed to Git' },
          { label: 'Recorded State', sub: 'terraform.tfstate JSON file' },
          { label: 'Live Cloud APIs', sub: 'Actual running AWS/GCP/Azure resources' },
          { label: 'Execution Plan', sub: 'Diff calculated by terraform plan' },
        ],
        edges: ['Compiles Against', 'Refreshes From', 'Computes Minimal Diff'],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 2: The Core 4-Command Lifecycle
  // -------------------------------------------------------------
  {
    id: 'core-workflow',
    group: 'foundations',
    level: 'Beginner',
    title: '2. The Core Workflow: Init, Plan, Apply & Destroy',
    sectionNo: '02',
    body: [
      {
        t: 'p',
        c: 'Every Terraform project follows an immutable 4-step execution lifecycle. Mastering what happens during each phase is fundamental for day-to-day operations and interview scenarios.',
      },
      {
        t: 'flow',
        heading: 'The Standard Terraform Operational Lifecycle',
        tone: 'default',
        steps: [
          { label: '1. terraform init', sub: 'Downloads provider binaries into .terraform/' },
          { label: '2. terraform plan', sub: 'Queries cloud APIs & prints execution diff' },
          { label: '3. terraform apply', sub: 'Prompts for confirmation & executes API calls' },
          { label: '4. terraform destroy', sub: 'Safely deletes resources in reverse DAG order' },
        ],
        edges: ['Prepares Plugins', 'Pre-calculates Diff', 'Provisions Assets', 'Tears Down'],
      },
      {
        t: 'cards',
        title: 'Decoding Terraform Plan Execution Symbols',
        items: [
          {
            h: '+ create (Green)',
            c: 'The resource exists in your code but does not exist in state or cloud. It will be created fresh.',
            chips: ['+ Add', 'Safe'],
          },
          {
            h: '~ update in-place (Amber)',
            c: 'The resource exists in the cloud. Specific mutable attributes (e.g. tags, timeout) will be modified without terminating the resource.',
            chips: ['~ Modify', 'Zero Downtime'],
          },
          {
            h: '- destroy (Red)',
            c: 'The resource exists in cloud and state, but was removed from code. It will be deleted.',
            chips: ['- Delete', 'Destructive'],
          },
          {
            h: '-/+ replace (Red & Green)',
            c: 'The cloud attribute cannot be modified in-place (e.g., changing an EC2 subnet or S3 bucket name). Terraform will destroy the existing resource and create a new one.',
            chips: ['Replace', 'Downtime Risk'],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 3: HCL Syntax, Resources & Provider Version Pinning
  // -------------------------------------------------------------
  {
    id: 'hcl-providers',
    group: 'foundations',
    level: 'Beginner',
    title: '3. HCL Syntax, Resource Blocks & Provider Pinning',
    sectionNo: '03',
    body: [
      {
        t: 'p',
        c: 'Terraform uses **HashiCorp Configuration Language (HCL)**. An HCL configuration file consists of blocks with types, labels, and attribute assignments.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'versions.tf (Production Provider & Version Constraints)',
        c: `terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"  # Optimistic pinning: allows 5.31, 5.32, but blocks breaking 6.0!
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Environment = "production"
      ManagedBy   = "Terraform"
      Repository  = "infra-core"
    }
  }
}`,
      },
      {
        t: 'p',
        c: 'Declaring resources follows the format `resource "<TYPE>" "<LOCAL_NAME>" { ... }`. The local name is used for internal cross-referencing inside your code and is never sent to the cloud API.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'main.tf (Declaring S3 Bucket Resource)',
        c: `resource "aws_s3_bucket" "app_storage" {
  bucket = "company-app-assets-production-9921"
}

resource "aws_s3_bucket_versioning" "storage_versioning" {
  bucket = aws_s3_bucket.app_storage.id # References the bucket above!

  versioning_configuration {
    status = "Enabled"
  }
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 4: Variables, Locals & Outputs
  // -------------------------------------------------------------
  {
    id: 'variables-locals-outputs',
    group: 'foundations',
    level: 'Intermediate',
    title: '4. Variables, Types, Locals & Outputs: Writing Configurable Code',
    sectionNo: '04',
    body: [
      {
        t: 'p',
        c: 'Hardcoding values directly inside resource blocks makes configurations brittle. Terraform provides a clean separation of concerns through **Input Variables**, **Local Values**, and **Outputs**.',
      },
      {
        t: 'cards',
        title: 'Data Flow in Terraform',
        items: [
          {
            h: 'Input Variables (variables.tf)',
            c: 'Parameters passed from the outside (via terraform.tfvars, CLI -var, or environment variables). Like function arguments with strict types (string, number, bool, list, map, object).',
            chips: ['Input', 'Configurable'],
          },
          {
            h: 'Local Values (locals.tf)',
            c: 'Internal intermediate variables and computed expressions used within a module to adhere to DRY (Don\'t Repeat Yourself) principles. Cannot be overridden from outside.',
            chips: ['Internal', 'Calculated'],
          },
          {
            h: 'Output Values (outputs.tf)',
            c: 'Return values printed at the end of apply and exposed to parent modules or external data sources (e.g., cluster endpoint, public IP, database ARN).',
            chips: ['Return Values', 'Exports'],
          },
        ],
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'variables.tf (Strict Types & Custom Validations)',
        c: `variable "environment" {
  type        = string
  description = "Target deployment environment"
  default     = "staging"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "instance_config" {
  type = object({
    instance_type = string
    disk_size_gb  = number
    enable_public = bool
  })
  default = {
    instance_type = "t3.medium"
    disk_size_gb  = 50
    enable_public = false
  }
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 5: Resource Referencing & Directed Acyclic Graph (DAG)
  // -------------------------------------------------------------
  {
    id: 'dag-dependencies',
    group: 'foundations',
    level: 'Intermediate',
    title: '5. Resource Referencing, DAG Graphs & depends_on',
    sectionNo: '05',
    body: [
      {
        t: 'p',
        c: 'Terraform builds an in-memory **Directed Acyclic Graph (DAG)** to understand the relationships between every resource. Resources that do not depend on each other are provisioned in parallel (up to 10 concurrent operations by default).',
      },
      {
        t: 'flow',
        heading: 'Implicit Dependency Graph Resolution',
        tone: 'good',
        steps: [
          { label: '1. aws_vpc.main', sub: 'CIDR Block 10.0.0.0/16' },
          { label: '2. aws_subnet.public', sub: 'References aws_vpc.main.id' },
          { label: '3. aws_security_group.web', sub: 'References aws_vpc.main.id' },
          { label: '4. aws_instance.web', sub: 'References Subnet + SG' },
        ],
        edges: ['Provides vpc_id', 'Provides subnet_id & sg_id', 'Provisions VM'],
      },
      {
        t: 'p',
        c: 'When an infrastructure dependency cannot be expressed through resource attribute references (e.g., an IAM role policy attachment must finish before an EKS node group starts initializing), use **explicit dependency** via `depends_on`:',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Explicit Dependency with depends_on',
        c: `resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "standard-workers"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = aws_subnet.private[*].id

  # Explicit dependency: Ensure IAM policies are attached BEFORE AWS attempts to boot worker nodes!
  depends_on = [
    aws_iam_role_policy_attachment.node_worker_policy,
    aws_iam_role_policy_attachment.node_cni_policy,
    aws_iam_role_policy_attachment.node_container_registry,
  ]
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 6: Data Sources & Querying Existing Infrastructure
  // -------------------------------------------------------------
  {
    id: 'data-sources',
    group: 'advanced_hcl',
    level: 'Intermediate',
    title: '6. Data Sources: Reading Existing Cloud Infrastructure',
    sectionNo: '06',
    body: [
      {
        t: 'p',
        c: 'A **Data Source** allows Terraform to query real-time information from cloud provider APIs about resources that were created outside of the current Terraform configuration (e.g. fetching existing VPCs, looking up the latest official Amazon Linux AMI, or querying active Availability Zones).',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Dynamically Fetching the Latest Ubuntu 22.04 LTS AMI',
        c: `data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical Official Owner ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# Use the queried data dynamically in your resource:
resource "aws_instance" "web" {
  ami               = data.aws_ami.ubuntu.id
  instance_type     = "t3.micro"
  availability_zone = data.aws_availability_zones.available.names[0]
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 7: Loops: count vs for_each & The Index Trap
  // -------------------------------------------------------------
  {
    id: 'loops-count-foreach',
    group: 'advanced_hcl',
    level: 'Advanced',
    title: '7. Loops & Conditionals: count vs for_each & The Index Trap',
    sectionNo: '07',
    body: [
      {
        t: 'p',
        c: 'Terraform provides two mechanisms to provision multiple instances of a resource: `count` and `for_each`. Choosing the wrong one is one of the most common causes of accidental infrastructure destruction in production.',
      },
      {
        t: 'cards',
        title: 'The count vs for_each Comparison',
        items: [
          {
            h: '❌ count (List Index Trap)',
            c: '• Addresses resources by integer index: `aws_subnet.public[0]`, `[1]`, `[2]`.\n• If you delete item 0, items 1 and 2 shift index position, causing Terraform to destroy and recreate the remaining resources unnecessarily!',
            chips: ['Integer Indexed', 'Index Shift Trap'],
          },
          {
            h: '✅ for_each (Map / Set Keys)',
            c: '• Addresses resources by immutable string key: `aws_subnet.public["us-east-1a"]`.\n• Deleting one item only deletes that specific key without affecting any other resource.',
            chips: ['String Keyed', 'Production Standard'],
          },
          {
            h: 'Conditional Resources (Ternary count)',
            c: 'Use `count = var.enable_bastion ? 1 : 0` to conditionally create or skip optional resources based on boolean flags.',
            chips: ['Feature Flag', 'Zero or One'],
          },
        ],
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Production for_each Map Pattern',
        c: `variable "subnets" {
  type = map(object({
    cidr = string
    az   = string
  }))
  default = {
    "public-1"  = { cidr = "10.0.1.0/24", az = "us-east-1a" }
    "public-2"  = { cidr = "10.0.2.0/24", az = "us-east-1b" }
    "private-1" = { cidr = "10.0.10.0/24", az = "us-east-1a" }
  }
}

resource "aws_subnet" "managed" {
  for_each          = var.subnets
  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value.cidr
  availability_zone = each.value.az

  tags = {
    Name = "subnet-\${each.key}"
  }
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 8: Dynamic Blocks & Built-in HCL Functions
  // -------------------------------------------------------------
  {
    id: 'dynamic-blocks-functions',
    group: 'advanced_hcl',
    level: 'Advanced',
    title: '8. Dynamic Blocks & Built-in HCL Functions',
    sectionNo: '08',
    body: [
      {
        t: 'p',
        c: 'When declaring resources that contain repeated nested configuration blocks (such as Security Group `ingress` rules or Auto Scaling `tag` blocks), write maintainable code using **Dynamic Blocks**.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Dynamic Ingress Rules for Security Group',
        c: `locals {
  service_ports = [
    { port = 80,   description = "HTTP web traffic" },
    { port = 443,  description = "HTTPS encrypted traffic" },
    { port = 8080, description = "Application alternative port" },
  ]
}

resource "aws_security_group" "web_firewall" {
  name   = "web-alb-security-group"
  vpc_id = aws_vpc.main.id

  dynamic "ingress" {
    for_each = local.service_ports
    content {
      description = ingress.value.description
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}`,
      },
      {
        t: 'p',
        c: 'Terraform includes dozens of built-in functions for data manipulation: `templatefile()` for injecting variables into user-data scripts, `lookup()`, `merge()`, `flatten()`, and `can()`/`try()` for fallback handling.',
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 9: Resource Lifecycle Meta-Arguments
  // -------------------------------------------------------------
  {
    id: 'lifecycle-rules',
    group: 'advanced_hcl',
    level: 'Advanced',
    title: '9. Resource Lifecycles: Zero Downtime & Protection',
    sectionNo: '09',
    body: [
      {
        t: 'p',
        c: 'Every resource supports a special `lifecycle` block that overrides Terraform\'s default create-destroy behavior:',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'lifecycle Block Examples (Zero Downtime & Database Protection)',
        c: `resource "aws_instance" "web_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"

  lifecycle {
    # 1. Create the new replacement server BEFORE destroying the old one (Zero Downtime!)
    create_before_destroy = true

    # 2. Prevent accidental destruction of critical databases or storage
    # Any "terraform destroy" or plan that would destroy this will immediately fail!
    # prevent_destroy = true

    # 3. Ignore external out-of-band updates made by autoscalers or cost tags
    ignore_changes = [
      tags["CostCenter"],
      user_data,
    ]
  }
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 10: State Internals & Remote Locking (S3 + DynamoDB)
  // -------------------------------------------------------------
  {
    id: 'state-remote-locking',
    group: 'state_refactoring',
    level: 'Intermediate',
    title: '10. State Internals & Remote Backend Locking (S3 + DynamoDB)',
    sectionNo: '10',
    body: [
      {
        t: 'p',
        c: 'Terraform state is the single source of truth mapping your code to real cloud IDs. In enterprise teams, state must NEVER be stored locally or committed to Git. Instead, store it in an encrypted **Remote Backend** with distributed mutex locking.',
      },
      {
        t: 'stackCompare',
        left: {
          title: '❌ Local State in Git (Dangerous)',
          layers: [
            { label: 'Unencrypted Secrets in Plaintext', sub: 'Database passwords & private keys exposed', tone: 'writable' },
            { label: 'No Concurrency Locking', sub: 'Simultaneous applies corrupt the state file' },
            { label: 'Manual State Sharing', sub: 'Out-of-sync local files across team laptops' },
          ],
        },
        right: {
          title: '✅ S3 + DynamoDB Backend (Production)',
          layers: [
            { label: 'AWS S3 Bucket', sub: 'AES-256 encrypted at rest with Object Versioning' },
            { label: 'DynamoDB Table', sub: 'Distributed mutex lock (Partition Key: LockID)' },
            { label: 'CI/CD Pipeline Access', sub: 'Centralized access via IAM OIDC roles' },
          ],
        },
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'backend.tf (Production S3 + DynamoDB Backend)',
        c: `terraform {
  backend "s3" {
    bucket         = "corp-terraform-state-prod-us-east-1"
    key            = "platform/core-networking/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-locks" # Prevents concurrent applies
    encrypt        = true                    # Server-side encryption (SSE-S3 or KMS)
  }
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 11: INTERACTIVE MOCK UI: TERRAFORM CLI TERMINAL SIMULATOR
  // -------------------------------------------------------------
  {
    id: 'mock-ui-terraform-cli',
    group: 'state_refactoring',
    level: 'Advanced',
    title: '11. 🖥️ Interactive Mock UI: Terraform Plan & Apply CLI Simulator',
    sectionNo: '11',
    body: [
      {
        t: 'p',
        c: 'Experience how the Terraform CLI evaluates execution plans, detects configuration drift, locks remote state in DynamoDB, and refactors resources with live terminal diffs:',
      },
      {
        t: 'html',
        html: `
<div class="panel rounded-2xl border-2 border-purple-500/50 bg-[#0d1117] text-slate-100 p-4 sm:p-6 my-6 shadow-2xl overflow-hidden font-sans select-none">
  <!-- Terminal Header Bar -->
  <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="flex gap-1.5">
        <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-xs sm:text-sm font-mono text-purple-400">bash — terraform v1.8.4</span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/80">S3 Backend Connected</span>
        </div>
      </div>
    </div>
    <div class="text-xs font-mono text-slate-400">
      AWS Region: <span class="text-slate-200">us-east-1</span> (State Lock: <span class="text-emerald-400">Acquired ✓</span>)
    </div>
  </div>

  <!-- CLI Command Selector Buttons -->
  <div class="my-3">
    <label class="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Execute a Simulated Terraform Command:</label>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2" id="tf-cmd-grid">
      <button type="button" onclick="runTfSim(0)" id="btn-tf-0" class="text-left px-3 py-2 rounded-lg border border-purple-500 bg-purple-500/10 text-purple-300 text-xs font-mono transition hover:bg-purple-500/20 cursor-pointer">
        1. terraform plan (VPC + EKS)
      </button>
      <button type="button" onclick="runTfSim(1)" id="btn-tf-1" class="text-left px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 cursor-pointer">
        2. terraform apply (Security Group)
      </button>
      <button type="button" onclick="runTfSim(2)" id="btn-tf-2" class="text-left px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 cursor-pointer">
        3. plan -refresh-only (Drift Detection)
      </button>
      <button type="button" onclick="runTfSim(3)" id="btn-tf-3" class="text-left px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 cursor-pointer">
        4. moved {} (Zero Downtime Move)
      </button>
    </div>
  </div>

  <!-- Terminal Output Window -->
  <div class="rounded-xl bg-[#090d13] p-4 font-mono text-xs text-slate-300 border border-slate-800/90 shadow-inner overflow-x-auto min-h-[260px] max-h-[380px] scrollbar-thin" id="tf-terminal-output">
    <!-- Initial State Output -->
    <div class="text-slate-500 mb-1">$ terraform plan</div>
    <div class="text-slate-400 mb-2">Acquiring state lock. This may take a few moments...</div>
    <div class="text-purple-300 mb-2">Refreshing Terraform state in-memory prior to plan...</div>
    <div class="text-slate-300">data.aws_ami.ubuntu: Reading... [id=ami-0c7217cdde317cfec]</div>
    <div class="text-slate-300">aws_vpc.main: Refreshing state... [id=vpc-0981a27e1f4]</div>
    <div class="my-2 border-t border-slate-800"></div>
    <div class="font-bold text-slate-100 mb-2">Terraform will perform the following actions:</div>
    <div class="text-emerald-400 font-semibold mb-1">  # aws_eks_cluster.production will be created</div>
    <div class="text-emerald-400">  + resource "aws_eks_cluster" "production" {</div>
    <div class="text-emerald-400">      + arn                   = (known after apply)</div>
    <div class="text-emerald-400">      + endpoint              = (known after apply)</div>
    <div class="text-emerald-400">      + id                    = (known after apply)</div>
    <div class="text-emerald-400">      + name                  = "prod-core-cluster"</div>
    <div class="text-emerald-400">      + role_arn              = "arn:aws:iam::123456789012:role/eks-cluster-role"</div>
    <div class="text-emerald-400">      + version               = "1.29"</div>
    <div class="text-emerald-400">    }</div>
    <div class="my-2 border-t border-slate-800"></div>
    <div class="font-bold text-emerald-400">Plan: 3 to add, 0 to change, 0 to destroy.</div>
    <div class="text-slate-400 mt-1">─────────────────────────────────────────────────────────────────────────────</div>
    <div class="text-slate-400 text-[11px] mt-1">Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.</div>
  </div>
</div>

<script>
  const tfScenarios = [
    {
      cmd: 'terraform plan',
      lines: [
        '<span class="text-slate-500">$ terraform plan</span>',
        '<span class="text-slate-400">Acquiring state lock. This may take a few moments...</span>',
        '<span class="text-purple-300">Refreshing Terraform state in-memory prior to plan...</span>',
        '<span class="text-slate-300">data.aws_ami.ubuntu: Reading... [id=ami-0c7217cdde317cfec]</span>',
        '<span class="text-slate-300">aws_vpc.main: Refreshing state... [id=vpc-0981a27e1f4]</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="font-bold text-slate-100">Terraform will perform the following actions:</span>',
        '<span class="text-emerald-400 font-semibold">  # aws_eks_cluster.production will be created</span>',
        '<span class="text-emerald-400">  + resource "aws_eks_cluster" "production" {</span>',
        '<span class="text-emerald-400">      + arn                   = (known after apply)</span>',
        '<span class="text-emerald-400">      + endpoint              = (known after apply)</span>',
        '<span class="text-emerald-400">      + id                    = (known after apply)</span>',
        '<span class="text-emerald-400">      + name                  = "prod-core-cluster"</span>',
        '<span class="text-emerald-400">      + role_arn              = "arn:aws:iam::123456789012:role/eks-cluster-role"</span>',
        '<span class="text-emerald-400">      + version               = "1.29"</span>',
        '<span class="text-emerald-400">    }</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="font-bold text-emerald-400">Plan: 3 to add, 0 to change, 0 to destroy.</span>',
        '<span class="text-slate-400 text-[11px] mt-1">Releasing state lock... Done.</span>'
      ]
    },
    {
      cmd: 'terraform apply -auto-approve',
      lines: [
        '<span class="text-slate-500">$ terraform apply -auto-approve</span>',
        '<span class="text-slate-400">Acquiring state lock (DynamoDB: LockID=8f1b-492a-bc91)...</span>',
        '<span class="text-amber-400 font-semibold">  # aws_security_group.web_alb will be updated in-place</span>',
        '<span class="text-amber-400">  ~ resource "aws_security_group" "web_alb" {</span>',
        '<span class="text-slate-300">        id          = "sg-0481fa7291bd8"</span>',
        '<span class="text-slate-300">        name        = "web-alb-security-group"</span>',
        '<span class="text-amber-400">      ~ description = "Old description" -> "Production HTTPS and HTTP ingress firewall"</span>',
        '<span class="text-amber-400">      + ingress {</span>',
        '<span class="text-emerald-400">          + cidr_blocks = ["0.0.0.0/0"]</span>',
        '<span class="text-emerald-400">          + from_port   = 443</span>',
        '<span class="text-emerald-400">          + protocol    = "tcp"</span>',
        '<span class="text-emerald-400">          + to_port     = 443</span>',
        '<span class="text-amber-400">        }</span>',
        '<span class="text-amber-400">    }</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="text-slate-300">aws_security_group.web_alb: Modifying... [id=sg-0481fa7291bd8]</span>',
        '<span class="text-slate-300">aws_security_group.web_alb: Modifications complete after 2s [id=sg-0481fa7291bd8]</span>',
        '<span class="font-bold text-emerald-400 mt-1">Apply complete! Resources: 0 added, 1 changed, 0 destroyed.</span>',
        '<span class="text-purple-300 font-mono text-[11px]">Outputs:</span>',
        '<span class="text-slate-200">security_group_id = "sg-0481fa7291bd8"</span>'
      ]
    },
    {
      cmd: 'terraform plan -refresh-only',
      lines: [
        '<span class="text-slate-500">$ terraform plan -refresh-only</span>',
        '<span class="text-slate-400">Acquiring state lock...</span>',
        '<span class="text-purple-300">Refreshing state against live AWS API to detect out-of-band ClickOps drift...</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="text-amber-400 font-semibold font-bold">Objects have changed outside of Terraform:</span>',
        '<span class="text-slate-300">  # aws_security_group.db_firewall has been modified outside of Terraform:</span>',
        '<span class="text-rose-400">  - ingress {</span>',
        '<span class="text-rose-400">      - cidr_blocks = ["0.0.0.0/0"] # MANUAL CONSOLE CHANGE DETECTED (SECURITY RISK)</span>',
        '<span class="text-rose-400">      - from_port   = 22</span>',
        '<span class="text-rose-400">      - protocol    = "tcp"</span>',
        '<span class="text-rose-400">      - to_port     = 22</span>',
        '<span class="text-rose-400">    }</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="font-bold text-amber-400">This plan was saved to: -refresh-only. State file updated.</span>',
        '<span class="text-slate-300 text-[11px]">Tip: Run "terraform apply" to overwrite unauthorized console changes and restore compliance!</span>'
      ]
    },
    {
      cmd: 'terraform plan (with moved block)',
      lines: [
        '<span class="text-slate-500">$ terraform plan</span>',
        '<span class="text-slate-400">Acquiring state lock...</span>',
        '<span class="text-purple-300">Parsing configuration and analyzing moved blocks...</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="text-sky-400 font-semibold">  # aws_instance.web has moved to module.compute.aws_instance.web</span>',
        '<span class="text-slate-300">    (Resource identity updated in-place within state file. ZERO cloud modifications required.)</span>',
        '<div class="my-2 border-t border-slate-800"></div>',
        '<span class="font-bold text-emerald-400">Plan: 0 to add, 0 to change, 0 to destroy.</span>',
        '<span class="text-emerald-300 text-[11px]">Success: Zero-downtime refactoring completed! Live EC2 instance was NOT destroyed.</span>'
      ]
    }
  ];

  window.runTfSim = function(index) {
    const sc = tfScenarios[index];
    if (!sc) return;

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById('btn-tf-' + i);
      if (i === index) {
        btn.className = 'text-left px-3 py-2 rounded-lg border border-purple-500 bg-purple-500/10 text-purple-300 text-xs font-mono transition hover:bg-purple-500/20 cursor-pointer';
      } else {
        btn.className = 'text-left px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 cursor-pointer';
      }
    }

    const term = document.getElementById('tf-terminal-output');
    term.innerHTML = '<div class="text-purple-400 animate-pulse">Running ' + sc.cmd + '...</div>';
    setTimeout(() => {
      term.innerHTML = sc.lines.join('<br/>');
    }, 150);
  };
</script>
`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 12: Zero-Downtime Refactoring with moved {} Blocks
  // -------------------------------------------------------------
  {
    id: 'moved-blocks-refactoring',
    group: 'state_refactoring',
    level: 'Advanced',
    title: '12. Zero-Downtime Refactoring with moved {} Blocks',
    sectionNo: '12',
    body: [
      {
        t: 'p',
        c: 'In older Terraform versions, renaming a resource or moving it into a child module caused Terraform to think you deleted the old resource and created a new one, destroying production assets. In Terraform 1.1+, the declarative **`moved {}` block** tells Terraform that a resource address changed without touching real cloud infrastructure.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Zero-Downtime Module Refactoring with moved {}',
        c: `# 1. Original code:
# resource "aws_instance" "web_server" { ... }

# 2. Refactored code: Extracted into module.compute
module "compute" {
  source = "./modules/compute"
}

# 3. Add moved block to main.tf:
moved {
  from = aws_instance.web_server
  to   = module.compute.aws_instance.web
}

# When you run terraform plan:
# "aws_instance.web_server has moved to module.compute.aws_instance.web"
# Plan: 0 to add, 0 to change, 0 to destroy!`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 13: Declarative Import (Terraform 1.5+)
  // -------------------------------------------------------------
  {
    id: 'import-blocks',
    group: 'state_refactoring',
    level: 'Advanced',
    title: '13. Declarative Import & Automated Code Generation',
    sectionNo: '13',
    body: [
      {
        t: 'p',
        c: 'Historically, importing existing unmanaged cloud resources required running manual CLI commands (`terraform import aws_s3_bucket.b name`) and manually typing the HCL code. **Terraform 1.5+** introduced declarative `import {}` blocks that automatically generate the exact HCL configuration for you.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Declarative import Block & Code Generation',
        c: `# 1. Declare the import target in imports.tf:
import {
  to = aws_s3_bucket.legacy_assets
  id = "unmanaged-company-assets-bucket"
}

# 2. Run terraform plan with -generate-config-out flag:
# terraform plan -generate-config-out=generated_bucket.tf

# 3. Terraform generates the exact HCL code automatically!
# generated_bucket.tf:
# resource "aws_s3_bucket" "legacy_assets" {
#   bucket = "unmanaged-company-assets-bucket"
#   # ... all live cloud attributes populated automatically!
# }

# 4. Review and run apply to adopt the resource into state cleanly:
# terraform apply`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 14: Module Architecture & Clean Repository Layouts
  // -------------------------------------------------------------
  {
    id: 'module-architecture',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '14. Enterprise Module Architecture & Repo Layouts',
    sectionNo: '14',
    body: [
      {
        t: 'p',
        c: 'A Terraform module is a container for multiple resources that are used together. In enterprise environments, organize modules into **Reusable Child Modules** and environment-specific **Root Workspaces**:',
      },
      {
        t: 'cards',
        title: 'Standard Enterprise Module Directory Structure',
        items: [
          {
            h: 'Child Module (e.g. modules/vpc/)',
            c: '• main.tf: Core resources (VPC, subnets, route tables).\n• variables.tf: Reusable inputs with defaults and validations.\n• outputs.tf: Exported attributes (vpc_id, subnet_ids).\n• versions.tf: Minimum provider version requirements.',
            chips: ['Reusable', 'Generic'],
          },
          {
            h: 'Root Environment (e.g. envs/prod/)',
            c: '• main.tf: Calls child modules with environment-specific variables.\n• backend.tf: Points to unique remote state file key.\n• terraform.tfvars: Concrete values for production.',
            chips: ['Deployment', 'Specific'],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 15: Multi-Region & Multi-Account Provider Aliases
  // -------------------------------------------------------------
  {
    id: 'provider-aliases',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '15. Multi-Region & Multi-Account Provider Aliases',
    sectionNo: '15',
    body: [
      {
        t: 'p',
        c: 'When managing multi-region architectures (e.g., CloudFront ACM certificates in `us-east-1` while app infrastructure runs in `eu-west-1`), use **Provider Aliases**:',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'Provider Aliasing for Multi-Region ACM Certificate',
        c: `# Default primary provider
provider "aws" {
  region = "eu-west-1"
}

# Secondary provider alias for global CloudFront certificates (must be us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# Certificate provisioned in us-east-1 using provider alias:
resource "aws_acm_certificate" "global_cert" {
  provider          = aws.us_east_1 # Explicitly targets the alias!
  domain_name       = "api.company.com"
  validation_method = "DNS"
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 16: Policy as Code & Secret Management
  // -------------------------------------------------------------
  {
    id: 'policy-as-code-security',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '16. Policy as Code (OPA / Checkov) & Secrets Security',
    sectionNo: '16',
    body: [
      {
        t: 'p',
        c: 'Enterprise security requires automated gatekeeping before Terraform applies. Use **Policy as Code (Open Policy Agent / Checkov / tfsec)** to scan plans for security misconfigurations (such as unencrypted S3 buckets, open 0.0.0.0/0 SSH security groups, or missing disaster recovery backups).',
      },
      {
        t: 'cards',
        title: 'Security Gateways in the IaC Pipeline',
        items: [
          {
            h: 'Checkov / tfsec Static Analysis',
            c: 'Scans HCL code during PR pre-commit checks. Enforces organizational standards (e.g. S3 server-side encryption enabled, EBS volumes encrypted with KMS).',
            chips: ['Static Analysis', 'Pre-Commit'],
          },
          {
            h: 'Open Policy Agent (OPA / Rego)',
            c: 'Evaluates the JSON execution plan (`terraform show -json tfplan.binary`) to block illegal deployments before apply.',
            chips: ['OPA Gatekeeper', 'Plan Verification'],
          },
          {
            h: 'Secrets Management (AWS Secrets Manager)',
            c: 'Never put database passwords in .tfvars! Use `data "aws_secretsmanager_secret_version"` to pull credentials dynamically at runtime.',
            chips: ['Zero Hardcoded Secrets', 'KMS Encrypted'],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 17: CI/CD Automation with GitHub Actions & AWS OIDC
  // -------------------------------------------------------------
  {
    id: 'cicd-github-actions-oidc',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '17. CI/CD Pipeline Automation: GitHub Actions & AWS OIDC',
    sectionNo: '17',
    body: [
      {
        t: 'p',
        c: 'Modern enterprise CI/CD pipelines use **OpenID Connect (OIDC)** to authenticate directly to AWS/GCP without creating or storing long-lived static API keys in GitHub Secrets.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: '.github/workflows/terraform.yml (Production OIDC Pipeline)',
        c: `name: "Terraform Production Pipeline"

on:
  pull_request:
    branches: ["main"]
  push:
    branches: ["main"]

permissions:
  id-token: write # Required for AWS OIDC authentication!
  contents: read
  pull-requests: write

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials with OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: "arn:aws:iam::123456789012:role/github-actions-terraform-role"
          aws-region: "us-east-1"

      - uses: hashicorp/setup-terraform@v3

      - name: Terraform Init & Validate
        run: |
          terraform init
          terraform validate

      - name: Terraform Plan
        if: github.event_name == 'pull_request'
        run: terraform plan -no-color -out=tfplan

      - name: Terraform Apply (Main Branch Only)
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 18: Continuous Validation (check {} Blocks)
  // -------------------------------------------------------------
  {
    id: 'continuous-validation',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '18. Continuous Validation: check Blocks & Pre/Post-Conditions',
    sectionNo: '18',
    body: [
      {
        t: 'p',
        c: 'Terraform supports built-in **Custom Conditions** to validate that infrastructure meets expectations both before provisioning (precondition) and after provisioning (postcondition), as well as ongoing assertions via `check {}` blocks.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'check Block & Postcondition Example',
        c: `# Assert that a production website URL returns HTTP 200 after deployment:
check "health_check" {
  data "http" "web_endpoint" {
    url = "https://\${aws_route53_record.web.fqdn}/healthz"
  }

  assert {
    condition     = data.http.web_endpoint.status_code == 200
    error_message = "Production health check endpoint returned status \${data.http.web_endpoint.status_code}!"
  }
}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 19: Troubleshooting Incident Decision Wizard
  // -------------------------------------------------------------
  {
    id: 'terraform-wizard',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '19. 🩺 Terraform Incident Troubleshooting Wizard',
    sectionNo: '19',
    body: [
      {
        t: 'p',
        c: 'Use this interactive decision tree to resolve production state locking errors, dependency cycle loops, accidental replacement plans, and provider version conflicts:',
      },
      {
        t: 'wizard',
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 20: Interactive Quiz
  // -------------------------------------------------------------
  {
    id: 'terraform-quiz',
    group: 'enterprise_cicd',
    level: 'Advanced',
    title: '20. 🎯 Senior Staff Terraform & IaC Interview Quiz',
    sectionNo: '20',
    body: [
      {
        t: 'p',
        c: 'Test your mastery of Terraform HCL, state locking, declarative imports, and lifecycle rules:',
      },
      {
        t: 'quiz',
        questions: [
          {
            q: 'Why is for_each strongly preferred over count for provisioning cloud resources like subnets or VMs?',
            options: [
              'count cannot create more than 5 resources',
              'count addresses resources by integer index [0, 1, 2]; deleting an item shifts subsequent indexes, causing Terraform to destroy and recreate remaining resources unnecessarily',
              'for_each is faster because it bypasses the cloud provider API',
              'count does not support tags in AWS',
            ],
            correct: 1,
            explain:
              'count uses integer indexing. If you remove item 0 from a list of 3 items, the resource previously at index 1 becomes index 0, causing Terraform to destroy and recreate resources to match the shifted index. for_each uses immutable string keys that prevent index shifting.',
          },
          {
            q: 'What is the role of DynamoDB in an AWS S3 remote state backend configuration?',
            options: [
              'DynamoDB caches the cloud provider binaries',
              'DynamoDB provides distributed mutex state locking (Partition Key: LockID) to prevent simultaneous applies from causing race conditions and state corruption',
              'DynamoDB stores the Git commit history',
              'DynamoDB replaces the need for an S3 bucket',
            ],
            correct: 1,
            explain:
              'DynamoDB acts as a distributed lock table. When terraform plan/apply starts, it writes a lock record with a unique LockID. Other runs are blocked until the lock is released.',
          },
          {
            q: 'How do you refactor an existing resource into a child module without destroying the live cloud asset?',
            options: [
              'Delete the state file and run terraform apply',
              'Use the declarative moved {} block in HCL (or terraform state mv)',
              'Add lifecycle { prevent_destroy = false }',
              'Rename the AWS account',
            ],
            correct: 1,
            explain:
              'The moved {} block (introduced in Terraform 1.1) instructs Terraform that a resource address changed (e.g. from aws_instance.web to module.compute.aws_instance.web), updating the state pointer with zero downtime or cloud modifications.',
          },
          {
            q: 'What does "terraform plan -refresh-only" do?',
            options: [
              'Deletes all resources in the cloud',
              'Queries the cloud APIs and updates the state file with live reality to detect out-of-band ClickOps drift without planning infrastructure changes',
              'Re-downloads all provider plugins from the registry',
              'Compacts the S3 state bucket',
            ],
            correct: 1,
            explain:
              'plan -refresh-only inspects the real cloud environment to detect drift (changes made outside of Terraform) and allows updating the state file safely without making modifications to infrastructure.',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 21: Master Cheatsheet
  // -------------------------------------------------------------
  {
    id: 'terraform-cheatsheet',
    group: 'enterprise_cicd',
    level: 'Intermediate',
    title: '21. 📋 Enterprise Terraform & HCL Master Cheatsheet',
    sectionNo: '21',
    body: [
      {
        t: 'p',
        c: 'Quick reference of essential Terraform CLI commands, HCL meta-arguments, and production troubleshooting snippets:',
      },
      {
        t: 'cheatsheet',
        items: [
          {
            term: 'terraform init -upgrade',
            def: 'Re-initializes the workspace and upgrades provider plugins to the latest versions allowed by version constraints.',
          },
          {
            term: 'terraform fmt -recursive',
            def: 'Formats all .tf files across all subdirectories into canonical HCL style and indentation.',
          },
          {
            term: 'terraform validate',
            def: 'Validates syntax, internal variable references, and type consistency without making network calls to cloud APIs.',
          },
          {
            term: 'terraform state list',
            def: 'Lists all resource addresses currently tracked in the state file.',
          },
          {
            term: 'terraform state show <address>',
            def: 'Displays detailed attributes and live metadata for a specific tracked resource.',
          },
          {
            term: 'terraform force-unlock <LOCK_ID>',
            def: 'Releases a stuck DynamoDB state lock left behind by an interrupted or cancelled apply.',
          },
          {
            term: 'create_before_destroy = true',
            def: 'Lifecycle meta-argument that creates replacement resources before deleting old ones for zero-downtime rollouts.',
          },
          {
            term: 'prevent_destroy = true',
            def: 'Lifecycle meta-argument that rejects any plan attempting to destroy the resource (essential for production databases).',
          },
          {
            term: 'ignore_changes = [tags]',
            def: 'Lifecycle meta-argument that ignores out-of-band attribute modifications made by external autoscalers or tools.',
          },
        ],
      },
    ],
  },
]
