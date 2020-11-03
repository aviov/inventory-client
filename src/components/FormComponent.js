import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Segment, Form, Input, Button, Label } from 'semantic-ui-react'
import { MUTATION_createItem } from '../api/mutations'
import DayPickerInput from "react-day-picker/DayPickerInput";
import { v1 as uuidv1 } from 'uuid';
import "react-day-picker/lib/style.css";

function datePlusNYears({ date, nYears }) {
  if (date) {
    return new Date(date.valueOf() + (nYears * 365 * 24 * 60 * 60 * 1000))
  }
  return date
}

function ItemForm() {
  const [modelNumber, setModelNumber] = useState('LG 34BN770-B')
  const [serialNumber, setSerialNumber] = useState('')
  const [dateWarrantyBegins, setDateWarrantyBegins] = useState('')
  const [dateWarrantyExpires, setDateWarrantyExpires] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [createItem] = useMutation(MUTATION_createItem)
  // console.log(dateWarrantyBegins)

  return(
    <Segment
      style={styles.segment}
    >
      <Form>
        <Form.Group widths={'equal'}>
          <Form.Field
            fluid
            control={Input}
            label={'Model number'}
            placeholder={'Model number'}
            value={modelNumber}
            onChange={(e, { value }) => setModelNumber(value)}
          />
          <Form.Field
            fluid
            control={Input}
            label={'Serial number'}
            placeholder={'Serial number'}
            value={serialNumber}
            onChange={(e, { value }) => setSerialNumber(value)}
          />
        </Form.Group>
        <Form.Group widths={'equal'}>
          <Form.Field
            control={DayPickerInput}
            placeholder="DD/MM/YYYY"
            format="DD/MM/YYYY"
            label={'Warranty start date'}
            value={dateWarrantyBegins}
            onDayChange={(day, { selected }) => {
              // console.log('day', day, 'selected', selected)
              if (selected) {
                setDateWarrantyBegins('');
                return;
              }
              setDateWarrantyBegins(day);
              setDateWarrantyExpires(datePlusNYears({ date: day, nYears: 1 }));
            }}
          />
          <Form.Field
            control={DayPickerInput}
            placeholder="DD/MM/YYYY"
            format="DD/MM/YYYY"
            label={'Warranty end date'}
            value={dateWarrantyExpires}
            onDayChange={(day, { selected }) => {
              if (selected) {
                setDateWarrantyExpires('');
                return;
              }
              setDateWarrantyExpires(day);
            }}
          />
        </Form.Group>
        <Form.Group widths={'equal'}>
          <Form.Field
            control={Button}
            onClick={(e) => {
              e.preventDefault()
              const isValid = (serialNumber !== '') && (dateWarrantyBegins && dateWarrantyBegins !== '') && !saveSuccess
              const id = uuidv1()
              const dateCreatedAt = new Date().toISOString();
              const itemCreated = isValid && createItem({
                variables: {
                  item: {
                    id,
                    dateCreatedAt,
                    modelNumber,
                    serialNumber,
                    dateWarrantyBegins,
                    dateWarrantyExpires
                  }
                }
              })
              if (itemCreated) {
                setSaveSuccess(true)
                setTimeout(() => {
                  setSaveSuccess(false)
                  setSerialNumber('')
                  setDateWarrantyBegins('')
                  setDateWarrantyExpires('')
                }, 3000)
              }
            }}
          >
            {'Submit'}
          </Form.Field>
          <Form.Field>
            {saveSuccess &&
              <Label
                size={'large'}
                color={'green'}
              >
                Saved
              </Label>
            }
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  )
}

const styles={
  segment: {
    margin: 10,
    maxWidth: 400
  }
}

export default ItemForm