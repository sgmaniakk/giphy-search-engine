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

// TODO - allow the user to adjust the page size, change to INITIAL_PAGE_SIZE 
const PAGE_SIZE = 8;
const INITIAL_PAGE = 1;
const FETCH = 'FETCH';
const CHANGE = 'CHANGE';

class App extends React.Component {

  constructor() {
    super();

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
      let data = null;
      try {
        data = await search(this.state.searchBarInput, PAGE_SIZE, this.state.currentPage);
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
    console.log('newpage!', e.target.text);
    this.setState({
      ...this.state,
      currentPage: parseInt(e.target.text),
    }, () => {
      this.fetchResults(CHANGE);
    });
  }

  render = () => {
    let paginationItems = [];
    const maxPaginationItems = 8;
    const numItems = this.state.totalCount > PAGE_SIZE 
      ? Math.floor(this.state.totalCount / PAGE_SIZE) 
      : this.state.totalCount;
    const createPageItem = (num) => {
      console.log(this.state.currentPage, num);
      return (
        <Pagination.Item 
              key={num}
              active={num === this.state.currentPage}
        >
          {num}
        </Pagination.Item>
      );
    };
    if (numItems > 1) {
      paginationItems.push(<Pagination.Prev key={'prev'}/>);
      if (numItems < maxPaginationItems) {
        for (let i = 1; i <= numItems; i++) {
          paginationItems.push(
            createPageItem(i)
          );
        }
      } else {
        for (let i = 1; i < Math.floor(maxPaginationItems/2) + 1; i++) {
          paginationItems.push(
            createPageItem(i)
          );
        }
        paginationItems.push(<Pagination.Ellipsis key={'ellipsis'}/>);
        for (let i = numItems - Math.floor(maxPaginationItems/2); i < numItems; i++) {
          paginationItems.push(
            createPageItem(i)
          );
        }
      }
      paginationItems.push(<Pagination.Next key={'next'}/>);
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
            <ReactLoading className="centered" type={'spin'} color={'black'} height={'20%'} width={'20%'} />
          :
            (this.state.totalCount > 0 ?
              <div>
                <Pagination className='centered' onClick={this.handleChangePage}>
                  {paginationItems}
                </Pagination>
                <GridList
                  className="centered"
                  cols={2}
                  style={{
                    marginLeft: '10%',
                    marginRight: '10%',
                    marginBottom: '10%'
                  }}
                >
                  {this.state.fetchedData.map(tile => (
                    <CopyToClipboard key={tile.id} text={tile.images.original.url}>
                      <GridListTile cols={tile.cols || 1}>
                        <img src={tile.images.original.url} alt={tile.title}/>
                      </GridListTile>
                    </CopyToClipboard>
                  ))}
                </GridList>
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
