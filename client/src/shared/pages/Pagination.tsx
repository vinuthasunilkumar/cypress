import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const Paging = (props: any) => {
  const pageItem = props?.pagination as IPageItem;
  const [currentPage, setCurrentPage] = useState(pageItem?.pageNumber);

  const pageClick = (page: number) => {
    setCurrentPage(page);
    props.onPageChange(page);
    window.scrollTo({ top: 0, left: 0 });
  };

  let page = pageItem?.pageNumber;
  let pages = pageItem?.totalPages;

  let isPageNumberOutOfRange: boolean;

  const items = [...new Array(pages)].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pages;
    const isCurrentPageWithin2PageNumbers =
      Math.abs(pageNumber - currentPage) <= 2;

    if (
      isPageNumberFirst ||
      isPageNumberLast ||
      isCurrentPageWithin2PageNumbers
    ) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          activeLabel=""
          data-testid={`page-${pageNumber}`}
          onClick={() => pageClick(pageNumber)}
          key={pageNumber}
          active={pageNumber === page}
        >
          {pageNumber}
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return (
        <Pagination.Ellipsis
          key={pageNumber}
          onClick={() =>
            pageClick(
              currentPage > pageNumber ? currentPage - 4 : pageNumber + 1
            )
          }
        >
          <span>
            <i className="fa-regular fa-ellipsis"></i>
          </span>
        </Pagination.Ellipsis>
      );
    }

    return null;
  });

  const minShowing = () => {
    return pageItem?.totalCount === 0
      ? 0
      : (currentPage - 1) * pageItem?.countPerPage + 1;
  };

  const maxShowing = () => {
    const maybeMax = currentPage * pageItem?.countPerPage;
    return Math.min(maybeMax, pageItem?.totalCount);
  };

  return (
    <div className="d-flex align-items-center justify-content-between mt-3">
      <div className="d-flex">
        {
          props.tableKeyHeader && (
            <div className="align-items-center justify-content-between">
              <span className="table-key-note-header">{props.tableKeyHeader}:</span>
              <span className="table-key-note-text">
                <i className={`${props.tableKeyNoteIcon} mx-1`}></i>
                {props.tableKeyNote}
              </span>
            </div>
          )
        }
      </div>
      <div className="d-flex justify-content-end flex-column">
        <Pagination className="pagination pagination-md justify-content-end">
          <Pagination.First
            data-testid="firstPage"
            onClick={() => pageClick(1)}
            disabled={page === 1}
            role="button"
            aria-label="firstPage"
          >
            <span>
              <i className="fa-regular fa-angles-left"></i>
            </span>
          </Pagination.First>

          <Pagination.Prev
            onClick={() => pageClick(page - 1)}
            disabled={page === 1}
            data-testid="prevPage"
            role="button"
            aria-label="prevPage"
          >
            <span>
              <i className="fa-regular fa-angle-left"></i>
            </span>
          </Pagination.Prev>

          {items}
          <Pagination.Next
            data-testid="nextPage"
            onClick={() => pageClick(page + 1)}
            disabled={page === pages}
            role="button"
            aria-label="nextPage"
          >
            <span>
              <i className="fa-regular fa-angle-right"></i>
            </span>
          </Pagination.Next>

          <Pagination.Last
            data-testid="lastPage"
            onClick={() => pageClick(pages)}
            disabled={page === pages}
            role="button"
            aria-label="lastPage"
          >
            <span>
              <i className="fa-regular fa-angles-right"></i>
            </span>
          </Pagination.Last>
        </Pagination>
        {pageItem?.totalCount > 10 && (
          <div
            className="dataTables_info justify-content-end"
            role="status"
            aria-live="polite"
          >
            Showing {minShowing()} to {maxShowing()} of {pageItem?.totalCount}{" "}
            entries
          </div>
        )}
      </div>
    </div>
  );
};

export default Paging;
