import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import style from './index.module.css';
import Pagination from '../../../../components/Pagination';

import CategoryApi from '../../../../api/Category';

function CategoryList() {
  const [categories, setCategories] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  const pageNum = queryParams.get('page');
  const history = useHistory();

  const [page, setPage] = useState(pageNum ? pageNum : 1);
  const [perPage, setPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    CategoryApi.getAll({}, page).then(({ data }) => {
      setCategories(data.data);
      setPerPage(data.per_page);
      setTotalItems(data.total);
      setLastPage(data.last_page);
    });
  }, [page]);

  const onPageChange = (selected) => {
    setPage(selected + 1);

    history.push(`?page=${selected + 1}`);
  };

  const renderCatList = () => {
    return categories.map((category, idx) => {
      return (
        <Card className={style.card} key={idx}>
          <Card.Header id={style.cardHeader}>
          <p className={style.cardTitle}>{category.name}</p>
            <p className={style.cardSubtitle}>{category.description}</p>
          </Card.Header>
          <Card.Body>
            {category.subcategories_count ? (
              <Link to={`/categories/${category.id}/sub`}>
                <div>
                    {' '}
                    <Card.Title >
                      <a id={style.Subtitle}>
                        View Available Subcategories: 5
                      </a>
                    </Card.Title>{' '}
                </div>
              </Link>
            ) : (
              <Link to={`/categories/${category.id}/quizzes`}>
                <div>
                    {' '}
                    <Card.Title>
                     <a id={style.Subtitle}>
                        View Available Subcategories: 6
                      </a>
                    </Card.Title>{' '}
                </div>
              </Link>
            )}
          </Card.Body>
        </Card>
      );
    });
  };
  const renderPaginate = () => {
    return (
      <nav aria-label="Page navigation example" style={{alignItems:'center'}}>
        <div style={{display:'inline-block',marginRight:'10px'}}>1 - 12 of 24</div>
        <ul className="pagination" style={{display:'inline-flex'}}>
          <li className="page-item" id={style.paginaPrevNext}><a className="page-link" id={style.btcolor} href="#">Prev</a></li>
          <li className="page-item" id={style.paginateNum}><a className="page-link" id={style.btcolor} href="#">1</a></li>
          <li className="page-item" id={style.paginateNum}><a className="page-link" id={style.btcolor} href="#">2</a></li>
          <li className="page-item" id={style.paginateNum}><a className="page-link" id={style.btcolor} href="#">3</a></li>
          <li className="page-item" id={style.paginaPrevNext}><a className="page-link" id={style.btcolor} href="#">Next</a></li>
        </ul>
      </nav>
    );
  };

  return (
    <div style={{padding: '0px 196px', color:'#48535B'}}>
      <p className={style.title}>Categories</p>
      {categories === null ? (
        <div className={style.loading}>
          <Spinner animation="border" role="status"></Spinner>
          <span className={style.loadingWord}>Loading</span>
        </div>
      ) : (
        <div>
          <div className={style.cardList}>
            {renderCatList()}
          </div>
          <div>
            {renderPaginate()}
          </div> 
        </div>
      )}

      {categories?.length <= 0 ? (
        <div className={style.noResultsMessage}>
          <p className={style.message}>NO RESULTS FOUND</p>
        </div>
      ) : (
        <div className="pt-4">
          <Pagination
            page={page}
            perPage={perPage}
            totalItems={totalItems}
            pageCount={lastPage}
            onPageChange={onPageChange}
          ></Pagination>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
