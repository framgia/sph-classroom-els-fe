import React from 'react';
import ReactPaginate from 'react-paginate';
import { PropTypes } from 'prop-types';
import style from './index.module.css';

const Pagination = ({ page, perPage, totalItems, pageCount, onPageChange }) => {
  const amountPerPage = () => {
    let start = page * perPage - (perPage - 1);
    let end = Math.min(start + perPage - 1, totalItems);

    return `${start} - ${end} of ${totalItems}`;
  };

  return (
    <div className="d-flex align-items-center">
      <p className={style.pageDescription}>{totalItems > 0 ? amountPerPage() : ''}</p>
      <ReactPaginate
        containerClassName={'pagination'}
        pageLinkClassName={`page-link ${style.pageLink}`}
        breakLinkClassName={`page-link ${style.pageLink}`}
        previousClassName={page != 1 ? `page-link ${style.pageLink}` : `${style.hideButton}`}
        nextClassName={page != pageCount ? `page-link ${style.pageLink} active` : `${style.hideButton}`}
        activeClassName={ `active ${style.activeLink}`}
        breakLabel="..."
        nextLabel="Next"
        onPageChange={({selected}) => onPageChange(selected)}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        forcePage={page - 1}
      />
    </div>
  );
};

Pagination.propTypes = {

  page: PropTypes.number,
  perPage: PropTypes.number,
  totalItems: PropTypes.number,
  pageCount: PropTypes.number,
  onPageChange: PropTypes.any
};

export default Pagination;
