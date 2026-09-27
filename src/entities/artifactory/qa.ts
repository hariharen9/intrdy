import type { QAItem } from '@/entities/topic'

export const artifactoryQAFundamentals: QAItem[] = [
  [
    "Artifact Repository",
    "A versioned store of immutable binaries (JARs, wheels, images) addressed by coordinate."
  ],
  [
    "Container Registry",
    "A registry specifically for OCI-compliant container images."
  ],
  [
    "Local Repository",
    "Stores artifacts pushed directly to this Artifactory instance."
  ],
  [
    "Remote Repository",
    "Caching proxy of an upstream source like Maven Central or Docker Hub."
  ],
  [
    "Virtual Repository",
    "Aggregates multiple local + remote repos behind a single URL."
  ],
  [
    "Federated Repository",
    "Bidirectional, active-active sync between multiple Artifactory instances."
  ],
  [
    "OCI Distribution Spec",
    "The standard protocol every modern container registry speaks."
  ],
  [
    "Digest",
    "Content-addressed SHA256 identifier of an image — immutable."
  ],
  [
    "Tag",
    "Mutable pointer from a name like :1.27.0 to a digest."
  ],
  [
    "Manifest List",
    "OCI index pointing to per-platform manifests for multi-arch support."
  ]
]

export const artifactoryQAAdvanced: QAItem[] = [
  [
    "Build Info",
    "Metadata recording producer, dependencies, environment, and timing of a CI run."
  ],
  [
    "Binarystore.xml",
    "Config file defining the chain of binary storage providers."
  ],
  [
    "Router",
    "Process fronting HA clusters, handling TLS and request routing."
  ],
  [
    "Reference Token",
    "Modern revocable token replacing legacy API keys."
  ],
  [
    "Access Token",
    "JWT with scopes like read:repo:libs-release, preferred for CI."
  ],
  [
    "OIDC Federation",
    "Machine auth pattern where CI emits JWTs exchanged for access tokens."
  ],
  [
    "Xray",
    "JFrog supply-chain scanner for CVEs, licenses, and secrets."
  ],
  [
    "Watch / Policy / Rule",
    "Xray abstraction hierarchy for applying security checks."
  ],
  [
    "AQL",
    "Artifactory Query Language — SQL-like queries over artifact metadata."
  ],
  [
    "SNAPSHOT",
    "Mutable Maven version, retained by Max Unique Snapshots setting."
  ],
  [
    "Smart Remote",
    "Remote repo whose upstream is another Artifactory, with optimized behavior."
  ],
  [
    "Cache-fs",
    "Storage provider caching recent binaries on local SSD."
  ],
  [
    "Promotion",
    "Moving a build's artifacts between environment-specific repos without rebuilding."
  ],
  [
    "Replication",
    "Unidirectional sync between Artifactory instances (push or pull)."
  ],
  [
    "RPO / RTO",
    "Recovery Point Objective (data loss tolerance) / Recovery Time Objective (time to restore)."
  ]
]
