import React from 'react';
import '../styles/App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SearchBar from 'material-ui-search-bar';
import search from '../services/giphyAPI';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      searchBarInput: '',
      fetchedData: [],
    };
  }

  handleInputChange = (e) => {
    this.setState({
      ...this.state,
      searchBarInput: e,
    });
  }

  handleRequestSearch = async () => {
    const data = await search(this.state.searchBarInput);
    this.setState({
      ...this.state,
      fetchedData: data.data
    });
  }

  render = () => {
    return (
      <MuiThemeProvider>
        <div className="App">
          <h1>Gif Search</h1>
          <SearchBar
            onChange={(e) => this.handleInputChange(e)}
            onRequestSearch={() => this.handleRequestSearch()}
            style={{
              marginBottom: '10%',
              maxWidth: '50%',
            }}
          />
          <GridList 
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
      </MuiThemeProvider>
    );
  }
}

export default App;
