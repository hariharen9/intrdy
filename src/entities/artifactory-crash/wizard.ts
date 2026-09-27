import type { WizardNode } from '@/entities/topic'

export const ARTIFACTORY_CRASH_WIZARD_TREE: Record<string, WizardNode> = {
  "start": {
    "q": "What Artifactory issue are you experiencing?",
    "options": [
      {
        "label": "Docker login / pull / push returns 401 Unauthorized or 403 Forbidden",
        "next": "auth_err"
      },
      {
        "label": "Remote repository fails to download upstream package (502 / timeout)",
        "next": "remote_err"
      },
      {
        "label": "Artifactory storage disk is 95%+ full",
        "next": "storage_full"
      },
      {
        "label": "JFrog Xray blocked deployment with policy violation",
        "next": "xray_block"
      }
    ]
  },
  "auth_err": {
    "result": true,
    "title": "Fix Authentication & Permission Issues",
    "body": "Docker, NPM, or Maven returned 401 Unauthorized or 403 Forbidden.",
    "cmds": [
      "# 1. Generate an Identity Access Token in User Profile > Access Tokens",
      "# Do NOT use your interactive SSO password with CLI tools.",
      "",
      "# 2. Authenticate Docker with your token:",
      "docker login mycompany.jfrog.io -u user@example.com -p <ACCESS_TOKEN>"
    ]
  },
  "remote_err": {
    "result": true,
    "title": "Fix Remote Repository Upstream Download Failures",
    "body": "Artifactory remote proxy cannot connect to public registry (Docker Hub/NPM).",
    "cmds": [
      "# 1. Check corporate HTTP proxy configuration in Artifactory Administration > Services > Proxies",
      "",
      "# 2. Add authenticated Docker Hub account to avoid anonymous rate limits."
    ]
  },
  "storage_full": {
    "result": true,
    "title": "Free Up Artifactory Storage Space",
    "body": "Storage volume is nearing 100% capacity.",
    "cmds": [
      "# 1. Trigger Garbage Collection in Administration > Monitoring > Storage",
      "",
      "# 2. Configure an Artifact Cleanup Rule to prune snapshots older than 14 days."
    ]
  },
  "xray_block": {
    "result": true,
    "title": "Resolve JFrog Xray Security Block",
    "body": "Xray prevented promotion due to critical CVEs or license violation.",
    "cmds": [
      "# 1. View vulnerable dependency path in Xray Component Analysis",
      "# 2. Upgrade the direct package dependency in your pom.xml / package.json."
    ]
  }
}
