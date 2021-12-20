import * as React from "react";
import { objectUtil } from "utils";

const incrementId = (ref) => {
  ref.current = ref.current + 1;
  return ref.current;
};

const createCategoryFromTemplate = (idRef) => {
  return {
    id: incrementId(idRef),
  };
};

const createCategoryCopy = (sourceCategory, idRef) => {
  const copiedCategory = objectUtil.copy(sourceCategory);
  copiedCategory.id = incrementId(idRef);
  return copiedCategory;
};

function useCategoryList(initialCategoryList) {
  const [categories, setCategories] = React.useState(initialCategoryList);
  const categoryIdRef = React.useRef(categories[0].id);

  const addCategory = () => {
    setCategories((categories) => {
      const newCategory = createCategoryFromTemplate(categoryIdRef);
      if (categories && categories.length) {
        return [...categories, newCategory];
      }
      return [newCategory];
    });
  };

  const removeCategory = (categId) => {
    setCategories((categories) => {
      if (categories.length === 1) {
        return categories;
      }
      return categories.filter((categ) => categ.id !== categId);
    });
  };

  const copyCategory = (categId) => {
    setCategories((categories) => {
      const sourceCategory = categories.find((categ) => categ.id === categId);
      return [...categories, createCategoryCopy(sourceCategory, categoryIdRef)];
    });
  };
  return { categories, addCategory, removeCategory, copyCategory };
}

export { useCategoryList };
