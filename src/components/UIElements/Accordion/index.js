import React, { useEffect, useState, useCallback } from "react";
import { Collapse } from "reactstrap";

const Accordion = React.memo(({ items, separateItem, bordered }) => {
  const [accordionItems, setAccordionItems] = useState([]);

  // Menggunakan useCallback untuk memoization fungsi handleClick
  const handleClick = useCallback((index) => {
    const modifiedAccordionItems = [...accordionItems];
    if (!modifiedAccordionItems[index]?.alwaysOpen) {
      modifiedAccordionItems[index].isOpen = !modifiedAccordionItems[index]
        .isOpen;
      setAccordionItems(modifiedAccordionItems);
    }
  }, [accordionItems]);

  useEffect(() => {
    setAccordionItems(items);
  }, [items]);

  return (
    <div
      className={`accordion ${bordered ? "" : "accordion-flush"}`}
      id="accordion"
    >
      {accordionItems.map((accordionItem, index) => {
        if (!accordionItem.hide) {
          return (
            <div
              className="accordion-item"
              key={index}
              style={{ marginBottom: separateItem ? 20 : 0 }}
            >
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button"
                  type="button"
                  onClick={() => handleClick(index)}
                >
                  {accordionItem.title}
                </button>
              </h2>
              <Collapse isOpen={accordionItem.isOpen}>
                <div className="accordion-body">{accordionItem.content}</div>
              </Collapse>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
});

export default Accordion;
