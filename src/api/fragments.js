import gql from 'graphql-tag'

export const FRAGMENT_ItemFields = gql`
  fragment ItemFields on Item {
    id
    dateCreatedAt
    modelNumber
    serialNumber
    inventoryNumber
    dateWarrantyBegins
    dateWarrantyExpires
    attachments
    itemType {
      id
      dateCreatedAt
      name
    }
    actions {
      id
      dateCreatedAt
      endUser {
        id
        name
      }
      location {
        id
        name
      }
      actionType {
        id
        name
        dateCreatedAt
        isVisibleLatest
        isVisibleNext
      }
      dateActionStart
      dateActionEnd
      attachments
    }
  }
`

// export const FRAGMENT_ItemInputFields = gql`
//   fragment ItemInputFields on ItemInput {
//     id
//     dateCreatedAt
//     modelNumber
//     serialNumber
//     dateWarrantyBegins
//     dateWarrantyExpires
//   }
// `

// export const FRAGMENT_ItemInputUpdateFields = gql`
//   fragment ItemInputUpdateFields on ItemInputUpdate {
//     id
//     modelNumber
//     serialNumber
//     dateWarrantyBegins
//     dateWarrantyExpires
//   }
// `

export const FRAGMENT_ItemTypeFields = gql`
  fragment ItemTypeFields on ItemType {
    id
    dateCreatedAt
    name
  }
`

export const FRAGMENT_EndUserFields = gql`
  fragment EndUserFields on EndUser {
    id
    dateCreatedAt
    name
    email
    emailVerified
    phone
    isClientSendEmail
  }
`

export const FRAGMENT_ActionFields = gql`
  fragment ActionFields on Action {
    id
    dateCreatedAt
    endUser {
      id
      name
    }
    location {
      id
      name
    }
    actionType {
      id
      name
      dateCreatedAt
      isVisibleLatest
      isVisibleNext
    }
    dateActionStart
    dateActionEnd
    attachments
  }
`

export const FRAGMENT_ActionTypeFields = gql`
  fragment ActionTypeFields on ActionType {
    id
    dateCreatedAt
    name
    isVisibleLatest
    isVisibleNext
  }
`

export const FRAGMENT_LocationFields = gql`
  fragment LocationFields on Location {
    id
    dateCreatedAt
    name
    dateCreatedAt
    email
    phone
    webPage
    city
    country
  }
`