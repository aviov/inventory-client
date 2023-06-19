// import shortid from "shortid";
import { v1 as uuidv1 } from 'uuid';

export const SIDEBAR_ITEM_RESOURCE = "sidebarItemResource";
export const PROJECT_RESOURCE = "rowResource"
export const RESOURCEGANG = "columnResource";
export const RESOURCE = "componentResource";
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
      content: {
        name: "Floor wood"
      }
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: {
        name: "Floor plating"
      }
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: {
        name: "Ceiling"
      }
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: {
        name: "Lining"
      }
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: {
        name: "Stairs installation"
      }
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: {
        name: "Painting"
      }
    }
  },
  {
    id: uuidv1(),
    type: SIDEBAR_ITEM_ACTION,
    component: {
      type: ACTION,
      content: {
        name: "Inspection"
      }
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
          content: {
            name: "Groundwork"
          }
        },
        {
          type: ACTION,
          id: "Drainage",
          content: {
            name: "Drainage"
          }
        },
        {
          type: ACTION,
          id: "Gardening",
          content: {
            name: "Gardening"
          }
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
          content: {
            name: "Wall framework"
          }
        },
        {
          type: ACTION,
          id: "Rockwool",
          content: {
            name: "Rockwool"
          }
        },
        {
          type: ACTION,
          id: "Wood lining",
          content: {
            name: "Wood lining"
          }
        },
        {
          type: ACTION,
          id: "Wood painting",
          content: {
            name: "Wood painting"
          }
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
          content: {
            name: "Heating pipes"
          }
        },
        {
          type: ACTION,
          id: "Vent pumps",
          content: {
            name: "Vent pumps"
          }
        },
        {
          type: ACTION,
          id: "Chimney",
          content: {
            name: "Chimney"
          }
        },
        {
          type: ACTION,
          id: "Boiler",
          content: {
            name: "Boiler"
          }
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
              content: {
                name: "Groundwork"
              }
            },
            {
              type: ACTION,
              id: "Sewage piping",
              content: {
                name: "Sewage piping"
              }
            },
            {
              type: ACTION,
              id: "Water piping",
              content: {
                name: "Water piping"
              }
            },
            {
              type: ACTION,
              id: "Electric lines",
              content: {
                name: "Electric lines"
              }
            },
            {
              type: ACTION,
              id: "Telecom",
              content: {
                name: "Telecom"
              }
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
              content: {
                name: "Groundwork"
              }
            },
            {
              type: ACTION,
              id: "Formwork",
              content: {
                name: "Formwork"
              }
            },
            {
              type: ACTION,
              id: "Concrete",
              content: {
                name: "Concrete"
              }
            }
          ]
        },
      ]
    }
  },
];