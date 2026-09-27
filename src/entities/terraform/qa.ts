import type { QAItem } from '@/entities/topic'

export const terraformQAFundamentals: QAItem[] = [
  [
    'What is Infrastructure as Code (IaC) and what primary problem does Terraform solve?',
    'Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure (servers, networks, databases, buckets) through machine-readable definition files rather than manual point-and-click configuration in cloud web consoles (ClickOps). Terraform allows you to define desired cloud state declaratively, test changes safely via `plan`, version-control your infrastructure in Git, and eliminate manual drift.',
  ],
  [
    'Explain the 4 core lifecycle commands in Terraform: init, plan, apply, and destroy.',
    '1. `terraform init`: Initializes the working directory, downloads required provider plugins (e.g. AWS, Azure), and configures the backend.\n2. `terraform plan`: Reads current cloud state, compares it with your code, and creates an execution plan showing what will be created (+), modified (~), or destroyed (-).\n3. `terraform apply`: Executes the proposed actions by calling cloud APIs to achieve the desired state.\n4. `terraform destroy`: Deletes all managed infrastructure resources declared in the configuration.',
  ],
  [
    'What is the difference between Declarative and Imperative infrastructure management?',
    '- Declarative (Terraform): You specify the *desired end state* (e.g. "I want 3 EC2 instances in us-east-1"). Terraform automatically calculates what needs to be created or deleted to reach that state.\n- Imperative (Bash / AWS CLI scripts): You specify explicit step-by-step instructions (e.g. "Run aws ec2 run-instances, then wait, then attach volume"). If run twice, imperative scripts often fail or create duplicate resources.',
  ],
  [
    'What is the purpose of the `terraform.tfstate` file?',
    '`terraform.tfstate` is the single source of truth mapping your declared configuration to real-world cloud resource IDs and attributes (e.g. mapping `aws_s3_bucket.my_bucket` to `arn:aws:s3:::my-unique-bucket-1234`). It enables Terraform to calculate diffs, determine resource dependencies, and track metadata.',
  ],
  [
    'Why is storing Terraform state in local files dangerous for teams, and how does a Remote Backend solve it?',
    'Local state files on developer laptops cause severe problems:\n1. Merge conflicts: Two developers applying changes locally will overwrite each other\'s state.\n2. Security risk: State files contain plaintext secrets (database passwords, private keys).\n3. No state locking: Concurrent applies will corrupt the state file.\nRemote backends (e.g. AWS S3 + DynamoDB table, Azure Blob, GCS) store state centrally, encrypt it at rest, and provide distributed state locking during applies.',
  ],
  [
    'What is the difference between Input Variables (`variable`), Local Values (`locals`), and Outputs (`output`)?',
    '- `variable`: Parameters passed into a configuration or module from outside (CLI, `terraform.tfvars`, or parent module) to make code customizable.\n- `locals`: Internal intermediate helper variables used within a module to avoid repeating complex expressions (DRY principle).\n- `output`: Values returned by a configuration or child module (e.g. public IP, database endpoint, bucket ARN) to be displayed on console or consumed by other modules.',
  ],
  [
    'What is the difference between `count` and `for_each` in resource creation?',
    '- `count`: Takes an integer (e.g. `count = 3`) and creates resources indexed by integer (e.g. `aws_instance.server[0]`, `[1]`). If you delete an item from the middle of the list, Terraform will destroy and shift subsequent resources.\n- `for_each`: Takes a map or set of strings and creates resources keyed by identifier (e.g. `aws_instance.server["web"]`, `["api"]`). Removing an item deletes only that specific named resource without affecting others.',
  ],
  [
    'What are Data Sources (`data` blocks) and how do they differ from Resources (`resource` blocks)?',
    '- `resource`: Declares infrastructure that Terraform is responsible for creating, modifying, and destroying.\n- `data`: Read-only queries that fetch information about existing infrastructure created outside the current Terraform workspace (e.g. looking up the latest Ubuntu AMI ID, VPC ID, or existing hosted zone).',
  ],
]

export const terraformQAAdvanced: QAItem[] = [
  [
    'Explain the difference between Implicit Dependencies and Explicit Dependencies (`depends_on`).',
    '- Implicit Dependencies: Terraform automatically infers dependencies when one resource references an attribute of another (e.g. `subnet_id = aws_subnet.main.id`). Terraform creates the subnet first automatically.\n- Explicit Dependencies (`depends_on = [aws_iam_role_policy.s3_access]`): Manually specified when a dependency exists at the application/permission level that Terraform cannot detect via attribute references.',
  ],
  [
    'How do you safely import existing cloud resources into Terraform without deleting them?',
    '1. Write the resource block in your `.tf` file matching the existing resource configuration.\n2. Run `terraform import <resource_type>.<resource_name> <cloud_id>` (e.g. `terraform import aws_s3_bucket.assets my-bucket-name`).\n3. Run `terraform plan` to verify the state matches your code and no unintended destructive changes are planned.\n(In Terraform 1.5+, you can also use declarative `import { to = ... id = ... }` blocks).',
  ],
  [
    'What is the purpose of the `lifecycle` block (`prevent_destroy`, `create_before_destroy`, `ignore_changes`)?',
    '- `prevent_destroy = true`: Rejects any plan that would destroy the resource (safety guard for databases/buckets).\n- `create_before_destroy = true`: Provisions the replacement resource before tearing down the old one (useful for zero-downtime updates).\n- `ignore_changes = [tags, ami]`: Tells Terraform to ignore drift on specific attributes modified by external systems (e.g. autoscaling groups or security taggers).',
  ],
  [
    'What are Terraform Modules and what is the standard file structure?',
    'Modules are self-contained packages of Terraform configurations that manage a group of related resources together (e.g. a VPC module creating subnets, route tables, and gateways).\nStandard structure:\n- `main.tf`: Resource definitions\n- `variables.tf`: Input variable declarations\n- `outputs.tf`: Exported attributes\n- `README.md`: Documentation on inputs/outputs.',
  ],
]
