import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { PROJECT, ACTIONGANG, ACTION } from "../mock/projectConstants";

const ACCEPTS = [PROJECT, ACTIONGANG, ACTION];

const TrashDropZone = ({ data, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const layout = data.layout;
      const itemPath = item.path;
      const splitItemPath = itemPath.split("-");
      const itemPathProjectRowIndex = splitItemPath[0];
      const itemProjectRowChildrenLength =
        layout[itemPathProjectRowIndex] && layout[itemPathProjectRowIndex].children.length;

      // prevent removing a col when row has only one col
      if (
        item.type === ACTIONGANG &&
        itemProjectRowChildrenLength &&
        itemProjectRowChildrenLength < 2
      ) {
        return false;
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames("trashDropZone", { active: isActive })}
      ref={drop}
    >
      TRASH
    </div>
  );
};
export default TrashDropZone;
