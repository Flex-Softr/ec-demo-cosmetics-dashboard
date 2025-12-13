"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { setPage } from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function PagePagination() {
  const dispatch = useAppDispatch();
  const {
    page: currentPage,
    limit,
    totalPage,
    total,
    isLoading,
    expand,
  } = useAppSelector(({ pagination }) => pagination);
  const pages = [...Array(totalPage)].map((_, index) => index + 1);

  let newPage;
  if (expand) {
    newPage = pages;
  } else if (totalPage <= 5) {
    newPage = pages;
  } else {
    const siblingsCount = 1; // Number of siblings to show on each side of the current page
    const leftSiblingIndex = Math.max(0, currentPage - siblingsCount - 1);
    const rightSiblingIndex = Math.min(
      totalPage - 1,
      currentPage + siblingsCount - 1
    );

    if (currentPage - siblingsCount > 2) {
      // If there are more than 2 pages to the left of the current page
      newPage = [1, "..."].concat(
        pages.slice(leftSiblingIndex, rightSiblingIndex + 1)
      );
    } else {
      newPage = pages.slice(0, rightSiblingIndex + 1);
    }

    if (currentPage + siblingsCount < totalPage - 1) {
      // If there are more than 2 pages to the right of the current page
      newPage = newPage.concat(["...", totalPage]);
    } else {
      newPage = newPage.concat(pages.slice(rightSiblingIndex + 1));
    }
  }

  const showFrom = currentPage * limit - limit;

  return (
    <Pagination>
      <PaginationContent className="overflow-x-auto">
        <div className="flex items-center justify-start">
          <p className="mr-20 min-w-48">
            Showing {total !== 0 ? showFrom + 1 : showFrom} to{" "}
            {currentPage * limit < total ? currentPage * limit : total} of{" "}
            {total}
          </p>
        </div>
        <PaginationItem>
          <PaginationPrevious
            className={`cursor-pointer bg-gray-100 hover:bg-gray-100 `}
            onClick={() => dispatch(setPage(currentPage - 1))}
            size={"sm"}
            disabled={isLoading || currentPage === 1}
          />
        </PaginationItem>
        {newPage.map((item, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => dispatch(setPage(item))}
              size={"sm"}
              className={`cursor-pointer bg-gray-100 hover:bg-gray-100 ${currentPage === item && "bg-primary hover:bg-primary text-white hover:text-white"}`}
              disabled={isLoading}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className={`cursor-pointer bg-gray-100 hover:bg-gray-100`}
            onClick={() => dispatch(setPage(currentPage + 1))}
            size={"sm"}
            disabled={isLoading || currentPage === totalPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
