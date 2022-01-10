// 表头类型，既表单每列的字段类型（不同类型对应的字段可以有不同的操作、展示逻辑）
const EvaluationTableHeader = {
  Criteria: 'criteria',
  AchievementLevel: 'achievementLevel',
  LevelDescriptor: 'levelDescriptor',
  Description: 'description',
  Indicators: 'indicators',
  Comment: 'comment',
  Evidence: 'evidence',
  Novice: 'novice',
  Learner: 'learner',
  Practitoner: 'practitoner',
  Expert: 'expert',
  UserDefine: 'user_define_' // 用戶自定的表头，示例：user_define__1、user_define__2
}

export default EvaluationTableHeader
