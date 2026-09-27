import type { WizardNode } from '@/entities/topic'

export const ARTIFACTORY_WIZARD_TREE: Record<string, WizardNode> = {
  "start": {
    "q": "What Artifactory or Container Registry issue are you troubleshooting?",
    "options": [
      {
        "label": "CI builds randomly fail with \"404 not found\" for common Maven dependencies like commons-lang3....",
        "next": "scenario_1"
      },
      {
        "label": "Docker push to Artifactory returns \"unauthorized: authentication required\" even with correct cr...",
        "next": "scenario_2"
      },
      {
        "label": "A newly added HA node returns 404 for artifacts that exist on the primary node....",
        "next": "scenario_3"
      },
      {
        "label": "Artifact disk usage is growing 10 GB per day and you're running out of space....",
        "next": "scenario_4"
      },
      {
        "label": "Docker pulls are slow (10+ seconds) for images that should be cached....",
        "next": "scenario_5"
      },
      {
        "label": "Xray reports no vulnerabilities, but a known CVE exists in a transitive dependency....",
        "next": "scenario_6"
      },
      {
        "label": "Build info shows dependencies from an unexpected Artifactory instance....",
        "next": "scenario_7"
      },
      {
        "label": "After a failed Artifactory upgrade, all API calls return 503 but the process is running....",
        "next": "scenario_8"
      }
    ]
  },
  "scenario_1": {
    "result": true,
    "title": "Scenario 1: CI builds randomly fail with \"404 not found\" for common Maven dependencies like commons-lang3.",
    "body": "Diagnosis: Direct Maven Central access (not via Artifactory) is being rate-limited or the upstream had a transient outage. Or the virtual repo doesn't include the remote proxy.\n\nFix: Route all Maven traffic through a virtual repo that aggregates a remote proxy of Maven Central. Enable \"Assumed Offline\" so cached content is served during outages.",
    "cmds": [
      "# Symptom: CI builds randomly fail with \"404 not found\" for common Maven dependencies like commons-lang3.",
      "# Diagnosis: Direct Maven Central access (not via Artifactory) is being rate-limited or the upstream had a transient outage. Or the virtual repo doesn't include the remote proxy.",
      "# Actionable Fix:",
      "Route all Maven traffic through a virtual repo that aggregates a remote proxy of Maven Central. Enable \"Assumed Offline\" so cached content is served during outages."
    ]
  },
  "scenario_2": {
    "result": true,
    "title": "Scenario 2: Docker push to Artifactory returns \"unauthorized",
    "body": "Diagnosis: Most likely: password contains special characters not URL-encoded in docker login, or the token has expired (default token TTL is often short). Alternatively, \"Encrypted Password\" is enabled and you're using the plaintext one.\n\nFix: Generate a fresh scoped access token and pass it to docker login. Verify the repo permissions include the user/group. Check the \"Encrypted Password\" setting in user profile.",
    "cmds": [
      "# Symptom: Docker push to Artifactory returns \"unauthorized: authentication required\" even with correct credentials.",
      "# Diagnosis: Most likely: password contains special characters not URL-encoded in docker login, or the token has expired (default token TTL is often short). Alternatively, \"Encrypted Password\" is enabled and you're using the plaintext one.",
      "# Actionable Fix:",
      "Generate a fresh scoped access token and pass it to docker login. Verify the repo permissions include the user/group. Check the \"Encrypted Password\" setting in user profile."
    ]
  },
  "scenario_3": {
    "result": true,
    "title": "Scenario 3: A newly added HA node returns 404 for artifacts that exist on the primary node.",
    "body": "Diagnosis: The new node's filestore is not seeing the same bytes — typically because the cluster is using the default local-filesystem storage (each node has its own disk) instead of shared storage.\n\nFix: Configure binarystore.xml to use S3 or shared NFS. Migrate existing binaries. Remove the misconfigured node from the cluster. Add nodes only after shared storage is working.",
    "cmds": [
      "# Symptom: A newly added HA node returns 404 for artifacts that exist on the primary node.",
      "# Diagnosis: The new node's filestore is not seeing the same bytes — typically because the cluster is using the default local-filesystem storage (each node has its own disk) instead of shared storage.",
      "# Actionable Fix:",
      "Configure binarystore.xml to use S3 or shared NFS. Migrate existing binaries. Remove the misconfigured node from the cluster. Add nodes only after shared storage is working."
    ]
  },
  "scenario_4": {
    "result": true,
    "title": "Scenario 4: Artifact disk usage is growing 10 GB per day and you're running out of space.",
    "body": "Diagnosis: SNAPSHOT retention is unbounded, Docker images accumulate without cleanup, or build outputs are never pruned. Check Max Unique Snapshots setting and cleanup policies.\n\nFix: Set Max Unique Snapshots to 5-10 on SNAPSHOT repos. Create an AQL-based cleanup job for Docker images not pulled in 90 days. Route to a trash repo for 30 days before hard delete.",
    "cmds": [
      "# Symptom: Artifact disk usage is growing 10 GB per day and you're running out of space.",
      "# Diagnosis: SNAPSHOT retention is unbounded, Docker images accumulate without cleanup, or build outputs are never pruned. Check Max Unique Snapshots setting and cleanup policies.",
      "# Actionable Fix:",
      "Set Max Unique Snapshots to 5-10 on SNAPSHOT repos. Create an AQL-based cleanup job for Docker images not pulled in 90 days. Route to a trash repo for 30 days before hard delete."
    ]
  },
  "scenario_5": {
    "result": true,
    "title": "Scenario 5: Docker pulls are slow (10+ seconds) for images that should be cached.",
    "body": "Diagnosis: Cache-fs is too small, causing constant misses and S3 round-trips. Or the cache-fs directory is on slow HDD instead of SSD.\n\nFix: Increase maxCacheSize to cover your working set (typically 50 GB). Move cacheProviderDir to local NVMe SSD. Monitor cache hit ratio — target > 80%.",
    "cmds": [
      "# Symptom: Docker pulls are slow (10+ seconds) for images that should be cached.",
      "# Diagnosis: Cache-fs is too small, causing constant misses and S3 round-trips. Or the cache-fs directory is on slow HDD instead of SSD.",
      "# Actionable Fix:",
      "Increase maxCacheSize to cover your working set (typically 50 GB). Move cacheProviderDir to local NVMe SSD. Monitor cache hit ratio — target > 80%."
    ]
  },
  "scenario_6": {
    "result": true,
    "title": "Scenario 6: Xray reports no vulnerabilities, but a known CVE exists in a transitive dependency.",
    "body": "Diagnosis: Xray's vulnerability database is out of date — the instance can't reach JFrog's cloud feed, or sync hasn't happened in hours.\n\nFix: Check Administration → Xray → Security → Database Sync. Verify network egress to https://releases.jfrog.io. If air-gapped, set up manual feed sync via export/import.",
    "cmds": [
      "# Symptom: Xray reports no vulnerabilities, but a known CVE exists in a transitive dependency.",
      "# Diagnosis: Xray's vulnerability database is out of date — the instance can't reach JFrog's cloud feed, or sync hasn't happened in hours.",
      "# Actionable Fix:",
      "Check Administration → Xray → Security → Database Sync. Verify network egress to https://releases.jfrog.io. If air-gapped, set up manual feed sync via export/import."
    ]
  },
  "scenario_7": {
    "result": true,
    "title": "Scenario 7: Build info shows dependencies from an unexpected Artifactory instance.",
    "body": "Diagnosis: JFROG_CLI_SERVER_ID in CI is pointing to the wrong configured server, or ~/.jfrog config was copied from a colleague's dev machine.\n\nFix: Audit CI environment variables. Use OIDC federation instead of server IDs so the identity comes from the CI system, not a local config file.",
    "cmds": [
      "# Symptom: Build info shows dependencies from an unexpected Artifactory instance.",
      "# Diagnosis: JFROG_CLI_SERVER_ID in CI is pointing to the wrong configured server, or ~/.jfrog config was copied from a colleague's dev machine.",
      "# Actionable Fix:",
      "Audit CI environment variables. Use OIDC federation instead of server IDs so the identity comes from the CI system, not a local config file."
    ]
  },
  "scenario_8": {
    "result": true,
    "title": "Scenario 8: After a failed Artifactory upgrade, all API calls return 503 but the process is running.",
    "body": "Diagnosis: The router process is up but the app is in a degraded state — likely a schema migration failed or the database is read-only.\n\nFix: Check /var/opt/jfrog/artifactory/var/log/artifactory-service.log for migration errors. Verify DB connectivity and permissions. Roll back the app version while keeping the DB schema, then retry the upgrade with pre-flight checks.",
    "cmds": [
      "# Symptom: After a failed Artifactory upgrade, all API calls return 503 but the process is running.",
      "# Diagnosis: The router process is up but the app is in a degraded state — likely a schema migration failed or the database is read-only.",
      "# Actionable Fix:",
      "Check /var/opt/jfrog/artifactory/var/log/artifactory-service.log for migration errors. Verify DB connectivity and permissions. Roll back the app version while keeping the DB schema, then retry the upgrade with pre-flight checks."
    ]
  }
}
