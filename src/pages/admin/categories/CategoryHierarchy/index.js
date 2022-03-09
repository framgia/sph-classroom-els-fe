import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../../../hooks/useToast';
import { GoKebabVertical } from 'react-icons/go';
import { RiArrowRightSLine } from 'react-icons/ri';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import CategoryApi from '../../../../api/Category';
import style from './index.module.scss';

const CategoryHierarchy = () => {
  const toast = useToast();
  const queryParams = new URLSearchParams(window.location.search);
  const categoryID = queryParams.get('categoryID');
  const [categories, setCategories] = useState();
  const [chosenCategoryPathID, setChosenCategoryPathID] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    setCategories(null);
    chosenCategoryPathID || categoryID
      ? toast('Processing', 'Getting the subcategories...')
      : toast('Processing', 'Getting the root categories...');

    if (categoryID && !chosenCategoryPathID) {
      getParentCategories();
    }

    load();
  }, [chosenCategoryPathID]);

  const load = () => {
    CategoryApi.getCategories({
      category_id: chosenCategoryPathID || categoryID
    })
      .then(({ data }) => {
        setCategories(data.data);
      })
      .catch(() =>
        toast('Error', 'There was an error getting the list of categories.')
      );
  };

  const getParentCategories = () => {
    CategoryApi.getParentCategories(categoryID)
      .then(({ data }) => {
        setBreadcrumbs(data);
      })
      .catch((error) => toast('Error', error));
  };

  const onCategoryClick = (category, index) => {
    if (category.subcategories_count > 0) {
      setChosenCategoryPathID(category.id);
      setBreadcrumbs([
        ...breadcrumbs,
        { id: category.id, name: category.name, idx: index }
      ]);
    } else {
      toast('Message', 'This category does not have a subcategory.');
    }
  };

  const onBreadcrumbClick = (category_id, index) => {
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setChosenCategoryPathID(category_id);
  };

  return (
    <div className={style.mainContent}>
      <div>
        <div className={style.breadcrumbsContainer}>
          <span>Category Hierarchy</span>
          <RiArrowRightSLine className={style.breadcrumbArrowIcon} />
          <span
            className={style.breadcrumbs}
            onClick={() => {
              setChosenCategoryPathID(null);
              setBreadcrumbs([]);
            }}
          >
            Root
          </span>
          {breadcrumbs?.map((breadcrumb, idx) => {
            return (
              <Fragment key={idx}>
                <RiArrowRightSLine className={style.breadcrumbArrowIcon} />
                <span
                  className={style.breadcrumbs}
                  onClick={() => {
                    onBreadcrumbClick(breadcrumb.id, idx);
                  }}
                >
                  {breadcrumb.name}
                </span>
              </Fragment>
            );
          })}
        </div>
      </div>
      <ListGroup>
        {categories ? (
          categories?.map((category, idx) => {
            return (
              <ListGroup.Item key={idx} className={style.listItems}>
                <div
                  className={style.clickableArea}
                  onClick={() => {
                    onCategoryClick(category, idx);
                  }}
                >
                  <Link to={`/admin/edit-category/${category.id}`}>
                    <span className={style.categoryName}>{category.name}</span>
                  </Link>
                </div>
                <Dropdown>
                  <Dropdown.Toggle className={style.kebabMenu} bsPrefix="none">
                    <GoKebabVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={style.kebabMenuList}>
                    <Dropdown.Item className={style.kebabMenuItems}>
                      Move to...
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to={`/admin/add-category?categoryViewType=Hierarchy&categoryID=${category.id}`}
                      className={style.kebabMenuItems}
                    >
                      Add child
                    </Dropdown.Item>
                    <Dropdown.Item className={style.kebabMenuItems}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ListGroup.Item>
            );
          })
        ) : (
          <div className={style.spinner}>
            <Spinner animation="border" />
            <span>Loading</span>
          </div>
        )}
      </ListGroup>
    </div>
  );
};

export default CategoryHierarchy;
