import React, { useState, useCallback } from "react";
import { useHistory } from 'react-router-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import DropZone from "./ProjectDropZone";
import TrashDropZone from "./ProjectTrashDropZone";
import SideBarItem from "./ProjectSideBarItem";
import SideBarItemActionGang from "./ProjectSideBarItemActionGang";
import SideBarItemProject from "./ProjectSideBarItemProject";
import ProjectRow from "./ProjectRow";
import initialData from "../mock/projectInitialData";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarItemIntoParent,
  handleRemoveItemFromLayout
} from "../libs/fnsDndLib";
import {
  SIDEBAR_ITEMS_PROJECTS,
  SIDEBAR_ITEM_PROJECT,
  SIDEBAR_ITEMS_ACTIONGANG,
  SIDEBAR_ITEM_ACTIONGANG,
  SIDEBAR_ITEMS_ACTIONS,
  SIDEBAR_ITEM_ACTION,
  ACTION,
  ACTIONGANG, 
  PROJECT
} from "../mock/projectConstants";
import { v1 as uuidv1 } from 'uuid';
import "./ProjectStyles.css";

const Container = ({ project }) => {
  // useEffect onLoad ActionGang ACTION
  const history = useHistory();
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      // console.log('dropZone', dropZone)
      // console.log('item', item)

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type, content: item.content };
      if (item.type === ACTIONGANG) {
        newItem.children = item.children;
      }

      // _. Move sidebar item row into page (Project copy into Project)
      if ((item.type === SIDEBAR_ITEM_PROJECT) && (splitDropZonePath.length === 1)) {
        const newComponent = {
          id: uuidv1(),
          ...item.row
        };
        const newItem = {
          id: newComponent.id,
          ...item.row,
          type: PROJECT
        };
        // console.log('newItem', newItem);
        // console.log('newComponent', newComponent);
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        setLayout(
          handleMoveSidebarItemIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // 0. Move sidebar item column into row (ActionGang into Project)
      if ((item.type === SIDEBAR_ITEM_ACTIONGANG) && (splitDropZonePath.length === 2)) {
        const newComponent = {
          id: uuidv1(),
          ...item.column
        };
        const newItem = {
          id: newComponent.id,
          ...item.column,
          type: ACTIONGANG
        };
        // console.log('newItem', newItem);
        // console.log('newComponent', newComponent);
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        setLayout(
          handleMoveSidebarItemIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // 1. Move sidebar item component into column (ACTION into ActionGang)
      if ((item.type === SIDEBAR_ITEM_ACTION) && (splitDropZonePath.length === 3)) {
        const newComponent = {
          id: uuidv1(),
          ...item.component
        };
        const newItem = {
          ...item.component,
          type: ACTION
        };
        // console.log('newItem', newItem);
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        setLayout(
          handleMoveSidebarItemIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items dont have path
      if (item.path) {
        const splitItemPath = item.path.split("-");
        const pathToItem = splitItemPath.slice(0, -1).join("-");
  
        // 2. Pure move (no create)
        if (splitItemPath.length === splitDropZonePath.length) {
          // 2.a. move within parent
          if (pathToItem === pathToDropZone) {
            setLayout(
              handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
            );
            return;
          }
  
          // 2.b. OR move different parent
          // FIX columns. item includes children
          setLayout(
            handleMoveToDifferentParent(
              layout,
              splitDropZonePath,
              splitItemPath,
              newItem
            )
          );
          return;
        }
      }

      // 3. Move + Create (not used)
      // setLayout(
      //   handleMoveToDifferentParent(
      //     layout,
      //     splitDropZonePath,
      //     splitItemPath,
      //     newItem
      //   )
      // );
    },
    [layout, components]
  );

  const renderProjectRow = (row, currentPath) => {
    return (
      <ProjectRow
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    );
  };

  // using index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div
      className="body"
    >
      <div
        className="pageContainer"
      >
        <div
          className="page"
        >
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderProjectRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>
      </div>
      <div>
        <Tabs defaultActiveKey="1" transition={false} className="horizontal-tabs">
          <Tab eventKey="1" className="headings" title="Projects">
            <div className="sideBar">
              {Object.values(SIDEBAR_ITEMS_PROJECTS).map((sideBarItem, index) => (
                <SideBarItemProject key={sideBarItem.id} data={sideBarItem} />
              ))}
            </div>
          </Tab>
          <Tab eventKey="2" className="headings" title="Stages">
            <div className="sideBar">
              {Object.values(SIDEBAR_ITEMS_ACTIONGANG).map((sideBarItem, index) => (
                <SideBarItemActionGang key={sideBarItem.id} data={sideBarItem} />
              ))}
              <div
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}
              >
                <Button
                  // disabled={loading}
                  className='AddProjectButton'
                  size='sm'
                  variant='outline-primary'
                  title='Add stage'
                  onClick={() => history.push(`/projects/${project.id}/actionGangs/new`)}
                >
                  Add stage template
                </Button>
              </div>
            </div>
          </Tab>
          <Tab eventKey="3" className="headings" title="Works">
            <div className="sideBar">
              {Object.values(SIDEBAR_ITEMS_ACTIONS).map((sideBarItem, index) => (
                <SideBarItem key={sideBarItem.id} data={sideBarItem} />
              ))}
            </div>
          </Tab>
        </Tabs>
        <TrashDropZone
          data={{
            layout
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>
    </div>
  );
};
export default Container;
