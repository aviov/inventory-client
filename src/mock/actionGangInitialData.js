import { PROJECT, ACTIONGANG, ACTION } from "./projectConstants";

// temporary data for ActionGangLayout
// to fetch from db and hydrate into layout and components state

const actionGangInitialData = {

  layout: [
    {
      type: PROJECT,
      id: "StageContainer",
      content: "",
      children: [
        {
          type: ACTIONGANG,
          id: "InitialStage",
          content: "InitialStage",
          children: [
            {
              type: ACTION,
              id: "InitialWork1",
              content: "InitialWork1"
            },
            {
              type: ACTION,
              id: "InitialWork2",
              content: "InitialWork2"
            },
            {
              type: ACTION,
              id: "InitialWork3",
              content: "InitialWork3"
            }
          ]
        }
      ]
    }
  ],
  
  components: {
    WorkB: { id: "WorkB", type: "input", content: "WorkB" },
    WorkA: { id: "WorkA", type: "image", content: "WorkA" },
    WorkC: { id: "WorkC", type: "email", content: "WorkC" },
    WorkD: { id: "WorkD", type: "name", content: "WorkD" },
    WorkE: { id: "WorkE", type: "phone", content: "WorkE" }
  }
};

export default actionGangInitialData;