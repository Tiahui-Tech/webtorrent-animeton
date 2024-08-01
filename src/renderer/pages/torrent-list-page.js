const React = require('react')

const RssFeed = require('../components/torrent-list/rss-feed');
const AnimeFeed = require('../components/torrent-list/anime-feed');

const TorrentList = ({ state }) => {
  return (
    <div>
      <RssFeed state={state} />
      <AnimeFeed state={state} />
    </div>
  )
}
module.exports = TorrentList
