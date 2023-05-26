import React from "react";
import { useDrag } from "react-dnd";
import { SIDEBAR_ITEM_ACTION } from "../mock/projectConstants";

const SideBarItem = ({ data }) => {
  const [{ opacity }, drag] = useDrag({
    type: SIDEBAR_ITEM_ACTION,
    item: {
      type: SIDEBAR_ITEM_ACTION, // type duplicated here to avoid error on drop into other row or any other unexpected error
      ...data
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.component.content}
    </div>
  );
};
export default SideBarItem;
