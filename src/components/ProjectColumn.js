import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ACTIONGANG } from "../mock/projectConstants";
import DropZone from "./ProjectDropZone";
import Component from "./ProjectComponent";

const style = {};
const Column = ({ data, components, handleDrop, path }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ACTIONGANG,
    item: {
      type: ACTIONGANG, // type duplicated here to avoid error on drop into other ProjectDND
      id: data.id,
      children: data.children,
      path,
      content: data.content
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    return (
      <Component
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
      />
    );
  };
  // console.log('data at Column', data);

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable column"
    >
      {data.content}
      {data.children && Array.isArray(data.children) && data.children.map((component, index) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            <DropZone
              data={{
                path: currentPath,
                childrenCount: data.children.length
              }}
              onDrop={handleDrop}
            />
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      })}
      <DropZone
        data={{
          path: `${path}-${data.children && data.children.length}`,
          childrenCount: data.children && data.children.length
        }}
        onDrop={handleDrop}
        isLast
      />
    </div>
  );
};
export default Column;
