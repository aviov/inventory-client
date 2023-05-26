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
        {
          type: ACTIONGANG,
          id: " Walls",
          content: "Walls",
          children: [
            {
              type: ACTION,
              id: "Framework",
              content: "Framework"
            },
            {
              type: ACTION,
              id: "Panels",
              content: "Panels"
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
              content: "Framework"
            },
            {
              type: ACTION,
              id: "Rockwool",
              content: "Rockwool"
            },
            {
              type: ACTION,
              id: "Covering",
              content: "Covering"
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
              content: "Doors"
            },
            {
              type: ACTION,
              id: "Windows",
              content: "Windows"
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
              content: "Tilework"
            },
            {
              type: ACTION,
              id: "Floorwood",
              content: "Floorwood"
            },
            {
              type: ACTION,
              id: "Ceiling",
              content: "Ceiling"
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
    WorkB: { id: "WorkB", type: "input", content: "WorkB" },
    WorkA: { id: "WorkA", type: "image", content: "WorkA" },
    WorkC: { id: "WorkC", type: "email", content: "WorkC" },
    WorkD: { id: "WorkD", type: "name", content: "WorkD" },
    WorkE: { id: "WorkE", type: "phone", content: "WorkE" }
  }
};

export default initialData;
