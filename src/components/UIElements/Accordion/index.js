import React, { useEffect, useState } from "react";
import { Collapse } from "reactstrap";

const Accordion = ({ items, separateItem, bordered }) => {
  const [accordionItems, setAccordionItems] = useState([]);

  const handleClick = (index) => {
    const modifiedAccordionItems = [...accordionItems];
    if (!modifiedAccordionItems[index]?.alwaysOpen) {
      modifiedAccordionItems[index].isOpen = !modifiedAccordionItems[index]
        .isOpen;
      setAccordionItems(modifiedAccordionItems);
    }
  };

  useEffect(() => {
    setAccordionItems(items);
  }, [items]);

  return (
    <div className={`accordion ${bordered ? "" : "accordion-flush"}`} id="accordion">
      {accordionItems.map((accordionItem, index) => {
        if (!accordionItem.hide) {
          return (
            <div
              className="accordion-item"
              key={index}
              style={{ marginBottom: separateItem ? 20 : 0 }}
            >
              <h2 className="accordion-header" id="headingOne">
                <button
                  className={`accordion-button fw-medium`}
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(index)}
                >
                  {accordionItem.title ? accordionItem.title : `Item #${index}`}
                </button>
              </h2>

              <Collapse
                isOpen={accordionItem.isOpen || accordionItem.alwaysOpen}
                className="accordion-collapse"
              >
                <div className="accordion-body">{accordionItem.body}</div>
              </Collapse>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Accordion;
