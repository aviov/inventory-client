import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { PROJECT } from "../mock/projectConstants";
import DropZone from "./ProjectDropZone";
import Column from "./ProjectColumn";

const style = {};
const ProjectRow = ({ data, components, handleDrop, path }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: PROJECT,
    item: {
      type: PROJECT, // type duplicated here to avoid error on drop into other row
      id: data.id,
      children: data.children,
      path,
      content: data.content
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  return (
    <div ref={ref} style={{ ...style, opacity }} className="base draggable rowDnD">
      {data.content}
      <div className="columns">
        {data.children && Array.isArray(data.children) && data.children.map((column, index) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={column.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
                className="horizontalDrag"
              />
              {renderColumn(column, currentPath)}
            </React.Fragment>
          );
        })}
        <DropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length
          }}
          onDrop={handleDrop}
          className="horizontalDrag"
          isLast
        />
      </div>
    </div>
  );
};
export default ProjectRow;
