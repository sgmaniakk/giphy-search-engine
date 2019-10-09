import React from 'react';
import '../styles/App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SearchBar from 'material-ui-search-bar';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      fetchedData: [
        {img: 'https://supersimple.com/wp-content/uploads/hello-2-1080-740.jpg', title:'hello'},
        {img: 'https://www.himgs.com/imagenes/hello/social/hello-fb-logo.png', title:'what'},
        {img: 'https://i.ytimg.com/vi/ZJAbLpm3AXA/maxresdefault.jpg', title:'is'},
        {img: 'https://cdn1.vectorstock.com/i/1000x1000/24/50/cartoon-lama-design-hello-card-with-cute-vector-20402450.jpg', title:'up my good man?'}
      ]
    };
  }

  render = () => {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
          <SearchBar
            onChange={() => console.log('onChange')}
            onRequestSearch={() => console.log('onRequestSearch')}
            style={{
              margin: '0 auto',
              maxWidth: 800
            }}
          />
          <GridList cols={2}>
            // TODO - show results in grid;
            {this.state.fetchedData.map(tile => (
              <GridListTile key={tile.img} cols={tile.cols || 1}>
                <img src={tile.img} alt={tile.title} />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
