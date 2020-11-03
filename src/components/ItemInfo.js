import React from 'react'
import { Segment, Grid, Image, Icon, Divider } from 'semantic-ui-react'

function ItemInfo({ item }) {
  const dateWarrantyBeginsFormatted = new Date(item.dateWarrantyBegins).toLocaleDateString('de-DE')
  const dateWarrantyExpiresFormatted = item.dateWarrantyExpires !== '' ? new Date(item.dateWarrantyExpires).toLocaleDateString('de-DE') : 'Lifetime'
  const isWarrantyValid = item.dateWarrantyExpires ? new Date().valueOf() <= new Date(item.dateWarrantyExpires).valueOf() : true
  return(
    <Segment
      basic
      style={styles.segment}
    >
      <Grid>
        {/* <Grid.Column width={4}>
        </Grid.Column> */}
        <Grid.Column>
          <Grid.Row>
            {isWarrantyValid &&
              <Icon
                name={'check circle'}
                color={'green'}
              />
            }
            {!isWarrantyValid &&
              <Icon
                name={'exclamation circle'}
                color={'red'}
              />
            }
            {isWarrantyValid ?
              `Warranty: ${dateWarrantyBeginsFormatted} - ${dateWarrantyExpiresFormatted}`
              :
              `Warranty expired ${dateWarrantyExpiresFormatted}`
            }
            <Divider/>
            <div style={{ fontWeight: 'bold' }}>
              {'LG 34BN770-B'}
            </div>
            {/* <a target='_blank' rel='noopener noreferrer' href='https://www.lg.com/global/business/monitors/lg-34bn770'>
              Contact reseller
            </a> */}
          </Grid.Row>
          <Grid.Row>
            <Image src='https://www.lg.com/global/images/business/md07516653/gallery/desktop-03.jpg' />
          </Grid.Row>
          {/* <Grid.Row>
            {'LG 34BN770-B'}
          </Grid.Row> */}
          {/* <Grid.Row>
            {`Serial Nr ${item.serialNumber}`}
          </Grid.Row> */}
        </Grid.Column>
        {/* <Grid.Column width={1}>
          <Grid.Row>
            {isWarrantyValid &&
              <Button
                primary
                color={'blue'}
              >
                {'Contact support'}
              </Button>
            }
          </Grid.Row>

          <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
        </Grid.Column> */}
      </Grid>
    </Segment>
  )
}

const styles={
  segment: {
    width: 380
  }
}

export default ItemInfo