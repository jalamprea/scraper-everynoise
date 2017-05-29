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


function scrape(options, callback, callbackLog, callbackError) {

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
				if ( callback && utils.isFunction(callback) ) {
					callback(listing.title, artist.name.trim());
				} else {
					console.log(listing.title + ' - ', artist.name);
				}
			}).log(callbackLog);
		}
	});
}

exports.scrape = scrape;
