import type { QAItem } from '@/entities/topic'

export const TERRAFORM_QA_FUND: QAItem[] = [
  [
    'What is Infrastructure as Code (IaC), and what is the difference between Declarative and Imperative IaC?',
    'Infrastructure as Code (IaC) is the practice of managing and provisioning computer data centers and cloud resources through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.\n• Imperative IaC (e.g., AWS CLI, Bash, Python boto3, Ansible tasks): You specify the explicit sequence of steps to execute. If a step fails halfway, the system is left in an unknown state.\n• Declarative IaC (e.g., Terraform, OpenTofu, CloudFormation, Kubernetes manifests): You specify the DESIRED END-STATE. The engine compares current state against desired state and computes the minimal set of create/update/delete API calls to reach that state idempotently.',
  ],
  [
    'Explain the 4 Core Commands in the Terraform Workflow and what happens during each.',
    '1. terraform init: Initializes working directory, downloads required provider plugins into .terraform/, and prepares the state backend (local or S3/remote).\n2. terraform plan: Performs a dry run. Queries live cloud provider APIs, compares against state and local .tf code, and calculates an execution diff (+ create, ~ update in-place, - destroy, -/+ replace).\n3. terraform apply: Requests user confirmation ("yes") and executes the cloud API calls to match the plan. Updates terraform.tfstate upon completion.\n4. terraform destroy: Deletes all infrastructure tracked in the state file in reverse dependency order.',
  ],
  [
    'What is the purpose of the terraform.tfstate file, and why is storing it in Git a critical security risk?',
    'The state file is a JSON database that maps declarative HCL resource definitions to real-world cloud resource IDs (e.g. mapping aws_instance.web to "i-09f81a8b2") along with resource metadata and dependency tracking.\nStoring it in Git is dangerous because:\n1. Secrets: State files store plaintext values of database passwords, private keys, and sensitive tokens created during provisioning.\n2. Concurrency: Git lacks real-time locking. If two engineers push changes at once, state collisions will corrupt infrastructure.',
  ],
  [
    'What is the difference between Variables, Locals, and Outputs in Terraform?',
    '• Input Variables (variable "name" {}): Configurable parameters passed into a module or root workspace from external sources (terraform.tfvars, CLI flags, or environment variables). Like function arguments.\n• Local Values (locals {}): Internal computed constants or DRY expressions defined within the module. They cannot be overridden from the outside.\n• Output Values (output "name" {}): Return values exposed after an apply (e.g., public IP, database endpoint) and the primary mechanism for child modules to pass data back to the root module.',
  ],
  [
    'What is the difference between count and for_each in Terraform, and why is for_each preferred for resources?',
    '• count creates resources indexed by integer (e.g., aws_subnet.public[0], aws_subnet.public[1]). If you remove an item from the middle or beginning of the list, every subsequent resource index shifts, causing Terraform to destroy and recreate the remaining resources unnecessarily.\n• for_each operates on a set of strings or a map (e.g., aws_subnet.public["us-east-1a"]). Resources are addressed by distinct, immutable string keys. Adding or removing one item only modifies that specific key without affecting any other resource.',
  ],
  [
    'What are Data Sources in Terraform, and how do they differ from Resources?',
    '• resource blocks define infrastructure that Terraform owns, creates, modifies, and destroys.\n• data source blocks allow Terraform to read and query information about existing cloud infrastructure that was created outside of Terraform or in a different workspace (e.g., querying the default VPC, fetching the latest official Ubuntu AMI ID, or reading an existing DNS hosted zone).',
  ],
]

export const TERRAFORM_QA_ADV: QAItem[] = [
  [
    'How do you design a production-grade Remote State Backend with S3 and DynamoDB?',
    'In AWS, enterprise Terraform uses an S3 bucket configured with:\n1. Encryption: SSE-S3 or SSE-KMS for encrypting state data at rest.\n2. Versioning: Enabled to allow rolling back to previous state snapshots in case of accidental corruption.\n3. Public Access Block: Explicitly blocking all public reads/writes.\n4. DynamoDB Table with Partition Key "LockID": Terraform acquires a distributed mutex lock before running plan/apply, preventing concurrent runs from race conditions. The backend block in HCL points to the S3 bucket and DynamoDB table.',
  ],
  [
    'How do you refactor resources or extract them into child modules without destroying production assets?',
    'In Terraform 1.1+, you use the declarative `moved {}` block in your code:\n```hcl\nmoved {\n  from = aws_instance.web\n  to   = module.compute.aws_instance.web\n}\n```\nWhen `terraform plan` runs, instead of planning to delete the old instance and create a brand new one, it detects the `moved` block and updates the state pointer in-place with ZERO downtime or resource destruction.',
  ],
  [
    'How does Terraform 1.5+ Declarative Import work compared to legacy CLI `terraform import`?',
    '• Legacy CLI (`terraform import aws_s3_bucket.b bucket-name`): Required manually writing empty HCL code first, running the CLI command, and then manually filling in all the missing HCL attributes to match what was imported.\n• Declarative Import (Terraform 1.5+): You declare an `import {}` block in code:\n```hcl\nimport {\n  to = aws_s3_bucket.b\n  id = "my-bucket-name"\n}\n```\nThen run `terraform plan -generate-config-out=generated.tf`. Terraform automatically queries the cloud API and writes the exact HCL configuration file for you!',
  ],
  [
    'What are Terraform Lifecycle Rules (`create_before_destroy`, `prevent_destroy`, `ignore_changes`)?',
    '• create_before_destroy = true: Reverses the default destroy-then-create replacement order. Essential for zero-downtime rolling updates of web servers, ASGs, or SSL certificates.\n• prevent_destroy = true: Rejects any `terraform destroy` or plan that would destroy the resource. Used to safeguard production databases, primary VPCs, and storage buckets from human error.\n• ignore_changes = [tags, desired_capacity]: Tells Terraform to ignore out-of-band updates made by external tools (e.g., AWS Auto Scaling adjusting instance counts or cost management tools adding billing tags).',
  ],
  [
    'What is Configuration Drift, and how do you detect and remediate it in production?',
    'Configuration drift occurs when cloud resources are modified outside of Terraform (e.g., an engineer edits a Security Group rule directly in the AWS Console during an outage).\n• Detection: Run `terraform plan -refresh-only`. This queries real cloud APIs and updates the state file with current reality without making infrastructure changes, highlighting the drift.\n• Remediation:\n1. Overwrite drift: Run a normal `terraform apply` to overwrite console changes and restore the code baseline.\n2. Adopt drift: Update your `.tf` code to match the manual changes and run apply.',
  ],
  [
    'How do you automate Terraform securely in CI/CD pipelines using GitHub Actions without long-lived AWS API keys?',
    'By configuring **OpenID Connect (OIDC)** between GitHub Actions and AWS IAM:\n1. Create an AWS IAM Identity Provider for `token.actions.githubusercontent.com` and an IAM Role with an `sts:AssumeRoleWithWebIdentity` trust policy scoped to your GitHub repo and branch.\n2. In GitHub Actions, use `aws-actions/configure-aws-credentials` with `role-to-assume`. GitHub requests a short-lived JSON Web Token (JWT), which AWS validates to grant temporary 1-hour credentials.\n3. The pipeline runs `terraform plan` on Pull Requests (posting plan summaries as PR comments) and runs `terraform apply` only when merged to the `main` branch.',
  ],
]
