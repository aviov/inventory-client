import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Dimmer, Loader, Segment, Form, Input, Button } from 'semantic-ui-react'
import { QUERY_getItemBySerialNumber } from '../api/queries'
import ItemInfo from './ItemInfo'

function SearchComponent() {
  const [serialNumber, setSerialNumber] = useState('')
  const [getItemBySerialNumber, { loading, data }] = useLazyQuery(QUERY_getItemBySerialNumber, {
    fetchPolicy: 'network-only'
  })
  if (loading) {
    return(
      <Dimmer active inverted>
        <Loader inverted/>
      </Dimmer>
    )
  }
  const item = (data && data.getItemBySerialNumber) && data.getItemBySerialNumber
  return(
    <Segment
      style={styles.segment}
    >
      <Form>
        <Form.Group
          unstackable
        >
          <Form.Field
            width={'12'}
            control={Input}
            label={'Item serial number'}
            placeholder={'Serial number'}
            value={serialNumber}
            onChange={(e, { value }) => setSerialNumber(value)}
          />
          <Button
            style={{ alignSelf: 'flex-end', margin: 1 }}
            color={'blue'}
            onClick={() => {
              console.log('getItemBySerialNumber', getItemBySerialNumber, serialNumber)
              getItemBySerialNumber({
                variables: { serialNumber: serialNumber }
              })
            }}
          >
            {'Search'}
          </Button>
        </Form.Group>
      </Form>
      {item &&
        <ItemInfo
          item={item}
        />
      }
      {(data && !item) &&
        <Segment
          basic
        >
          {'No item with this serial number'}
        </Segment>
      }
    </Segment>
  )
}

const styles={
  segment: {
    width: 400
  }
}

export default SearchComponent