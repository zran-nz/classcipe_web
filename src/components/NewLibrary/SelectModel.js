/**
 * <NewBrowser />组件不同业务场景有不同的特性，根据select-mode来区分
 * @type {{knowledgeDescription: string, syncData: string, evaluationMode: string}}
 */
export const SelectModel = {
  knowledgeDescription: 'knowledgeDescription',
  syncData: 'syncData',
  evaluationMode: 'evaluationMode' // 评估表模式，21世纪评估表上老师可以对grade下的任意层级进行点评
}
