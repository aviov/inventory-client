import gql from 'graphql-tag'

export const FRAGMENT_ItemFields = gql`
  fragment ItemFields on Item {
    id
    dateCreatedAt
    modelNumber
    serialNumber
    dateWarrantyBegins
    dateWarrantyExpires
    attachments
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