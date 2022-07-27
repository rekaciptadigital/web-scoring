import * as React from "react";
import styled from "styled-components";
import { useAgeCategories } from "./hooks/age-categories";

import { SpinnerDotBlock } from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { AddClassCategory } from "./components/editor-class-category";
import { ClassCategoryItem } from "./components/class-category-item";

function PageClassCategory() {
  const { data: classCategories, isLoading: isFetching, fetchAgeCategories } = useAgeCategories();
  const isLoading = !classCategories && isFetching;
  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Kelas">
      <ContentHeader>
        <div>
          <h2>Pengaturan Kelas</h2>
          <p>Pengaturan Kelas untuk Archer</p>
        </div>

        <div>
          <AddClassCategory onSuccessSubmit={fetchAgeCategories} />
        </div>
      </ContentHeader>

      <div>
        <AsyncUI isLoading={isLoading} fallbackUI={<SpinnerDotBlock />}>
          {classCategories?.length ? (
            <ClassCategoryListContainer>
              {classCategories.map((classCategory) => (
                <ClassCategoryItem
                  key={classCategory.id}
                  classCategory={classCategory}
                  onSuccessSubmit={fetchAgeCategories}
                />
              ))}
            </ClassCategoryListContainer>
          ) : (
            <div>Belum ada data</div>
          )}
        </AsyncUI>
      </div>
    </ContentLayoutWrapper>
  );
}

function AsyncUI({ isLoading, children, fallbackUI }) {
  return isLoading ? fallbackUI : children;
}

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;

    > * + * {
      margin-left: 0.5rem;
    }
  }
`;

const ClassCategoryListContainer = styled.ol`
  margin: 0;
  padding: 0;
  counter-reset: question-number-counter 0;
  list-style: none;

  > * + * {
    margin-top: 1rem;
  }

  li {
    counter-increment: question-number-counter 1;
    display: flex;
    align-items: flex-start;

    > * {
      flex-grow: 1;
    }

    &::before {
      content: counter(question-number-counter);
      margin: 0;
      flex-shrink: 0;

      min-width: 3.25rem;
      padding: 1rem 1rem 1rem 1rem;
      color: var(--ma-blue);
      font-size: 1.01562rem;
      font-weight: 600;
      line-height: 1.2;
    }
  }
`;

export default PageClassCategory;
