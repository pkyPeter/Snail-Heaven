function getBestProfit ( input ) {
	let bestProfit = 0;
	let min = input[0];
	for ( let i = 1 ; i < input.length ; i++ ) {
		if ( input[i] < min ) { min = input[i] }
		if ( ( input[i] - min ) > 0 && ( input[i] - min ) > bestProfit ) {
				bestProfit = input[i] - min;
		}
	}
	return bestProfit;
}

module.exports = getBestProfit;