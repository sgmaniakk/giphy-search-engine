import React from 'react';
import '../styles/App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SearchBar from 'material-ui-search-bar';
import search from '../services/giphyAPI';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';

const PAGE_SIZE = 8;
const INITIAL_PAGE = 0;

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

  handleRequestSearch = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
      currentPage: INITIAL_PAGE,
    });
    const data = await search(this.state.searchBarInput, PAGE_SIZE, INITIAL_PAGE);
    this.setState({
      ...this.state,
      fetchedData: data.data,
      isLoading: false,
      totalCount: data.pagination.total_count,
    });
  }

  handleChangePage = async (newPage) => {
    this.setState({
      ...this.state,
      isLoading: true,
      currentPage: newPage,
    });
    const data = await search(this.state.searchBarInput, PAGE_SIZE, newPage);
    this.setState({
      ...this.state,
      fetchedData: data.data,
      isLoading: false,
    });
  }

  render = () => {
    console.log(Math.floor(this.state.totalCount/PAGE_SIZE), this.state.totalCount);
    return (
      <MuiThemeProvider>
        <div className="App">
          <h1>Gif Search</h1>
          <div className="centered">
            <SearchBar
              onChange={(e) => this.handleInputChange(e)}
              onRequestSearch={() => this.handleRequestSearch()}
              style={{
                marginBottom: '10%',
                maxWidth: '50%',
              }}
            />
          </div>
          {this.state.isLoading ?
            <ReactLoading className="centered" type={'spin'} color={'black'} height={'20%'} width={'20%'} />
          :
            (this.state.totalCount > 0 ?
              <div>
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
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  pageCount={Math.floor(this.state.totalCount/PAGE_SIZE)}
                  pageRangeDisplayed={7}
                  marginPagesDisplayed={3}
                />
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
