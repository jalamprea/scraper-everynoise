// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


const osmosis = require('osmosis');
const utils = require('core-util-is');
const BASE_URL = 'http://everynoise.com/';


/**
 * Scraper optional params:
 * - includes : 			Array with the list of only genres that should be included  
 * - excludes : 			Array with the list of only genres that should be excluded
 * - callbackByGenre: 	 	Main callback executed once is available each artist by each genre
 * - callbackLogByGenre: 	Callback used as LOG information on the artists by each gender
 * - callbackErrorByGenre: 	Callback used as ERROR handler on the artists by each gender
 * - callbackLogGeneral: 	Callback used as LOG information on the list of all genres page
 * - callbackErrorGeneral: 	Callback used as ERROR handler on the list of all genres page
 **/
function scrape(options) {

	var genres = 'engenremap.html';
	var xpath = 'div .genre.scanme';

	osmosis.get(BASE_URL + genres)
	.find(xpath).set({
		title: 'text()',
		href: '@href'
	}).data((listing) => {

		var scanThis = true;
		if (utils.isObject(options)) {

			if (utils.isArray(options.includes)) {
				scanThis = options.includes.indexOf(listing.title)>=0;
			} else {
				if (utils.isArray(options.excludes)) {
					scanThis = !(options.excludes.indexOf(listing.title)>=0);
				}
			}
		}

		if (scanThis) {
			osmosis.get(BASE_URL + listing.href)
			.find(xpath).set('name').data((artist) => {

				artist.name = artist.name.replace(/\»/g, '');
				
				options.callbackByGenre(listing.title, artist.name.trim());

			}).log(function(log) {
				options.callbackLogByGenre(log, listing.title);
			}).error(options.callbackErrorByGenre);
		}
	})
	.log(options.callbackLogGeneral)
	.error(options.callbackErrorGeneral);
}

exports.scrape = scrape;
