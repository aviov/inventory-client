import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment-timezone';
import { momentTimezone } from '@mobiscroll/react';
import {
  Eventcalendar,
  setOptions,
  Popup,
  Button,
  Input,
  Dropdown,
  Textarea,
  RadioGroup,
  Radio,
  // Checkbox,
  Datepicker,
  // snackbar
} from '@mobiscroll/react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { v1 as uuidv1 } from 'uuid';
import {
  QUERY_listEndUsers,
  // QUERY_listItemTypes,
  QUERY_listItems,
  QUERY_listLocations,
  QUERY_listActions,
  QUERY_listActionTypes
  // QUERY_getActionById
} from '../api/queries';
import {
  MUTATION_createAction,
  MUTATION_updateAction,
  MUTATION_deleteAction
} from '../api/mutations';
import { useAuthContext } from "../libs/contextLib";
import { ImSpinner2 } from 'react-icons/im';
// import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import './Plan.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

momentTimezone.moment = moment;

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

const viewSettings = {
  timeline: {
    type: 'week',
    startDay: 1,
    endDay: 7
  }
};
const responsivePopup = {
  medium: {
    display: 'anchored',
    width: 520,
    fullScreen: false,
    touchUi: false
  }
};

// const defaultEvents = [{
//     start: '2021-09-24T12:00',
//     end: '2021-09-24T20:00',
//     title: 'Apartment house UGL',
//     location: '3647 Tavern Place',
//     resource: ['d3', 'cm2', 'd4', 'cp2', 'cm3', 'ce1', 'b2'],
//     color: '#03c9d2'
// }];
// const resources = [{
//     id: 'customers',
//     name: 'Customers',
//     collapsed: true,
//     children: [{
//         id: 'bauhaus',
//         name: 'Bauhaus',
//         children: [
//           {
//             id: 'b1',
//             name: 'Tiiu Kant'
//           }, {
//             id: 'b2',
//             name: 'Maige Treial'
//           }
//         ]
//     }, {
//         id: 'ital',
//         name: 'ITAL',
//         children: [
//           {
//             id: 'c1',
//             name: 'Deniss Karobin'
//           }, {
//             id: 'c2',
//             name: 'Heiki Tamm'
//           }
//         ]
//     }]
// }];

export default function Plan() {
  const { isAuthenticated } = useAuthContext();
  // const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [actionCreate, setActionCreate] = useState({
    name: '',
    description: '',
    itemId: '',
    endUserId: '',
    locationId: '',
    dateActionStart: '',
    dateActionEnd: '',
    actionTypeId: ''
  });
  const [createAction] = useMutation(MUTATION_createAction, {
    refetchQueries: [
      { query: QUERY_listActions },
      // { query: QUERY_getActionById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });
  const [isUpdating, setIsUpdating] = useState(false);
  // const [actionUpdate, setActionUpdate] = useState({
  //   name: '',
  //   description: '',
  //   itemId: '',
  //   endUserId: '',
  //   locationId: '',
  //   dateActionStart: '',
  //   dateActionEnd: '',
  //   actionTypeId: ''
  // });
  const [updateAction] = useMutation(MUTATION_updateAction, {
    refetchQueries: [
      { query: QUERY_listActions },
      // { query: QUERY_getActionById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });
  // const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAction] = useMutation(MUTATION_deleteAction, {
    refetchQueries: [
      { query: QUERY_listActions },
      // { query: QUERY_getActionById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });


  const [actions, setActions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [modalVisibleId, setModalVisibleId] = useState('');
  const [anchor, setAnchor] = useState(null);
  const [start, startRef] = useState(null);
  const [end, endRef] = useState(null);
  // const [popupEventTitle, setTitle] = React.useState('');
  // const [popupEventLocation, setLocation] = React.useState('');
  // const [popupEventNotes, setNotes] = React.useState('');
  const [popupEventDate, setDate] = React.useState([]);
  const [mySelectedDate, setSelectedDate] = React.useState(new Date());
  const [checkedResources, setCheckedResources] = React.useState([]);


  // const [actionOption, setActionOption] = useState(null);
  // const [actionOptions, setActionOptions] = useState([]);
  const [listActions, {
    data: dataActions,
  }] = useLazyQuery(QUERY_listActions, {
    fetchPolicy: 'cache-first'
  });
  // const [endUserOption, setEndUserOption] = useState(null);
  // const [endUserOptions, setEndUserOptions] = useState([]);
  const [resources, setResources] = useState([]);
  // const [resourcesLocations, setResourcesLocations] = useState([]);
  // const [resourcesLocationsStartPoints, setResourcesLocationsStartPoints] = useState({ children: [] });
  // const [resourcesLocationsDestinations, setResourcesLocationsDestinations] = useState({ children: [] });
  const [listEndUsers, {
    data: dataEndUserOptions,
  }] = useLazyQuery(QUERY_listEndUsers, {
    fetchPolicy: 'cache-first'
  });
  // const [itemTypeOption, setItemTypeOption] = useState(null);
  // const [itemTypeOptions, setItemTypeOptions] = useState([]);
  // const [listItemTypes, {
  //   data: dataItemTypeOptions,
  // }] = useLazyQuery(QUERY_listItemTypes, {
  //   fetchPolicy: 'cache-first'
  // });
  // const [itemOption, setItemOption] = useState(null);
  // const [itemOptions, setItemOptions] = useState([]);
  const [listItems, {
    data: dataItemOptions,
  }] = useLazyQuery(QUERY_listItems, {
    fetchPolicy: 'cache-first'
  });
  // const [locationOption, setLocationOption] = useState(null);
  // const [locationOptions, setLocationOptions] = useState([]);
  const [listLocations, {
    data: dataLocationOptions,
  }] = useLazyQuery(QUERY_listLocations, {
    fetchPolicy: 'cache-first'
  });
  // const [actionTypeOption, setActionTypeOption] = useState(null);
  const [actionTypeOptions, setActionTypeOptions] = useState([]);
  const [listActionTypes, {
    data: dataActionTypeOptions,
  }] = useLazyQuery(QUERY_listActionTypes, {
    fetchPolicy: 'cache-first'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      setIsLoading(true);
      try {
        listActions();
        const data = dataActions && dataActions.listActions;
        if (data) {
          console.log('data', data);
          const dataList = data.map((action) => ({
            id: action.id,
            title: action.name,
            start: action.dateActionStart.toString(),
            end: action.dateActionEnd.toString(),
            location: action.location.name,
            resource: [action.endUser.id, action.location.id, action.item.id],
            color: '#03c9d2',
            actionObj: action
          }));
          console.log('dataList', dataList);
          setActions(dataList ? dataList : []);
          setIsLoading(false);
        }
      } catch (error) {
        onError(error);
      }
      try {
        listActionTypes();
        const data = dataActionTypeOptions && dataActionTypeOptions.listActionTypes;
        if (data) {
          const options = data.map(({ id, name }) => ({ value: id, label: name }));
          setActionTypeOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      try {
        listEndUsers();
        const data = dataEndUserOptions && dataEndUserOptions.listEndUsers;
        if (data && !resources.some(({ id }) => (id === 'workers'))) {
          const list = data.map(({ id, name }) => ({ id, name }));
          setResources([
            ...resources,
            {
              id: 'workers',
              name: 'Workers',
              children: [
                {
                  id: 'autojuhid',
                  name: 'Autojuhid',
                  children: list
                }
              ]
            }
          ]);
          // const options = data.map(({ id, name }) => ({ value: id, label: name }));
          // setEndUserOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      try {
        listItems();
        const data = dataItemOptions && dataItemOptions.listItems;
        if (data && !resources.some(({ id }) => (id === 'machines'))) {
          const list = data.map(({ id, itemType, modelNumber }) => ({ id, name: itemType ? itemType.name + modelNumber : modelNumber }));
          console.log('data', data)
          setResources([
            ...resources,
            {
              id: 'machines',
              name: 'Machines',
              children: [
                {
                  id: 'trucks',
                  name: 'Trucks',
                  children: list
                }
              ]
            }
          ]);
          // const options = data.map(({ id, name }) => ({ value: id, label: name }));
          // setEndUserOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      try {
        listLocations();
        const data = dataLocationOptions && dataLocationOptions.listLocations;
        if (data && !resources.some(({ id }) => (id === 'locations'))) {
          const list = data.map(({ id, name }) => ({ id, name }));
          setResources([
            ...resources,
            {
              id: 'locations',
              name: 'Locations',
              children: [
                {
                  id: 'harjumaa',
                  name: 'Harjumaa',
                  children: list
                }
              ]
            }
          ]);
          // const listStartPoints = list.map(child => ({ ...child, id: child.id }));
          // console.log(listStartPoints)
          // setResourcesLocationsStartPoints({
          //   id: 'startpoints',
          //   name: 'Start Points',
          //   children: [
          //     {
          //       id: 'harjumaa',
          //       name: 'Harjumaa',
          //       children: list
          //     }
          //   ]
          // });
          // const listDestinationPoints = list.map(child => ({ ...child, id: `destinationpoint:${child.id}` }));
          // setResourcesLocationsDestinations({
          //   id: 'destinations',
          //   name: 'Destinations',
          //   children: [
          //     {
          //       id: 'harjumaa',
          //       name: 'Harjumaa',
          //       children: listDestinationPoints
          //     }
          //   ]
          // });
          // const options = data.map(({ id, name }) => ({ value: id, label: name }));
          // setEndUserOptions(options);
        }
      } catch (error) {
        onError(error);
      }
    }
    onLoad();
  },[
      isAuthenticated,
      listActions,
      dataActions,
      listActionTypes,
      dataActionTypeOptions,
      listEndUsers,
      dataEndUserOptions,
      listItems,
      dataItemOptions,
      listLocations,
      dataLocationOptions
    ]
  );

  async function handleSubmitCreate({
    name,
    description,
    itemId,
    endUserId,
    locationId,
    dateActionStart,
    dateActionEnd,
    actionTypeId
  }) {
    setIsUpdating(true);
    const actionId = 'action:' + uuidv1();
    const dateCreatedAt = new Date();
    const actionInput = {
      id: actionId,
      dateCreatedAt,
      name,
      description,
      itemId: itemId && ('action:' + itemId),
      endUserId: endUserId && ('action:' + endUserId),
      locationId: locationId && ('action:' + locationId),
      dateActionStart,
      dateActionEnd,
      actionTypeId: actionTypeId && ('action:' + actionTypeId)
    }
    console.log('actionInput', actionInput)
    try {
      const data = await createAction({
        variables: {
          action: actionInput
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsCreating(false);
        // setSelectedDate(popupEventDate[0]);
        setIsModalVisible(false);
        setActionCreate({});
        // setEndUserOption(null);
        // setLocationOption(null);
      }
    } catch (error) {
      onError(error);
      setIsUpdating(false);
    }
  };

  async function handleSubmitUpdate({
    id,
    name,
    description,
    itemId,
    endUserId,
    locationId,
    dateActionStart,
    dateActionEnd,
    actionTypeId
  }) {
    setIsUpdating(true);
    const actionInputUpdate = {
      id,
      name,
      description,
      itemId: itemId && ('action:' + itemId),
      endUserId: endUserId && ('action:' + endUserId),
      locationId: locationId && ('action:' + locationId),
      dateActionStart,
      dateActionEnd,
      actionTypeId: actionTypeId && ('action:' + actionTypeId)
    }
    try {
      const data = await updateAction({
        variables: {
          action: actionInputUpdate
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
        setIsModalVisible(false);
        setActionCreate({});
        // setEndUserOption(null);
        // setLocationOption(null);
        // setActionTypeOption(null);
      }
    } catch (error) {
      onError(error);
      setIsUpdating(false);
    }
  };

  async function handleDelete(action) {
    const confirmed = window.confirm(`Do you want to delete action?`);
    if (confirmed) {
      // setIsDeleting(true);
      try {
        await deleteAction({ variables: { actionId: action.id } });
      } catch (error) {
        onError(error);
      }
      // setIsDeleting(false);
    } else {
      return null;
    }
    setIsEditing(false);
    setActionCreate({});
  };

  const radioChange = (ev) => {
    const value = ev.target.value;
    console.log('ev.target', ev.target);

    if (ev.target.checked) {
      // const { resource } = event;
      if (value.startsWith('location')) {
        setActionCreate({
          ...actionCreate,
          locationId: value
        });
        setCheckedResources(checkedResources.filter((r) => r.startsWith('location') !== value.startsWith('location')));
      }
      if (value.startsWith('enduser')) {
        setActionCreate({
          ...actionCreate,
          endUserId: value
        });
        setCheckedResources(checkedResources.filter((r) => r.startsWith('enduser') !== value.startsWith('enduser')));
      }
      if (value.startsWith('item')) {
        setActionCreate({
          ...actionCreate,
          itemId: value
        });
        setCheckedResources(checkedResources.filter((r) => r.startsWith('item') !== value.startsWith('item')));
      }
      setCheckedResources((checkedResources) => [...checkedResources, value]);  
    }
  };

    
  // const checkboxChange = (ev) => {
  //     const value = ev.target.value;
  //     console.log('ev.target', ev.target);

  //     if (ev.target.checked) {
  //         // const { resource } = event;
  //         if (value.startsWith('location')) {
  //           setActionCreate({
  //             ...actionCreate,
  //             locationId: value
  //           });
  //         }
  //         if (value.startsWith('enduser')) {
  //           setActionCreate({
  //             ...actionCreate,
  //             endUserId: value
  //           });
  //         }
  //         if (value.startsWith('item')) {
  //           setActionCreate({
  //             ...actionCreate,
  //             itemId: value
  //           });
  //         }
  //         setCheckedResources((checkedResources) => [...checkedResources, value]);
  //     } else {
  //         if (value.startsWith('location')) {
  //           setActionCreate({
  //             ...actionCreate,
  //             locationId: ''
  //           });
  //         }
  //         if (value.startsWith('enduser')) {
  //           setActionCreate({
  //             ...actionCreate,
  //             endUserId: ''
  //           });
  //         }
  //         if (value.startsWith('item')) {
  //           setActionCreate({
  //             ...actionCreate,
  //             itemId: ''
  //           });
  //         }
  //         setCheckedResources(checkedResources.filter((r) => r !== value));
  //     }
  // };

  // const saveEvent = useCallback(() => {
  //     const newEvent = {
  //         id: actionUpdate.id,
  //         title: popupEventTitle,
  //         location: popupEventLocation,
  //         notes: popupEventNotes,
  //         start: popupEventDate[0],
  //         end: popupEventDate[1],
  //         color: actionUpdate.color,
  //         resource: checkedResources,
  //     };
  //     if (isEditing) {
  //         // update the event in the list
  //         const index = actions.findIndex(x => x.id === actionUpdate.id);;
  //         const newEventList = [...actions];

  //         newEventList.splice(index, 1, newEvent);
  //         setActions(newEventList);
  //         // here you can update the event in your storage as well
  //         // ...
  //     } else {
  //         // add the new event to the list
  //         setActions([...actions, newEvent]);
  //         // here you can add the event to your storage as well
  //         // ...
  //     }
  //     setSelectedDate(popupEventDate[0]);
  //     // close the popup
  //     setIsModalVisible(false);
  // }, [isEditing, actions, popupEventDate, popupEventNotes, popupEventTitle, popupEventLocation, actionUpdate, checkedResources]);

  const deleteEvent = useCallback((event) => {
    // setActions(actions.filter(item => item.id !== event.id));
    // setTimeout(() => {
    //     snackbar({
    //         button: {
    //             action: () => {return},
    //             text: 'Undo'
    //         },
    //         message: 'Event deleted'
    //     });
    // });
    handleDelete(actionCreate);
  }, [actions, actionCreate]);

  const loadPopupForm = useCallback((event) => {
    console.log('event', event);
    // setTitle(event.title);
    // setLocation(event.location);
    // setNotes(event.notes);
    setDate([event.start, event.end]);
    setCheckedResources(event.resource);
  }, []);

  // handle popup form changes

  const titleChange = useCallback((ev) => {
    setActionCreate({ ...actionCreate, name: ev.target.value });
    // setTitle(ev.target.value);
  }, [actionCreate]);

  const actionTypeChange = (ev) => {
    // setActionTypeOption(ev.target.value);
    setActionCreate({
      ...actionCreate,
      actionTypeId: ev.target.value
    })
  }
  
  // const locationChange = useCallback((ev) => {
  //     setLocation(ev.target.value);
  // }, []);

  const notesChange = useCallback((ev) => {
    setActionCreate({
      ...actionCreate,
      description: ev.target.value
    });
  }, [actionCreate]);

  const dateChange = useCallback((args) => {
    // console.log('args.value', args.value);
    setActionCreate({
      ...actionCreate,
      dateActionStart: args.value[0],
      dateActionEnd: args.value[1]
    })
    setDate(args.value);
  }, [actionCreate]);

  const onDeleteClick = useCallback(() => {
    deleteEvent(actionCreate);
    setIsEditing(false);
    setIsModalVisible(false);
  }, [deleteEvent, actionCreate]);

  // scheduler options

  const onSelectedDateChange = useCallback((event) => {
    setSelectedDate(event.date);
    console.log('event.date', event.date)
    setActionCreate({
      ...actionCreate,
      dateActionStart: event.date[0],
      dateActionEnd: event.date[1]
    })
  }, [actionCreate]);

  const onEventClick = useCallback((args) => {
    setIsEditing(true);
    console.log('args.event', args.event);
    const { actionObj } = args.event;
    const {
      id,
      name,
      description,
      item,
      endUser,
      location,
      dateActionStart,
      dateActionEnd,
      actionType
    } = actionObj;
    setActionCreate({
      id,
      name,
      description,
      itemId: item && item.id,
      endUserId: endUser && endUser.id,
      locationId: location && location.id,
      dateActionStart,
      dateActionEnd,
      actionTypeId: actionType && actionType.id,
      actionObj
    });
    // fill popup form with event data
    loadPopupForm(args.event);
    setAnchor(args.domEvent.target);
    setIsModalVisible(true);
  }, [loadPopupForm]);

  const onEventCreated = useCallback(({ event, target }) => {
    console.log('event', event, event.resource.startsWith('enduser'));
    // setIsEditing(false);
    setIsCreating(true);
    // setActionUpdate(event);

    const { resource } = event;
    if (resource.startsWith('location')) {
      setActionCreate({
        ...actionCreate,
        locationId: resource,
        dateActionStart: event.start,
        dateActionEnd: event.end
      });
    }
    if (resource.startsWith('enduser')) {
      setActionCreate({
        ...actionCreate,
        endUserId: resource,
        dateActionStart: event.start,
        dateActionEnd: event.end
      });
    }
    if (resource.startsWith('item')) {
      setActionCreate({
        ...actionCreate,
        itemId: resource,
        dateActionStart: event.start,
        dateActionEnd: event.end
      });
    }

    // fill popup form with event data
    loadPopupForm({ ...event, resource: [ resource ] });
    setAnchor(target);
    // open the popup
    setIsModalVisible(true);
  }, [loadPopupForm]);

  const onEventDeleted = useCallback((args) => {
    deleteEvent(args.event)
  }, [deleteEvent]);

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  // popup options
  const headerText = useMemo(() => isEditing ? 'Edit work' : (isCreating ? 'New work' : ''), [isEditing, isCreating]);
  const popupButtons = useMemo(() => {
      if (isEditing) {
        if (isUpdating) {
          return ['cancel', {
            icon: <ImSpinner2 className='spinning' />,
            // cssClass: 'mbsc-popup-button-primary'
          }];
        } else {
          return ['cancel', {
            handler: () => {
                // saveEvent();
                if (!validateForm({
                  id: actionCreate.id,
                  name: actionCreate.name,
                  description: actionCreate.description,
                  itemId: actionCreate.itemId,
                  endUserId: actionCreate.endUserId,
                  locationId: actionCreate.locationId,
                  actionTypeId: actionCreate.actionTypeId,
                  dateActionStart: actionCreate.dateActionStart,
                  dateActionEnd: actionCreate.dateActionEnd
                })) {
                  window.confirm(`Fill all data`);
                } else {
                  handleSubmitUpdate(actionCreate);
                }
            },
            keyCode: 'enter',
            text: 'Save',
            cssClass: 'mbsc-popup-button-primary'
          }];
        }
      } else if (isCreating) {
        if (isUpdating) {
          return ['cancel', {
            icon: <ImSpinner2 className='spinning' />,
            // cssClass: 'mbsc-popup-button-primary'
          }];
        } else {
          return ['cancel', {
            handler: () => {
              // saveEvent();
                if (!validateForm({
                  name: actionCreate.name,
                  // description: actionCreate.description,
                  itemId: actionCreate.itemId,
                  endUserId: actionCreate.endUserId,
                  locationId: actionCreate.locationId,
                  actionTypeId: actionCreate.actionTypeId,
                  dateActionStart: actionCreate.dateActionStart,
                  dateActionEnd: actionCreate.dateActionEnd
                })) {
                  window.confirm(`Fill all data`);
                } else {
                  handleSubmitCreate(actionCreate);
                }
            },
            keyCode: 'enter',
            text: 'Add',
            cssClass: 'mbsc-popup-button-primary'
          }];
        }
      }
  }, [
    isEditing,
    isCreating,
    isUpdating,
    actionCreate
    // saveEvent
  ]);

  const onClose = useCallback(() => {
      if (isEditing) {
        // refresh the list, if add popup was canceled, to remove the temporary event
        setIsEditing(false);
      } else if (isCreating) {
        setIsCreating(false);
      }
      setActions([...actions]);
      setActionCreate({});
      setIsModalVisible(false);
  }, [isEditing, isCreating, actions, setActionCreate]);
  
  const extendDefaultEvent = useCallback((args) => {
    return { 
      title: '',
      location: ''
    };
  }, []);

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
  // console.log('isEditing', isEditing);
  // console.log('isCreating', isCreating);
  // console.log('actions', actions);
  // // console.log('actionUpdate', actionUpdate);
  // console.log('checkedResources', checkedResources);
  // console.log('resources', resources);
  // console.log('actionCreate', actionCreate);

  return <div className='Plan'>
      <Eventcalendar
        timezonePlugin={momentTimezone}
        dataTimezone="utc"
        displayTimezone="Europe/Tallinn"
        timeFormat="HH:mm"
        view={viewSettings}
        data={actions}
        resources={resources}
        clickToCreate="double"
        dragToCreate={true}
        // dragToMove={true}
        // dragToResize={true}
        dragTimeStep={30}
        selectedDate={mySelectedDate}
        onSelectedDateChange={onSelectedDateChange}
        onEventClick={onEventClick}
        onEventCreated={onEventCreated}
        onEventDeleted={onEventDeleted}
        extendDefaultEvent={extendDefaultEvent}
      />
      <Popup
        display="bottom"
        fullScreen={true}
        contentPadding={false}
        headerText={headerText}
        anchor={anchor}
        buttons={popupButtons}
        isOpen={isModalVisible}
        onClose={onClose}
        responsive={responsivePopup}
      >
        <div className="mbsc-form-group">
          <Input label="Title" value={actionCreate.name ? actionCreate.name : ''} onChange={titleChange} />
          <Dropdown
            label='Action Type'
            value={actionCreate && actionCreate.actionTypeId}
            onChange={actionTypeChange}
          >
            <option value=''/>
            {actionTypeOptions.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </Dropdown>
          {/* <Input label="Location" value={popupEventLocation} onChange={locationChange} /> */}
          <Textarea label="Notes" value={actionCreate.description ? actionCreate.description : ''} onChange={notesChange} />
        </div>
        <div className="mbsc-form-group">
          <Input ref={startRef} label="Starts" />
          <Input ref={endRef} label="Ends" />
          <Datepicker
            timezonePlugin={momentTimezone}
            dataTimezone="utc"
            displayTimezone="Europe/Tallinn"
            timeFormat="HH:mm"
            select="range"
            controls={['time']}
            // touchUi={true}
            startInput={start}
            endInput={end}
            showRangeLabels={false}
            onChange={dateChange}
            value={popupEventDate}
          />
        </div>
        <div className="mbsc-form-group">
          <div className="mbsc-grid mbsc-no-padding">
            <div className="mbsc-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* {resourcesLocationsStartPoints.children.map((res) => {
                return <div className="mbsc-col-sm-4" key={res.id}>
                  <RadioGroup>
                    <div className="mbsc-form-group-title">{'starting point'}</div>
                      {res.children.map((r) => {
                        return <Radio key={r.id} value={r.id} checked={checkedResources.indexOf(r.id) > -1} onChange={radioChange} theme="material" className="work-order-checkbox-label">{r.name}</Radio>
                      })
                    }
                  </RadioGroup>
                </div>
              })}
              {resourcesLocationsDestinations.children.map((res) => {
                return <div className="mbsc-col-sm-4" key={res.id}>
                  <RadioGroup>
                    <div className="mbsc-form-group-title">{'destination point'}</div>
                      {res.children.map((r) => {
                        return <Radio key={r.id} value={r.id} checked={checkedResources.indexOf(r.id) > -1} onChange={radioChange} theme="material" className="work-order-checkbox-label">{r.name}</Radio>
                      })
                    }
                  </RadioGroup>
                </div>
              })} */}
            </div>
            {/* <hr/> */}
            <div className="mbsc-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {resources/*.filter(({ id }) => (id !== 'locations'))*/.map((resources) => {
                return (resources.children.map((res) => {
                  return <div className="mbsc-col-sm-4" key={res.id}>
                    <RadioGroup>
                      <div className="mbsc-form-group-title">{res.name}</div>
                        {res.children.map((r) => {
                          return <Radio key={r.id} value={r.id} checked={checkedResources.indexOf(r.id) > -1} onChange={radioChange} theme="material" className="work-order-checkbox-label">{r.name}</Radio>
                        })
                      }
                    </RadioGroup>
                  </div>
                }))
              })}
            </div>
          </div>
        </div>
        <div className="mbsc-form-group">
          {isEditing && <div className="mbsc-button-group">
            <Button
              className="mbsc-button-block"
              color="danger" variant="outline"
              onClick={onDeleteClick}>
                {'Delete event'}
            </Button>
            {/* <LoadingButton
              className='LoadingButton'
              size='sm'
              color='red'
              variant='outline-danger'
              disabled={isDeleting}
              type='submit'
              isLoading={isDeleting}
              onClick={onDeleteClick}
            >
              Delete
            </LoadingButton> */}
          </div>}
        </div>
      </Popup>
    </div>
}
