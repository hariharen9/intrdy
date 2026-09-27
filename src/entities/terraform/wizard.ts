import type { WizardNode } from '@/entities/topic'

export const TERRAFORM_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: "What Terraform error or dilemma are you running into?",
    options: [
      { label: "Error acquiring the state lock ('Lock Info: ... ID: xxxxx-xxxx')", next: "state_lock_error" },
      { label: "Provider authentication / credentials error (e.g. AWS/Azure NoCredentialProviders)", next: "provider_auth" },
      { label: "Resource already exists / EntityAlreadyExists error on apply", next: "resource_exists" },
      { label: "Error: Cycle dependency detected (Resource A depends on B, and B on A)", next: "cycle_error" },
      { label: "Terraform plan wants to destroy and recreate my resource unexpectedly", next: "destructive_plan" },
      { label: "Error: Reference to undeclared input variable or output", next: "undeclared_var" },
    ],
  },

  state_lock_error: {
    result: true,
    title: "Resolve Stale State Lock",
    body: "When Terraform runs `apply` with a remote backend (like DynamoDB or Azure Blob), it locks state so two people can't apply at once. If your terminal crashed or CI job was cancelled mid-run, the lock remains stuck.",
    cmds: [
      "# 1. First verify no teammate or CI pipeline is currently running an active apply!",
      "",
      "# 2. Unlock state using the Lock ID shown in your error message:",
      "terraform force-unlock <LOCK_ID>",
      "",
      "# Example: terraform force-unlock 1b4f8e91-7299-4781-a901-ecb731c28b99",
      "",
      "# 3. Run plan again to verify state is accessible:",
      "terraform plan",
    ],
  },

  provider_auth: {
    result: true,
    title: "Configure Cloud Provider Authentication",
    body: "Terraform needs credentials to communicate with cloud APIs (AWS, Azure, Google Cloud). Never hardcode API keys directly inside `.tf` files!",
    cmds: [
      "# For AWS:",
      "# Option A: Set environment variables in your terminal session:",
      "export AWS_ACCESS_KEY_ID='AKIA...'",
      "export AWS_SECRET_ACCESS_KEY='wJalr...'",
      "export AWS_REGION='us-east-1'",
      "",
      "# Option B: Use AWS CLI profile:",
      "aws configure --profile dev",
      "export AWS_PROFILE='dev'",
      "",
      "# For Azure / GCP: Run the official CLI login:",
      "# az login  /  gcloud auth application-default login",
    ],
  },

  resource_exists: {
    result: true,
    title: "Adopt Existing Cloud Resources with 'terraform import'",
    body: "If a resource was created manually in the AWS Console (ClickOps) and you now declared it in Terraform, Terraform tries to create it again and fails with 'already exists'. You must import it into your state file.",
    cmds: [
      "# 1. Make sure the resource block is written in your .tf file:",
      "# resource \"aws_s3_bucket\" \"app_assets\" { bucket = \"my-existing-bucket\" }",
      "",
      "# 2. Import the existing cloud resource ID into Terraform state:",
      "terraform import aws_s3_bucket.app_assets my-existing-bucket",
      "",
      "# (In Terraform 1.5+, you can also use declarative 'import' blocks inside .tf files):",
      "# import {",
      "#   to = aws_s3_bucket.app_assets",
      "#   id = \"my-existing-bucket\"",
      "# }",
    ],
  },

  cycle_error: {
    result: true,
    title: "Fix Circular (Cycle) Dependency",
    body: "Terraform builds a Directed Acyclic Graph (DAG). If Resource A references an attribute of Resource B, and Resource B references Resource A, Terraform cannot determine which to create first.",
    cmds: [
      "# Common Example: EC2 Security Group referencing an Instance, while Instance references Security Group.",
      "",
      "# Fix: Break the circular link by creating separate rule resources:",
      "# Instead of inline security group rules, use standalone 'aws_security_group_rule' resources,",
      "# or create the security group first and reference its ID in the instance.",
    ],
  },

  destructive_plan: {
    result: true,
    title: "Prevent Unexpected Resource Recreation",
    body: "Certain cloud attributes (like changing a Subnet CIDR, changing an S3 bucket name, or changing KMS keys) are 'Forces New Resource' by cloud API design.",
    cmds: [
      "# 1. Inspect the diff in `terraform plan` for '~' (update in-place) vs '-/+' (destroy and recreate).",
      "",
      "# 2. Use lifecycle prevent_destroy to guard critical databases / storage:",
      "# resource \"aws_db_instance\" \"db\" {",
      "#   ...",
      "#   lifecycle {",
      "#     prevent_destroy = true",
      "#   }",
      "# }",
      "",
      "# 3. If external changes caused drift you want to ignore, use ignore_changes:",
      "# lifecycle { ignore_changes = [tags[\"CostCenter\"]] }",
    ],
  },

  undeclared_var: {
    result: true,
    title: "Resolve Undeclared Variable / Reference Errors",
    body: "You referenced `var.something` in `main.tf`, but forgot to declare `variable \"something\" {}` in `variables.tf`, or misspelled the variable name.",
    cmds: [
      "# 1. Open variables.tf and add the declaration:",
      "variable \"environment\" {",
      "  type        = string",
      "  description = \"Deployment environment (dev, staging, prod)\"",
      "  default     = \"dev\"",
      "}",
      "",
      "# 2. In your terraform.tfvars, assign the value:",
      "environment = \"production\"",
    ],
  },
}
