const React = require('react')
// const { dispatcher } = require('../lib/dispatcher')

const RssFeed = require('../components/torrent-list/rss-feed');
const AnimeFeed = require('../components/torrent-list/anime-feed');

const TorrentList = ({ state }) => {
  return (
    <div
      // key='torrent-list'
      // onContextMenu={dispatcher('openTorrentListContextMenu')}
    >
      <RssFeed state={state} />
      <AnimeFeed state={state} />
    </div>
  )
}
module.exports = TorrentList
