import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GridListTile from '@material-ui/core/GridListTile';

export default function ImageGridList(props) {
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
      

  const classes = useStyles();
  return (
    <div className={classes.root}>
        <GridList
            cellHeight={160}
            className={classes.gridList}
            cols={2}
            >
            {props.fetchedData.map(tile => (
                <CopyToClipboard key={tile.id} text={tile.images.original.url}>
                <GridListTile cols={tile.cols || 1}>
                    <img src={tile.images.original.url} alt={tile.title}/>
                </GridListTile>
                </CopyToClipboard>
            ))}
        </GridList>
    </div>
    );
}