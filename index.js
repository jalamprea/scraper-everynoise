const osmosis = require('osmosis');
const BASE_URL = 'http://everynoise.com/';


function startScraper() {

	var genres = 'engenremap.html';
	var xpath = 'div .genre.scanme';

	var i = 0;
	osmosis.get(BASE_URL + genres)
		.find(xpath).set({
			title: 'text()',
			href: '@href'
		}).data((listing)=>{
		
		console.log(i);
		console.log(listing.title);
		osmosis.get(BASE_URL + listing.href)
			.find(xpath).set('name').data((artist)=>{
				console.log(listing.title + ' - ', artist.name);
			});

		i++;
	});
}

startScraper();