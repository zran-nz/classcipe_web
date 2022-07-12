// search(json['Learning outcomes'], ['Science'], ['Year 1'], 'recognizing')
export const CurriculumSearch = (list, subjects, levels, keyword) => {
  const _st = Date.now()
  const year = list.__year
  if (!Array.isArray(subjects)) subjects = null
  else if (subjects?.length === 0) subjects = null
  if (!Array.isArray(levels)) levels = null
  else if (levels.length === 0) levels = null
  if (keyword) keyword = keyword.toLowerCase()
  const subSearch = (obj, lrr) => {
    let arr = []
    if (Array.isArray(obj)) {
      return obj.filter(v => {
        v.path = lrr
        if (!keyword) return { ...v }
        if (v.desc.toLowerCase().includes(keyword)) return { ...v }
      })
    }
    const keys = levels && year === lrr.length ? levels : Object.keys(obj)
    keys.map((k) => {
      if (!obj[k]) return
      arr = arr.concat(subSearch(obj[k], [...lrr, k]))
    })
    return arr
  }
  let arr = []
  for (const subject of subjects || Object.keys(list)) {
    console.log(subject)
    if (!list[subject] || subject.startsWith('__')) continue
    arr = arr.concat(subSearch(list[subject], [subject]))
  }
  console.log('search:', Date.now() - _st)
  return arr
}

/**
 * 生成cascader组件所需要的解构
 * @param GeneralCapabilitiesObj
 * @constructor
 */
export const GeneralCapabilitiesFormat = (GeneralCapabilitiesObj) => {
  const getKeyAndChildren = (obj) => {
     return obj ? Object.keys(obj).map(v => {
      return {
        value: v,
        label: v,
        children: Array.isArray(obj[v]) ? obj[v].map(s => {
          s.value = s.desc
          s.label = s.desc
          return s
        }) : getKeyAndChildren(obj[v])
      }
    }) : []
  }
  return getKeyAndChildren(GeneralCapabilitiesObj)
}
