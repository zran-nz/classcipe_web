import { Associate, AssociateCancel, GetAssociate } from '@/api/teacher'

/**
 * 表单内容数据关联公用操作mixin
 * @type {{data(), created(), methods: {}}}
 */
export const AssociateMixin = {
  methods: {
    async getAssociate (fromId, fromType, published) {
      console.info(`GetAssociate fromId: ${fromId}, fromType: ${fromType}, published: ${published}`)
      const response = await GetAssociate({
        id: fromId,
        type: fromType,
        published: published
      })

      console.info('getAssociate response', response)
      response.result.owner.forEach(ownerItem => {
        const groupItem = response.result.groups.find(group => group.groupName === ownerItem.group)
        if (groupItem) {
          ownerItem.groupId = groupItem.id
          groupItem.contents = JSON.parse(JSON.stringify(ownerItem.contents))
        }
      })
      const ownerLinkList = response.result.owner
      const groups = response.result.groups

      return {
        ownerLinkList,
        groups
      }
    },

    async cancelAssociate(fromId, fromType, toId, toType) {
      const response = await AssociateCancel({
        fromId: fromId,
        fromType: fromType,
        toId: toId,
        toType: toType
      })
      console.info('cancelAssociate response', response)
      return response
    },

    async associate(fromId, fromType, others) {
      const associateData = {
        fromId,
        fromType,
        others
      }
      const response = await Associate(associateData)
      console.info('associate response', response)
    }
  }
}
