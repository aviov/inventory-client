import React from "react";
import { useHistory } from 'react-router-dom';
import { useDrag } from "react-dnd";
import { ImPencil } from 'react-icons/im';
import { SIDEBAR_ITEM_ACTION } from "../mock/projectConstants";

const SideBarItem = ({ data }) => {
  const history = useHistory();
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
      <ImPencil
        onClick={() => history.push(`/actionTempls/${data.id}`)}
      />
    </div>
  );
};
export default SideBarItem;
