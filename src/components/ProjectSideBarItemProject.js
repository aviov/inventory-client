import React from "react";
import { useDrag } from "react-dnd";
import { SIDEBAR_ITEM_PROJECT } from "../mock/projectConstants";

const SideBarItemActionGang = ({ data }) => {
  const [{ opacity }, drag] = useDrag({
    type: SIDEBAR_ITEM_PROJECT,
    item: {
      type: SIDEBAR_ITEM_PROJECT, // type duplicated here to avoid error on drop into other row or any other unexpected error
      ...data
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.row.content}
    </div>
  );
};
export default SideBarItemActionGang;
