import type { WizardNode } from '@/entities/topic'

export const TERRAFORM_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: 'What type of Terraform or OpenTofu production issue are you diagnosing?',
    options: [
      { label: 'State Lock Error: "Error acquiring the state lock / ConditionalCheckFailed"', next: 'state_lock_stuck' },
      { label: 'Resource Already Exists: "409 Conflict / ResourceAlreadyExists"', next: 'resource_already_exists' },
      { label: 'Dependency Cycle: "Error: Cycle: aws_security_group..."', next: 'cycle_error' },
      { label: 'Unintended Resource Re-creation / Destruction on Apply', next: 'unintended_replace' },
      { label: 'Provider Plugin or Version Constraint Conflict', next: 'provider_conflict' },
      { label: 'Refactoring / Renaming Resource without Destroying Live Assets', next: 'refactor_move' },
    ],
  },

  // 1. State lock stuck
  state_lock_stuck: {
    result: true,
    title: 'Force Unlock a Stuck DynamoDB State Lock',
    body: 'When a previous `terraform apply` was cancelled abruptly (Ctrl+C, CI/CD runner killed, or network dropout), the DynamoDB lock entry remains in place, blocking subsequent executions.',
    cmds: [
      '# 1. Read the Lock ID from the Terraform error output:',
      '# "Lock Info: ID: e81b2c45-9812-4f12-b5e1-881249fa1b02"',
      '# 2. Confirm no one else or no CI/CD pipeline is currently running apply!',
      '# 3. Release the lock using the force-unlock command:',
      'terraform force-unlock <LOCK_ID>',
      '# Example:',
      'terraform force-unlock e81b2c45-9812-4f12-b5e1-881249fa1b02',
    ],
  },

  // 2. Resource already exists
  resource_already_exists: {
    result: true,
    title: 'Adopt Existing Cloud Resource into Terraform State',
    body: 'This happens when a cloud resource was created manually via ClickOps or another script, and Terraform attempts to create it with the same name, resulting in a 409 Conflict.',
    cmds: [
      '# Option A: In Terraform 1.5+, use declarative import block in your code:',
      'import {\n  to = aws_s3_bucket.my_bucket\n  id = "my-existing-bucket-name"\n}',
      '# Then run plan to generate configuration attributes:',
      'terraform plan -generate-config-out=generated.tf',
      '# Option B: CLI import (legacy):',
      'terraform import aws_s3_bucket.my_bucket my-existing-bucket-name',
    ],
  },

  // 3. Cycle Error
  cycle_error: {
    result: true,
    title: 'Resolve Directed Acyclic Graph (DAG) Cycle Errors',
    body: 'Cycles occur when Resource A references Resource B, and Resource B simultaneously references Resource A (e.g., Security Group A allows Security Group B, and Security Group B allows Security Group A).',
    cmds: [
      '# Generate visual dependency graph to pinpoint the circular loop:',
      'terraform graph | dot -Tsvg > graph.svg',
      '# FIX: Decouple the bidirectional references by creating standalone child resources:',
      '# Instead of inline "ingress" blocks inside aws_security_group, use separate "aws_security_group_rule" resources:',
      'resource "aws_security_group_rule" "allow_app_to_db" {\n  type                     = "ingress"\n  from_port                = 5432\n  to_port                  = 5432\n  protocol                 = "tcp"\n  security_group_id        = aws_security_group.db.id\n  source_security_group_id = aws_security_group.app.id\n}',
    ],
  },

  // 4. Unintended replace
  unintended_replace: {
    result: true,
    title: 'Prevent Destructive Resource Replacement on Apply',
    body: 'Certain cloud attributes (like changing a subnet CIDR, an EC2 AMI, or S3 bucket name) cannot be updated in-place by the cloud API, causing Terraform to plan a destructive `- / + replace`.',
    cmds: [
      '# 1. Use lifecycle { create_before_destroy = true } for zero-downtime swap:',
      'resource "aws_instance" "web" {\n  # ...\n  lifecycle {\n    create_before_destroy = true\n  }\n}',
      '# 2. Prevent accidental destruction of databases or critical storage:',
      'resource "aws_db_instance" "production" {\n  # ...\n  lifecycle {\n    prevent_destroy = true\n  }\n}',
      '# 3. Ignore external out-of-band updates (e.g. autoscaling tags or replica counts):',
      'lifecycle {\n  ignore_changes = [tags, desired_capacity]\n}',
    ],
  },

  // 5. Provider conflict
  provider_conflict: {
    result: true,
    title: 'Resolve Provider Plugin Version Conflicts & Lock File Issues',
    body: 'Occurs when different modules specify incompatible version constraints or the `.terraform.lock.hcl` file is out of sync across OS architectures (macOS ARM vs Linux AMD64).',
    cmds: [
      '# 1. Re-initialize and upgrade providers to the latest allowed version:',
      'terraform init -upgrade',
      '# 2. Update multi-platform checksums in .terraform.lock.hcl for CI/CD runners:',
      'terraform providers lock -platform=windows_amd64 -platform=darwin_arm64 -platform=linux_amd64',
    ],
  },

  // 6. Refactor move
  refactor_move: {
    result: true,
    title: 'Refactor Resource / Move into Module with Zero Downtime',
    body: 'When you rename a resource or extract it into a reusable module, Terraform by default thinks you deleted the old resource and wants to create a new one. `moved {}` blocks tell Terraform it was simply renamed!',
    cmds: [
      '# Add a moved block to your .tf file (DO NOT destroy resources):',
      'moved {\n  from = aws_instance.web\n  to   = module.compute.aws_instance.web\n}',
      '# Or for simple renaming within root module:',
      'moved {\n  from = aws_s3_bucket.old_name\n  to   = aws_s3_bucket.new_name\n}',
      '# When you run "terraform plan", it will show:\n# "aws_instance.web has moved to module.compute.aws_instance.web"\n# with 0 resources destroyed or recreated!',
    ],
  },
}
