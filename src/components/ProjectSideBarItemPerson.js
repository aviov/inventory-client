import React from "react";
import { useNavigate } from 'react-router-dom';
import { useDrag } from "react-dnd";
import { ImPencil } from 'react-icons/im';
import { SIDEBAR_ITEM_RESOURCE } from "../mock/projectConstants";

const SideBarItem = ({ data }) => {
  const navigate = useNavigate();
  const [{ opacity }, drag] = useDrag({
    type: SIDEBAR_ITEM_RESOURCE,
    item: {
      type: SIDEBAR_ITEM_RESOURCE, // type duplicated here to avoid error on drop into other row or any other unexpected error
      ...data
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.component.content.name}
      <ImPencil
        className="IconButton"
        onClick={() => navigate(`/endUsers/${data.id}`)}
      />
    </div>
  );
};
export default SideBarItem;
