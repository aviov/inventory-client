// import shortid from "shortid";
import { v1 as uuidv1 } from 'uuid';

export const SIDEBAR_ITEM_PROJECT = "sidebarItemProject";
export const SIDEBAR_ITEM_ACTIONGANG = "sidebarItemActionGang";
export const SIDEBAR_ITEM_ACTION = "sidebarItemWork";
export const PROJECT = "row"; // ProjectRow React component
export const ACTIONGANG = "column"; // ProjectColumn React component
export const ACTION = "component"; // ProjectComponent React component

// temporary data for ProjectSideBarItem: to be fetched from db
export const SIDEBAR_ITEMS_ACTIONS = [
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Floor wood"
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Floor plating"
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Ceiling"
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Lining"
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Stairs installation"
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Painting"
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: "Inspection"
    }
  }
];

export const SIDEBAR_ITEMS_ACTIONGANG = [
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTIONGANG,
    column: {
      type: ACTIONGANG,
      id: "Landscape",
      content: "Landscape",
      children: [
        {
          type: ACTION,
          id: "Groundwork",
          content: "Groundwork"
        },
        {
          type: ACTION,
          id: "Drainage",
          content: "Drainage"
        },
        {
          type: ACTION,
          id: "Gardening",
          content: "Gardening"
        }
      ]
    },
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTIONGANG,
    column: {
      type: ACTIONGANG,
      content: "Facade",
      children: [
        {
          type: ACTION,
          id: "Wall framework",
          content: "Wall framework"
        },
        {
          type: ACTION,
          id: "Rockwool",
          content: "Rockwool"
        },
        {
          type: ACTION,
          id: "Wood lining",
          content: "Wood lining"
        },
        {
          type: ACTION,
          id: "Wood painting",
          content: "Wood painting"
        }
      ]
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTIONGANG,
    column: {
      type: ACTIONGANG,
      content: "HVAC",
      children: [
        {
          type: ACTION,
          id: "Heating pipes",
          content: "Heating pipes"
        },
        {
          type: ACTION,
          id: "Vent pumps",
          content: "Vent pumps"
        },
        {
          type: ACTION,
          id: "Chimney",
          content: "Chimney"
        },
        {
          type: ACTION,
          id: "Boiler",
          content: "Boiler"
        }
      ]
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTIONGANG,
    column: {
      type: ACTIONGANG,
      content: "Exterior works",
      children: []
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTIONGANG,
    column: {
      type: ACTIONGANG,
      content: "Interior works",
      children: []
    }
  }
];

export const SIDEBAR_ITEMS_PROJECTS = [
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_PROJECT,
    row: {
      type: PROJECT,
      id: 'Project Stranden 7',
      content: 'Project Stranden 7',
      children: [
        {
          type: ACTIONGANG,
          id: "Commuications",
          content: "Commuications",
          children: [
            {
              type: ACTION,
              id: "Groundwork",
              content: "Groundwork"
            },
            {
              type: ACTION,
              id: "Sewage piping",
              content: "Sewage piping"
            },
            {
              type: ACTION,
              id: "Water piping",
              content: "Water piping"
            },
            {
              type: ACTION,
              id: "Electric lines",
              content: "Electric lines"
            },
            {
              type: ACTION,
              id: "Telecom",
              content: "Telecom"
            }
          ]
        },
        {
          type: ACTIONGANG,
          id: "Basement",
          content: "Basement",
          children: [
            {
              type: ACTION,
              id: "Groundwork",
              content: "Groundwork"
            },
            {
              type: ACTION,
              id: "Formwork",
              content: "Formwork"
            },
            {
              type: ACTION,
              id: "Concrete",
              content: "Concrete"
            }
          ]
        },
      ]
    }
  },
];