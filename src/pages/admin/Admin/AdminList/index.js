import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useToast } from '../../../../hooks/useToast';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from '../../../../components/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { VscFilter } from 'react-icons/vsc';
import Pagination from '../../../../components/Pagination';
import DataTable from '../../../../components/DataTable';
import AdminApi from '../../../../api/Admin';
import style from './index.module.scss';
import { BiSearch } from 'react-icons/bi';

const AdminList = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const pageNum = queryParams.get('page');
  const sortBy = queryParams.get('sortBy') || '';
  const searchVal = queryParams.get('search');
  const sortDirection = queryParams.get('sortDirection') || '';
  const history = useHistory();
  const toast = useToast();

  const [adminAccounts, setAdminAccounts] = useState();
  const [page, setPage] = useState(pageNum ? parseInt(pageNum) : 1);
  const [perPage, setPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [search, setSearch] = useState(searchVal ? searchVal : '');
  const [searchStatus, setSearchStatus] = useState(false);
  const [sortOptions, setSortOptions] = useState({
    sortBy,
    sortDirection
  });

  const tableHeaderNames = [
    { title: 'ID', canSort: true },
    { title: 'Action', canSort: false },
    { title: 'Name', canSort: true },
    { title: 'Email', canSort: true }
  ];

  useEffect(() => {
    history.push(
      `?page=${page}&search=${search}&sortBy=${sortOptions.sortBy}&sortDirection=${sortOptions.sortDirection}`
    );

    setAdminAccounts(null);

    load();
  }, [page, searchStatus, sortOptions]);

  const load = () => {
    AdminApi.getAdminAccounts({
      page,
      search,
      sortBy: sortOptions.sortBy,
      sortDirection: sortOptions.sortDirection
    })
      .then(({ data }) => {
        setAdminAccounts(data.data);
        setPerPage(data.per_page);
        setTotalItems(data.total);
        setLastPage(data.last_page);
      })
      .catch(() =>
        toast('Error', 'There was an error getting the list of admin accounts.')
      );
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();

    setPage(1);
    setSearchStatus(!searchStatus);
  };

  function onChangeData(e) {
    setSearch(e.target.value);

    if (e.target.value.length === 0) {
      setPage(1);
      setSearchStatus(!searchStatus);
    }
  }

  const onPageChange = (selected) => {
    setPage(selected + 1);
  };

  const renderTableData = () => {
    return adminAccounts?.map((admin, idx) => {
      return (
        <tr key={idx} className={style.tableDataRow}>
          <td className={style.tableData}>{admin.id}</td>
          <td className={`${style.tableData}`}>
            <Button buttonLabel="Delete" buttonSize="sm" outline={true}/>
          </td>
          <td className={style.tableData}>{admin.name}</td>
          <td className={style.tableData}>{admin.email}</td>
        </tr>
      );
    });
  };

  return (
    <div className={style.mainContent}>
      <div className={style.headerTittleStyle}>
        <h1 className={style.pageTitle}>Admin Accounts</h1>
        <Link to="/admin/create-admin-account">
          <Button buttonLabel="Add an Admin" buttonSize="def"/> 
        </Link>
      </div>
      <Card className={style.card}>
        <Card.Header className={style.cardHeader}>
          <Form className={style.searchSection} onSubmit={onSearchSubmit}>
            <div className={style.searchInput}>
              <Form.Control
                className={style.searchBar}
                type="text"
                aria-label="Search"
                value={search}
                onChange={onChangeData}
                placeholder="Search name or email"
              />
              <BiSearch size={17} className={style.searchIcon} />
            </div>
            <Button className={style.searchButton} buttonSize="sm" buttonLabel="Search" type="submit" />
          </Form>
          <Dropdown>
            <Dropdown.Toggle className={style.dropdownButton} bsPrefix="none">
              Filter
              <VscFilter size={17} />
            </Dropdown.Toggle>
          </Dropdown>
        </Card.Header>
        <Card.Body className={style.cardBody}>
          <DataTable
            tableHeaderNames={tableHeaderNames}
            renderTableData={renderTableData}
            titleHeaderStyle={style.tableHeader}
            sortOptions={sortOptions}
            setSortOptions={setSortOptions}
            data={adminAccounts}
          />
        </Card.Body>
      </Card>
      <section>
        <div id={style.pagPosition}>
          <Pagination
            page={page}
            perPage={perPage}
            totalItems={totalItems}
            pageCount={lastPage}
            onPageChange={onPageChange}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminList;
