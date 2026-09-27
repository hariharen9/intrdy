import type { WizardNode } from '@/entities/topic'

export const JENKINS_CRASH_WIZARD_TREE: Record<string, WizardNode> = {
  "start": {
    "q": "Where is your Jenkins build failing?",
    "options": [
      {
        "label": "Agent offline / \"Waiting for next available executor\"",
        "next": "agent_stuck"
      },
      {
        "label": "Shell step error (exit code 1, 127 \"command not found\")",
        "next": "sh_err"
      },
      {
        "label": "Credentials error / 401 Unauthorized during git/docker push",
        "next": "cred_err"
      },
      {
        "label": "Jenkinsfile syntax error before execution starts",
        "next": "syntax_err"
      }
    ]
  },
  "agent_stuck": {
    "result": true,
    "title": "Resolve Stuck Build Queue & Offline Agents",
    "body": "The pipeline is blocked because no healthy worker node matching the requested label is online.",
    "cmds": [
      "# 1. Check node statuses in Jenkins UI:",
      "# Manage Jenkins > Nodes",
      "",
      "# 2. Check disk space warnings on nodes:",
      "# Free disk space must be above the configured threshold (default 1GB).",
      "",
      "# 3. Prune old builds to free up workspace disk space:",
      "# options { buildDiscarder(logRotator(numToKeepStr: \"10\")) }"
    ]
  },
  "sh_err": {
    "result": true,
    "title": "Fix Shell Execution Failures",
    "body": "A command in the sh step exited with a non-zero exit code or could not be found.",
    "cmds": [
      "# 1. If \"command not found\" (Exit 127), configure tool auto-installer:",
      "# pipeline { tools { nodejs \"Node-20\" } ... }",
      "",
      "# 2. Or execute inside a Docker container agent with all tools pre-installed:",
      "# agent { docker { image \"node:20-alpine\" } }",
      "",
      "# 3. To capture command return status without failing the pipeline immediately:",
      "# def status = sh(script: \"npm test\", returnStatus: true)"
    ]
  },
  "cred_err": {
    "result": true,
    "title": "Fix Credential & Authentication Errors",
    "body": "The pipeline failed to access a private Git repo, Docker registry, or cloud provider.",
    "cmds": [
      "# 1. Verify credential ID exists in Manage Jenkins > Credentials > System > Global",
      "",
      "# 2. Inject credentials cleanly in the environment block:",
      "# environment {",
      "#   DOCKER_CREDS = credentials(\"my-docker-hub-id\")",
      "# }",
      "",
      "# 3. Verify personal access token has not expired and holds \"write:packages\" scope."
    ]
  },
  "syntax_err": {
    "result": true,
    "title": "Fix Jenkinsfile Syntax Errors",
    "body": "The declarative linter rejected the pipeline structure before executing any stage.",
    "cmds": [
      "# 1. Declarative pipelines must have the root structure:",
      "# pipeline {",
      "#   agent any",
      "#   stages {",
      "#     stage(\"Build\") { steps { echo \"Hello\" } }",
      "#   }",
      "# }",
      "",
      "# 2. If using Groovy if/for loops, wrap them in a script { ... } block."
    ]
  }
}
