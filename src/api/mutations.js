import gql from 'graphql-tag'
import {
  FRAGMENT_TenantFields,
  FRAGMENT_OrgFields,
  FRAGMENT_ItemFields,
  FRAGMENT_ItemTypeFields,
  FRAGMENT_EndUserFields,
  FRAGMENT_EndUserInfoFields,
  FRAGMENT_GroupFields,
  FRAGMENT_ActionFields,
  FRAGMENT_ActionTypeFields,
  FRAGMENT_LocationFields
} from './fragments'

export const MUTATION_createTenant = gql`
  mutation createTenant(
    $tenant: TenantInput!
  ) {
    createTenant(
      tenant: $tenant
    ) {
      ...TenantFields
    }
  }
  ${FRAGMENT_TenantFields}
`

export const MUTATION_updateTenant = gql`
  mutation updateTenant(
    $tenant: TenantInputUpdate!
  ) {
    updateTenant(
      tenant: $tenant
    ) {
      ...TenantFields
    }
  }
  ${FRAGMENT_TenantFields}
`

export const MUTATION_deleteTenant = gql`
  mutation deleteTenant(
    $tenantId: String!
  ) {
    deleteTenant(
      tenantId: $tenantId
    )
  }
`


export const MUTATION_createOrg = gql`
  mutation createOrg(
    $org: OrgInput!
  ) {
    createOrg(
      org: $org
    ) {
      ...OrgFields
    }
  }
  ${FRAGMENT_OrgFields}
`

export const MUTATION_updateOrg = gql`
  mutation updateOrg(
    $org: OrgInputUpdate!
  ) {
    updateOrg(
      org: $org
    ) {
      ...OrgFields
    }
  }
  ${FRAGMENT_OrgFields}
`

export const MUTATION_deleteOrg = gql`
  mutation deleteOrg(
    $orgId: String!
  ) {
    deleteOrg(
      orgId: $orgId
    )
  }
`


export const MUTATION_createItem = gql`
  mutation createItem(
    $item: ItemInput!
  ) {
    createItem(
      item: $item
    ) {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`

export const MUTATION_updateItem = gql`
  mutation updateItem(
    $item: ItemInputUpdate!
  ) {
    updateItem(
      item: $item
    ) {
      ...ItemFields
    }
  }
  ${FRAGMENT_ItemFields}
`

export const MUTATION_deleteItem = gql`
  mutation deleteItem(
    $itemId: String!
  ) {
    deleteItem(
      itemId: $itemId
    )
  }
`


export const MUTATION_createItemType = gql`
  mutation createItemType(
    $itemType: ItemTypeInput!
  ) {
    createItemType(
      itemType: $itemType
    ) {
      ...ItemTypeFields
    }
  }
  ${FRAGMENT_ItemTypeFields}
`

export const MUTATION_updateItemType = gql`
  mutation updateItemType(
    $itemType: ItemTypeInputUpdate!
  ) {
    updateItemType(
      itemType: $itemType
    ) {
      ...ItemTypeFields
    }
  }
  ${FRAGMENT_ItemTypeFields}
`

export const MUTATION_deleteItemType = gql`
  mutation deleteItemType(
    $itemTypeId: String!
  ) {
    deleteItemType(
      itemTypeId: $itemTypeId
    )
  }
`


export const MUTATION_createEndUser = gql`
  mutation createEndUser(
    $endUser: EndUserInput!
  ) {
    createEndUser(
      endUser: $endUser
    ) {
      ...EndUserFields
    }
  }
  ${FRAGMENT_EndUserFields}
`

export const MUTATION_updateEndUser = gql`
  mutation updateEndUser(
    $endUser: EndUserInputUpdate!
  ) {
    updateEndUser(
      endUser: $endUser
    ) {
      ...EndUserFields
    }
  }
  ${FRAGMENT_EndUserFields}
`

export const MUTATION_verifyEndUserEmailRequest = gql`
  mutation verifyEndUserEmailRequest(
    $endUser: EndUserInputUpdate!
  ) {
    verifyEndUserEmailRequest(
      endUser: $endUser
    )
  }
`

export const MUTATION_verifyEndUserEmailConfirm = gql`
  mutation verifyEndUserEmailConfirm(
    $endUserToken: String!
  ) {
    verifyEndUserEmailConfirm(
      endUserToken: $endUserToken
    )
  }
`

export const MUTATION_deleteEndUser = gql`
  mutation deleteEndUser(
    $endUserId: String!
  ) {
    deleteEndUser(
      endUserId: $endUserId
    )
  }
`


export const MUTATION_createEndUserInfo = gql`
  mutation createEndUserInfo(
    $endUserInfo: EndUserInfoInput!
  ) {
    createEndUserInfo(
      endUserInfo: $endUserInfo
    ) {
      ...EndUserInfoFields
    }
  }
  ${FRAGMENT_EndUserInfoFields}
`

export const MUTATION_updateEndUserInfo = gql`
  mutation updateEndUserInfo(
    $endUserInfo: EndUserInfoInputUpdate!
  ) {
    updateEndUserInfo(
      endUserInfo: $endUserInfo
    ) {
      ...EndUserInfoFields
    }
  }
  ${FRAGMENT_EndUserInfoFields}
`
export const MUTATION_inviteEndUserRequest = gql`
  mutation inviteEndUserRequest(
    $endUserInfo: EndUserInfoInput!
  ) {
    inviteEndUserRequest(
      endUserInfo: $endUserInfo
    ) {
      ...EndUserInfoFields
    }
  }
  ${FRAGMENT_EndUserInfoFields}
`

export const MUTATION_inviteEndUserConfirm = gql`
  mutation inviteEndUserConfirm(
    $endUserInfoToken: String!
  ) {
    inviteEndUserConfirm(
      endUserInfoToken: $endUserInfoToken
    )
  }
`

export const MUTATION_deleteEndUserInfo = gql`
  mutation deleteEndUserInfo(
    $endUserInfoId: String!
  ) {
    deleteEndUserInfo(
      endUserInfoId: $endUserInfoId
    )
  }
`


export const MUTATION_createGroup = gql`
  mutation createGroup(
    $group: GroupInput!
  ) {
    createGroup(
      group: $group
    ) {
      ...GroupFields
    }
  }
  ${FRAGMENT_GroupFields}
`

export const MUTATION_updateGroup = gql`
  mutation updateGroup(
    $group: GroupInputUpdate!
  ) {
    updateGroup(
      group: $group
    ) {
      ...GroupFields
    }
  }
  ${FRAGMENT_GroupFields}
`

export const MUTATION_deleteGroup = gql`
  mutation deleteGroup(
    $groupId: String!
  ) {
    deleteGroup(
      groupId: $groupId
    )
  }
`


export const MUTATION_createAction = gql`
  mutation createAction(
    $action: ActionInput!
  ) {
    createAction(
      action: $action
    ) {
      ...ActionFields
    }
  }
  ${FRAGMENT_ActionFields}
`

export const MUTATION_updateAction = gql`
  mutation updateAction(
    $action: ActionInputUpdate!
  ) {
    updateAction(
      action: $action
    ) {
      ...ActionFields
    }
  }
  ${FRAGMENT_ActionFields}
`

export const MUTATION_deleteAction = gql`
  mutation deleteAction(
    $actionId: String!
  ) {
    deleteAction(
      actionId: $actionId
    )
  }
`


export const MUTATION_createActionType = gql`
  mutation createActionType(
    $actionType: ActionTypeInput!
  ) {
    createActionType(
      actionType: $actionType
    ) {
      ...ActionTypeFields
    }
  }
  ${FRAGMENT_ActionTypeFields}
`

export const MUTATION_updateActionType = gql`
  mutation updateActionType(
    $actionType: ActionTypeInputUpdate!
  ) {
    updateActionType(
      actionType: $actionType
    ) {
      ...ActionTypeFields
    }
  }
  ${FRAGMENT_ActionTypeFields}
`

export const MUTATION_deleteActionType = gql`
  mutation deleteActionType(
    $actionTypeId: String!
  ) {
    deleteActionType(
      actionTypeId: $actionTypeId
    )
  }
`


export const MUTATION_createLocation = gql`
  mutation createLocation(
    $location: LocationInput!
  ) {
    createLocation(
      location: $location
    ) {
      ...LocationFields
    }
  }
  ${FRAGMENT_LocationFields}
`

export const MUTATION_updateLocation = gql`
  mutation updateLocation(
    $location: LocationInputUpdate!
  ) {
    updateLocation(
      location: $location
    ) {
      ...LocationFields
    }
  }
  ${FRAGMENT_LocationFields}
`

export const MUTATION_deleteLocation = gql`
  mutation deleteLocation(
    $locationId: String!
  ) {
    deleteLocation(
      locationId: $locationId
    )
  }
`