export async function appLogin(token) {
  if (window.AppLogin) {
    const result = await window.AppLogin(token)
    return Promise.resolve(result)
  } else {
    // return Promise.reject(new Error('No APP imported'))
    return Promise.resolve()
  }
}

export const isAPPExists = (App) => {
  return App && App.service && typeof App.service === 'function'
}

// { 'bloom.1': -1, 'bloom.3': 1, 'knowledge.3': -1, 'knowledge.2': 1 }
export async function incBloom(id, params) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('stats-target').patch(id, {
      $inc: params
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

// 推荐
export async function getRecommend(id) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('stats-target').get(id)
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

// // terms, tags report  { terms: 'e', tags: 'e' }
export async function addToSetTerms(id, params) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('stats-target').patch(id, {
      $addToSet: params
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

// // terms, tags report  { terms: 'e', tags: 'e' }
export async function commandTermsReport(id, bloom, terms) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('stats-target').patch(id, {
      $inc: bloom,
      $addToSet: terms
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}
