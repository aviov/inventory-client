import React from "react";
import { useNavigate } from 'react-router-dom';
import { useDrag } from "react-dnd";
import { ImPencil } from 'react-icons/im';
import { SIDEBAR_ITEM_ACTIONGANG } from "../mock/projectConstants";

const SideBarItemActionGang = ({ data }) => {
  const navigate = useNavigate();
  const [{ opacity }, drag] = useDrag({
    type: SIDEBAR_ITEM_ACTIONGANG,
    item: {
      type: SIDEBAR_ITEM_ACTIONGANG, // type duplicated here to avoid error on drop into other row or any other unexpected error
      ...data
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.column.content}
      <ImPencil
        className="IconButton"
        onClick={() => navigate(`/actionGangs/${data.id}`)}
      />
    </div>
  );
};
export default SideBarItemActionGang;
