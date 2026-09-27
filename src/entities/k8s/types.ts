// K8s uses the same generic course data types defined in the docker entity.
// We re-export from the public API (not deep imports) to stay FSD-compliant.
export type {
  FlowStepItem,
  StackLayerItem,
  TopicBlock,
  TopicGroup,
  Topic,
  QAItem,
  WizardOption,
  WizardNode,
  CoursePart,
  CourseMetadata,
  CourseData,
} from '@/entities/docker'
