
const lib = {
	func: {},
}

lib.func.get = (selector) => {
	return document.querySelector(selector);
};
lib.func.getAll = (selector) => {
	return document.querySelectorAll(selector);
};

lib.func.getStyle = ( element, attribute )=>{
	let style = getComputedStyle( element ).getPropertyValue( attribute );
	return style;
}

lib.func.toggleClass = ( action , target, classes) => {
	//classes: please put in array
	if ( action === "toggle" ) {
		let targetToChange = document.querySelectorAll(target);
		for ( let j = 0 ; j < targetToChange.length ; j++) {
			for ( let k = 0 ; k < classes.length ; k ++) {
				targetToChange[j].classList.toggle(classes[k]);
			}
		}
	} else if ( action === "remove" ) {
		let targetToChange = document.querySelectorAll(target);
		for ( let j = 0 ; j < targetToChange.length ; j++) {
			for ( let k = 0 ; k < classes.length ; k ++) {
				targetToChange[j].classList.remove(classes[k]);
			}
		}
	}
}
lib.func.searchInsideArray = ( srcArray, target ) => {
	let existed = false;
	for ( let i = 0 ; i < srcArray.length ; i ++ ) {
		if ( srcArray[i] === target ) {
			existed = true;
		}
	}
	return existed;
}
lib.func.getQueryStringAndSearch = ( target ) => {
	console.log('lib getQueryString')
	let queryString = window.location.search;
	let targetQuery = target;
	if (queryString.search(targetQuery) !== -1) {
		return true
	} else {
		return false
	}
}

lib.func.getLocalStorageJSON = ( storageName ) => {
	let current = localStorage.getItem(storageName);
	let JSONparsed = JSON.parse(current);
	return JSONparsed
}

lib.func.fetchData = ( route ) => {
	return fetch(route).then( res => {
		console.log("step1",res);
		return res.json();
	} ).then ( data => {
		console.log(data);
	}).catch( result => {console.log('something went wrong')})
}


export default lib;
