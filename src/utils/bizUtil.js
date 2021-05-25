/**
 * 格式化subjectTree适应cascader
 * @param subjectTree
 * @returns {*}
 */
export function formatSubjectTree (subjectTree) {
  subjectTree.forEach(subjectItem => {
    subjectItem.label = subjectItem.name
    subjectItem.value = subjectItem.id
    if (subjectItem.children && subjectItem.children.length) {
      subjectItem.children = formatSubjectTree(subjectItem.children)
    }
  })
  return subjectTree
}
