import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GridListTile from '@material-ui/core/GridListTile';
import PropTypes from 'prop-types';

const DATA = 'data';

export default function ImageGridList({ fetchedData }) {
  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'scroll',
      backgroundColor: '#ffffff',
    },
    gridList: {
      width: 500,
      height: 350,
    },
  }));

  ImageGridList.defaultProps = {
    fetchedData: {},
  };

  ImageGridList.propTypes = {
    fetchedData: PropTypes.shape({
      data: PropTypes.array,
      meta: PropTypes.object,
      pagination: PropTypes.object,
    }),
  };

  const classes = useStyles();
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      { (DATA in fetchedData)
        ? (
          <div className={classes.root}>
            { fetchedData.data.length > 0
              ? (
                <GridList
                  cellHeight={160}
                  className={classes.gridList}
                  cols={2}
                >
                  {fetchedData.data.map((tile) => (
                    <CopyToClipboard key={tile.id} text={tile.images.original.url}>
                      <GridListTile cols={tile.cols || 1}>
                        <img src={tile.images.original.url} alt={tile.title} />
                      </GridListTile>
                    </CopyToClipboard>
                  ))}
                </GridList>
              )
              : <h2>No results :/ Please try searching something else.</h2>}
          </div>
        )
        : null}
    </div>
  );
}
