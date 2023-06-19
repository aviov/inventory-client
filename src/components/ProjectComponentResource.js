import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { RESOURCE } from "../mock/projectConstants";

const style = {
  border: "1px dashed black",
  padding: "0.5rem 1rem",
  backgroundColor: "rgb(250, 250, 255)",
  cursor: "move"
};
const Component = ({ data, components, path }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: RESOURCE,
    item: {
      type: RESOURCE, // type duplicated here to avoid error on drop into other row or any other unexpected error
      id: data.id,
      path,
      content: data.content
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="component draggable"
    >
      <div>{data.content.name}</div>
    </div>
  );
};
export default Component;
