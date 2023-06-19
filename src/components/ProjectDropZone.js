import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import {
  SIDEBAR_ITEM_PROJECT,
  SIDEBAR_ITEM_ACTIONGANG,
  SIDEBAR_ITEM_ACTION,
  PROJECT,
  ACTIONGANG,
  ACTION,
  SIDEBAR_ITEM_RESOURCE,
  PROJECT_RESOURCE,
  RESOURCEGANG,
  RESOURCE
} from "../mock/projectConstants";

const ACCEPTS = [
  SIDEBAR_ITEM_PROJECT,
  SIDEBAR_ITEM_PROJECT,
  SIDEBAR_ITEM_ACTIONGANG,
  SIDEBAR_ITEM_ACTION,
  PROJECT,
  ACTIONGANG,
  ACTION,
  SIDEBAR_ITEM_RESOURCE,
  PROJECT_RESOURCE,
  RESOURCEGANG,
  RESOURCE
];

const DropZone = ({ data, onDrop, isLast, className }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split("-");
      const itemPath = item.path;

      // sidebar items can always be dropped anywhere
      if (!itemPath) {
        // if (data.childrenCount >= 3) {
        //  return false;
        // }
        return true;
      }

      const splitItemPath = itemPath.split("-");

      // limit columns when dragging from one row to another row
      // const dropZonePathProjectRowIndex = splitDropZonePath[0];
      // const itemPathProjectRowIndex = splitItemPath[0];
      // const diffProjectRow = dropZonePathProjectRowIndex !== itemPathProjectRowIndex;
      // if (
      //   diffProjectRow &&
      //   splitDropZonePath.length === 2 &&
      //   data.childrenCount >= 3
      // ) {
      //   return false;
      // }

      // Not valid (Can't drop a parent element (row) into a child (column))
      const parentDropInChild = splitItemPath.length < splitDropZonePath.length;
      if (parentDropInChild) return false;

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false;

      // Current area
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
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
      className={classNames(
        "dropZone",
        { active: isActive, isLast },
        className
      )}
      ref={drop}
    />
  );
};
export default DropZone;
