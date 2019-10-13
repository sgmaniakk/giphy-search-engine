import React from 'react';
import '../styles/App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SearchBar from 'material-ui-search-bar';
import search from '../services/giphyAPI';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactLoading from 'react-loading';
import Pagination from 'react-bootstrap/Pagination'
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGridList from './ImageGridList';

// TODO - allow the user to adjust the page size, change to INITIAL_PAGE_SIZE 
const PAGE_SIZE = 8;
const INITIAL_PAGE = 1;
const MAX_PAGINATION_ITEMS = 8;
const FETCH = 'FETCH';
const CHANGE = 'CHANGE';

// NOTE - there seems to be a bug, you can only retreive 5000 items per search
// otherwise, you will receive no results on your query
const MAX_OFFSET = 5000;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchBarInput: '',
      fetchedData: [],
      isLoading: false,
      totalCount: 0,
      currentPage: INITIAL_PAGE,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      ...this.state,
      searchBarInput: e,
    });
  }

  fetchResults = async (action) => {
    this.setState({
      ...this.state,
      isLoading: true,
      currentPage: action === FETCH ? INITIAL_PAGE : this.state.currentPage,
    }, async () => {

      const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      // doing this to demo the loading component :-)
      await sleep(1500);

      let data = null;
      try {
        data = await search(this.state.searchBarInput, PAGE_SIZE, this.state.currentPage-1);
      } catch (e) {
        console.log(e);
        //TODO: handle error here
      } finally {
        this.setState({
          ...this.state,
          fetchedData: data ? data.data : [],
          isLoading: false,
          totalCount: data? data.pagination.total_count : 0,
        });
      }
    });
  }

  handleChangePage = async (e) => {
    // we want to ignore anytime the user clicks on the Pagination
    // component, but does not click on a button
    if (!e.target.text) {
      return;
    }
    this.setState({
      ...this.state,
      currentPage: parseInt(e.target.text),
    }, () => {
      this.fetchResults(CHANGE);
    });
  }

  render = () => {
    let paginationItems = [];
    const maxItems = Math.floor(MAX_OFFSET / PAGE_SIZE);
    let numItems = this.state.totalCount > PAGE_SIZE
      ? Math.floor(this.state.totalCount / PAGE_SIZE) 
      : this.state.totalCount;

    if (numItems > maxItems) {
      numItems = maxItems;
    }

    const createPageItem = (num) => {
      return (
        <Pagination.Item 
              key={num}
              active={num === this.state.currentPage}
        >
          {num}
        </Pagination.Item>
      );
    };
    if (numItems > MAX_PAGINATION_ITEMS){
      for (let i = 1; i < Math.floor(MAX_PAGINATION_ITEMS/2) + 1; i++) {
        paginationItems.push(
          createPageItem(i)
        );
      }
      paginationItems.push(<Pagination.Ellipsis key={'ellipsis'}/>);
      for (let i = numItems - Math.floor(MAX_PAGINATION_ITEMS/2) + 1; i < numItems + 1; i++) {
        paginationItems.push(
          createPageItem(i)
        );
      }
    } else if (numItems > 1) {
      for (let i = 1; i <= numItems; i++) {
        paginationItems.push(
          createPageItem(i)
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
          <h1>Gif Search</h1>
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
          {this.state.isLoading ?
            <div className='centered'>
              <ReactLoading type={'spin'} color={'black'} height={'30%'} width={'30%'}/>
            </div>
          :
            (this.state.totalCount > 0 ?
              <div>
                <Pagination className='centered' onClick={this.handleChangePage}>
                  {paginationItems}
                </Pagination>
                <div style={{
                    overflowY: 'scroll'
                  }}>
                  <ImageGridList fetchedData={this.state.fetchedData}/>
                </div>
              </div>
              :
              null
            )
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
