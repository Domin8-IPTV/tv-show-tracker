/**
 * Entry point of the library
 */

const schedule = require('./src/schedule');
const search = require('./src/search');
const debug = require('debug')('tv-show-tracker:');
const download = require('./src/download');
const config = require('config');

/**
 * Update schedule and search available torrents for downloading.
 */
async function start() {
  try {
    await schedule.update();
    const availableEpisodes = await schedule.getAvailableEpisodes();

    if (!availableEpisodes.length) {
      throw 'No new available episodes';
    }

    await search(availableEpisodes);
    await download.downloadTorrents();

    if(config.get('restart')) {
      restart();
    }
  } catch (err) {
    debug(err);
  }

}

function restart () {
  debug('Restarting...');
  setTimeout(start, 5000);
}

start();
