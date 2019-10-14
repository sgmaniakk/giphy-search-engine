/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '../styles/App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchBar from 'material-ui-search-bar';
import ReactLoading from 'react-loading';
import Pagination from 'react-bootstrap/Pagination';
import search from '../services/giphyAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGridList from './ImageGridList';

// TODO - allow the user to adjust the page size, change to INITIAL_PAGE_SIZE
const PAGE_SIZE = 8;
const INITIAL_PAGE = 1;
const MAX_PAGINATION_ITEMS = 8;
const MARGIN_SIZE = 2;
const FETCH = 'FETCH';
const CHANGE = 'CHANGE';

// events to ignore when the user changes page
const IGNORE = ['ellipsisStart', 'ellipsisEnd'];

// NOTE - there seems to be a bug in the Giphy API
// you can only retreive 5000 items per search
// after offset 5000, you will receive no results on your query
const MAX_OFFSET = 5000;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBarInput: '',
      fetchedData: {},
      isLoading: false,
      currentPage: INITIAL_PAGE,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      searchBarInput: e,
    });
  }

  fetchResults = async (action) => {
    this.setState({
      isLoading: true,
      currentPage: action === FETCH ? INITIAL_PAGE : this.state.currentPage,
    }, async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // doing this to demo the loading component :-)
      // otherwise the results will load too quickly
      await sleep(500);

      let data = null;
      try {
        data = await search(this.state.searchBarInput, PAGE_SIZE, this.state.currentPage - 1);
      } catch (e) {
        console.log(e);
        // TODO: handle error here
      } finally {
        this.setState({
          fetchedData: data,
          isLoading: false,
        });
      }
    });
  }

  handleChangePage = async (e) => {
    // we want to ignore anytime the user clicks on the Pagination
    // component, but does not click on a button
    if (!e.target.text || IGNORE.includes(e.target.text)) {
      return;
    }
    this.setState({
      currentPage: parseInt(e.target.text, 10),
    }, () => {
      this.fetchResults(CHANGE);
    });
  }

  render = () => {
    // first we deal with pagination logic
    const paginationItems = [];
    const maxItems = Math.floor(MAX_OFFSET / PAGE_SIZE);
    const totalCount = 'pagination' in this.state.fetchedData ? this.state.fetchedData.pagination.total_count : 0;
    let numItems = totalCount > PAGE_SIZE
      ? Math.floor(totalCount / PAGE_SIZE)
      : totalCount;

    if (numItems > maxItems) {
      numItems = maxItems;
    }

    const createPageItem = (num) => (
      <Pagination.Item
        key={num}
        active={num === this.state.currentPage}
      >
        {num}
      </Pagination.Item>
    );

    // calculate the margins of pagination numbers displayed
    const marginBegin = Math.min(
      Math.max(this.state.currentPage - MARGIN_SIZE, INITIAL_PAGE),
      numItems - (MARGIN_SIZE * 2),
    );
    const marginEnd = Math.max(
      Math.min(this.state.currentPage + MARGIN_SIZE + 1, numItems + 1),
      (MARGIN_SIZE * 2) + 2,
    );

    // construct the pagination elements
    if (numItems > MAX_PAGINATION_ITEMS) {
      if (marginBegin !== INITIAL_PAGE) {
        paginationItems.push(<Pagination.Ellipsis key={IGNORE[0]} />);
      }
      for (let i = marginBegin; i < marginEnd; i += 1) {
        paginationItems.push(
          createPageItem(i),
        );
      }
      // marginEnd is a noninclusive boundary, so we need to add 1 to numItems
      if (marginEnd !== numItems + 1) {
        paginationItems.push(<Pagination.Ellipsis key={IGNORE[1]} />);
      }
    } else if (numItems > 1) {
      for (let i = 1; i <= numItems; i += 1) {
        paginationItems.push(
          createPageItem(i),
        );
      }
    }

    return (
      <MuiThemeProvider>
        <div className="App">
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous"
          />
          <h1 style={{ marginTop: '5%' }}>Gif Search</h1>
          <div className="centered">
            <SearchBar
              onChange={(e) => this.handleInputChange(e)}
              onRequestSearch={() => this.fetchResults(FETCH)}
              style={{
                marginBottom: '3%',
                maxWidth: '50%',
              }}
            />
          </div>
          {this.state.isLoading
            ? (
              <div className="centered">
                <ReactLoading type="spin" color="black" height="30%" width="30%" />
              </div>
            )
            : (
              <div>
                <Pagination className="centered" onClick={this.handleChangePage}>
                  {paginationItems}
                </Pagination>
                <ImageGridList fetchedData={this.state.fetchedData} />
              </div>
            )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
