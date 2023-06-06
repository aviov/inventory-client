import { PROJECT, ACTIONGANG, ACTION } from "./projectConstants";

// temporary data for ProjectLayout
// to fetch from db and hydrate into layout and components state
const initialData = {
  layout: [
    {
      type: PROJECT,
      id: "Project Molde 1",
      content: "Project Molde 1",
      children: [
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
        {
          type: ACTIONGANG,
          id: " Walls",
          content: "Walls",
          children: [
            {
              type: ACTION,
              id: "Framework",
              content: {
                name: "Framework"
              }
            },
            {
              type: ACTION,
              id: "Panels",
              content: {
                name: "Panels"
              }
            }
          ]
        },
        {
          type: ACTIONGANG,
          id: " Roof",
          content: "Roof",
          children: [
            {
              type: ACTION,
              id: "Framework",
              content: {
                name: "Framework"
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
              id: "Covering",
              content: {
                name: "Covering"
              }
            }
          ]
        },
        {
          type: ACTIONGANG,
          id: "Doors&Windows",
          content: "Doors&Windows",
          children: [
            {
              type: ACTION,
              id: "Doors",
              content: {
                name: "Doors"
              }
            },
            {
              type: ACTION,
              id: "Windows",
              content: {
                name: "Windows"
              }
            }
          ]
        },
        {
          type: ACTIONGANG,
          id: "Interior",
          content: "Interior",
          children: [
            {
              type: ACTION,
              id: "Tilework",
              content: {
                name: "Tilework"
              }
            },
            {
              type: ACTION,
              id: "Floorwood",
              content: {
                name: "Floorwood"
              }
            },
            {
              type: ACTION,
              id: "Ceiling",
              content: {
                name: "Ceiling"
              }
            }
          ]
        }
      ]
    },
    // {
    //   type: PROJECT,
    //   id: "ProjectYZ",
    //   content: "ProjectYZ",
    //   children: [
    //     {
    //       type: ACTIONGANG,
    //       id: "ActionGang1",
    //       content: "ActionGang1",
    //       children: [
    //         {
    //           type: ACTION,
    //           id: "WorkD",
    //           content: "WorkD"
    //         },
    //         {
    //           type: ACTION,
    //           id: "WorkB",
    //           content: "WorkB"
    //         },
    //         {
    //           type: ACTION,
    //           id: "WorkC",
    //           content: "WorkC"
    //         }
    //       ]
    //     }
    //   ]
    // }
  ],
  components: {
    WorkB: { id: "WorkB", type: "input", content: { name: "WorkB" } },
    WorkA: { id: "WorkA", type: "image", content: { name: "WorkA" } },
    WorkC: { id: "WorkC", type: "email", content: { name: "WorkC" } },
    WorkD: { id: "WorkD", type: "name", content: { name: "WorkD" } },
    WorkE: { id: "WorkE", type: "phone", content: { name: "WorkE" } }
  }
};

export default initialData;
