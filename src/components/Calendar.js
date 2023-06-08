import React, { useState, useEffect } from 'react';
import {
  Eventcalendar,
  setOptions,
  CalendarNav,
  SegmentedGroup,
  SegmentedItem,
  CalendarPrev,
  CalendarToday,
  CalendarNext
} from '@mobiscroll/react';
import { useLazyQuery } from '@apollo/client';
import { QUERY_listActions } from '../api/queries';
import { ImSpinner2 } from 'react-icons/im';
import { onError } from '../libs/errorLib';
import './Calendar.css';
import '@mobiscroll/react/dist/css/mobiscroll.react.min.css';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

export default function Calendar() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('month');
  const [myEvents, setEvents] = useState([]);
  const [listActions, {
    data: dataActions,
  }] = useLazyQuery(QUERY_listActions, {
    fetchPolicy: 'cache-first'
  });

  useEffect(() => {
    function onLoad() {
      setIsLoading(true);
      try {
        listActions();
        const data = dataActions && dataActions.listActions;
        if (data) {
          const events = data.map((action) => ({
            id: action.id,
            title: action.name,
            start: action.dateActionStart,
            end: action.dateActionEnd,
            location: action.location.name,
            resource: [action.endUser.id, action.location.id, action.item.id],
            color: '#03c9d2',
          }))
          setEvents(events);
          setIsLoading(false);
        }
      } catch (error) {
        onError(error)
      }
    }
    onLoad();
  }, [listActions, dataActions]);

  const [calView, setCalView] = useState(
    {
      calendar: { labels: true }
    }
  );

  const changeView = (event) => {
    let calView;
    
    switch (event.target.value) {
      case 'month':
        calView = {
          calendar: { labels: true }
        }
        break;
      case 'week':
        calView = {
          schedule: { type: 'week' }
        }
        break;
      case 'day':
        calView = {
          schedule: { type: 'day' }
        }
        break;
      case 'agenda':
        calView = {
            calendar: { type: 'week' },
            agenda: { type: 'week' }
        }
        break;
      default: break;
    }

    setView(event.target.value);
    setCalView(calView);
  }
  
  const customWithNavButtons = () => {
    return <React.Fragment>
      <div className='Header'>
        <CalendarNav className="cal-header-nav" />
        <div className="cal-header-picker">
          <SegmentedGroup value={view} onChange={changeView}>
            <SegmentedItem value="month">
                Month
            </SegmentedItem>
            <SegmentedItem value="week">
                Week
            </SegmentedItem>
            <SegmentedItem value="day">
                Day
            </SegmentedItem>
            <SegmentedItem value="agenda">
                Agenda
            </SegmentedItem>
          </SegmentedGroup>
        </div>
        <div>
          <CalendarPrev className="cal-header-prev" />
          <CalendarToday className="cal-header-today" />
          <CalendarNext className="cal-header-next" />
        </div>
      </div>
    </React.Fragment>;
  }

  if (isLoading) {
    return(
      <div
        className='Loading'
      >
        <ImSpinner2
          className='spinning'
        />
      </div>
    )
  }

  return (
    <div className="Calendar">
      <Eventcalendar
        renderHeader={customWithNavButtons}
        height={750}
        view={calView}
        data={myEvents}
        // dragToMove={true}
        // dragToResize={true}
        dragTimeStep={30}
      />
    </div>
  ); 
}
