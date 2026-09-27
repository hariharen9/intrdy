import { CoursePage } from '@/pages/course'
import { k8sCourse } from '@/entities/k8s'

export function K8sPage() {
  return <CoursePage course={k8sCourse} />
}
