import React from "react";
import "./Node.css";
import { ArcherElement } from "react-archer";
import Draggable from "react-draggable";
import classnames from "classnames";

import { useStore } from "../../Utility/Store";

function Node({ node }) {
  const [store, dispatch] = useStore();

  const triggerArrowUpdate = () => {
    //Archer element only updates if the resize event triggers or relations changes
    window.dispatchEvent(new Event("resize"));
  };

  const id = node.id;

  return (
    <Draggable
      bounds=".node-container"
      onDrag={triggerArrowUpdate}
      onStop={triggerArrowUpdate}
    >
      <div>
        <ArcherElement
          id={id}
          relations={
            node.childNodes &&
            node.childNodes.map(fromId => {
              return {
                targetId: fromId,
                targetAnchor: "top",
                sourceAnchor: "bottom"
              };
            })
          }
          className={classnames("script-node", {
            selectable: store.isInWiringMode && store.wireFromId !== id,
            "select-start": store.isWiringMode && store.wireFromId === id
          })}
        >
          {node.childNodes && (
            <div className="script-node-input-ports">
              {node.childNodes.map(() => (
                <div className="script-node-input-port">INPUT</div>
              ))}
            </div>
          )}
          <div
            onClick={() => dispatch({ type: "END_WIRE", payload: id })}
            style={{ width: "100%", left: id * 100 + "px" }}
          >
            {"[" + id + "] " + node.name + "\t"}
            <span
              className="script-node-delete"
              onClick={() => dispatch({ type: "REMOVE_NODE", payload: id })}
            >
              DELETE
            </span>
          </div>
          <div>
            {node.extraFields &&
              Object.keys(node.extraFields).map(key => (
                <div>
                  {key} {node.extraFields[key](node)}
                </div>
              ))}
          </div>
          {node.output && (
            <div
              className="script-node-port"
              onClick={() => dispatch({ type: "START_WIRE", payload: id })}
            >
              OUTPUT
            </div>
          )}
        </ArcherElement>
      </div>
    </Draggable>
  );
}

export default Node;