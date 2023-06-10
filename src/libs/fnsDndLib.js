import { v1 as uuidv1 } from 'uuid';
import { PROJECT, ACTIONGANG, ACTION } from "../mock/projectConstants";

// a little function to help with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed); // inserting task in new index

  return result;
};

export const remove = (arr, index) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1)
];

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    return reorder(children, itemIndex, dropZoneIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(
      nodeChildren.children,
      splitDropZoneChildrenPath,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const removeChildFromChildren = (children, splitItemPath) => {
  if (splitItemPath.length === 1) {
    const itemIndex = Number(splitItemPath[0]);
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitItemPath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: removeChildFromChildren(
      nodeChildren.children,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    return insert(children, dropZoneIndex, item);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(
      nodeChildren.children,
      splitItemChildrenPath,
      item
    )
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (
  layout,
  splitDropZonePath,
  splitItemPath
) => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleAddColumDataToProjectRow = layout => {
  const layoutCopy = [...layout];
  const ACTIONGANG_STRUCTURE = {
    type: ACTIONGANG,
    id: uuidv1(),
    children: []
  };

  return layoutCopy.map(row => {
    if (!row.children.length) {
      row.children = [ACTIONGANG_STRUCTURE];
    }
    return row;
  });
};

export const handleMoveToDifferentParent = (
  layout,
  splitDropZonePath,
  splitItemPath,
  item
) => {
  let newLayoutStructure;
  const ACTIONGANG_STRUCTURE = {
    type: ACTIONGANG,
    id: uuidv1(),
    children: [item]
  };

  const PROJECT_STRUCTURE = {
    type: PROJECT,
    id: uuidv1()
  };

  switch (splitDropZonePath.length) {
    case 1: {
      // moving column outside into new row made on the fly
      if (item.type === ACTIONGANG) {
        newLayoutStructure = {
          ...PROJECT_STRUCTURE,
          children: [item]
        };
      } else {
        // moving component outside into new row made on the fly
        newLayoutStructure = {
          ...PROJECT_STRUCTURE,
          children: [ACTIONGANG_STRUCTURE]
        };
      }
      break;
    }
    case 2: {
      // moving component outside into a row which creates column
      if (item.type === ACTION) {
        newLayoutStructure = ACTIONGANG_STRUCTURE;
      } else {
        // moving column into existing row
        newLayoutStructure = item;
      }

      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  let updatedLayout = layout;
  updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  // updatedLayout = handleAddColumDataToProjectRow(updatedLayout); // creates duplicate on drop into empty parent
  updatedLayout = addChildToChildren(
    updatedLayout,
    splitDropZonePath,
    newLayoutStructure
  );

  return updatedLayout;
};

export const handleMoveSidebarItemIntoParent = (
  layout,
  splitDropZonePath,
  item
) => {
  let newLayoutStructure;

  if (item.type === PROJECT) {
    switch (splitDropZonePath.length) {
      case 1: {
        newLayoutStructure = item; // if drop PROJECT into page
        break;
      }
      case 2: {
        break;
      }
      default: {
        break;
      }
    }
    return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
  }

  if (item.type === ACTIONGANG) {
    switch (splitDropZonePath.length) {
      case 1: {
        break;
      }
      case 2: {
        newLayoutStructure = item; // if drop ACTIONGANG into PROJECT
        break;
      }
      default: {
        break;
      }
    }
    let updatedLayout = layout;
    // updatedLayout = handleAddColumDataToProjectRow(updatedLayout); // creates duplicate on drop into empty parent
    updatedLayout = addChildToChildren(
      updatedLayout,
      splitDropZonePath,
      newLayoutStructure
    );
    return updatedLayout;
  }

  if (item.type === ACTION) {
    switch (splitDropZonePath.length) {
      case 1: {
        // newLayoutStructure = {
        //   type: PROJECT,
        //   id: uuidv1(),
        //   children: [{ type: ACTIONGANG, id: uuidv1(), children: [item] }]
        // };
        break;
      }
      case 2: {
        // newLayoutStructure = {
        //   type: ACTIONGANG,
        //   id: uuidv1(),
        //   children: [item]
        // };
        break;
      }
      default: {
        newLayoutStructure = item;
      }
    }
    return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
  }
};

export const handleRemoveItemFromLayout = (layout, splitItemPath) => {
  return removeChildFromChildren(layout, splitItemPath);
};
