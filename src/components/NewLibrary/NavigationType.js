export const NavigationType = {
  // 数据层级结构：mainsubject-subsubject-year-knowledge
  learningOutcomes: 'learningOutcomes',
  // 数据层级结构：mainsubject-year-knowledge
  specificSkills: 'specificSkills',
  // 数据层级结构：year-knowledge
  centurySkills: 'centurySkills',
  // NZ和AU对21 century叫法不同NZ-Key competencies、AU-General capabilities，内容逻辑一样
  NZKeyCompetencies: 'NZ-Key competencies',
  AUGeneralCapabilities: 'AU-General capabilities',

  // sdg数据结构：sdg列表-keywords-big idea
  sdg: 'sdg',
  // assessmentType
  assessmentType: 'assessmentType',
  // 同步其他人link后的数据
  sync: 'sync',
  // 二十一世纪大纲，evaluation选择用
  all21Century: 'all21Century',
  // idu grade-idu
  idu: 'idu'
}
