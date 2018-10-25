import favicon from "./imgs/favicon.ico"

const lib = {
	init: {},
	func: {},
}
lib.init.getFavicon = () => {
	let link = document.createElement("link");
	link.rel = "shortcut icon";
	link.href = favicon;
	document.head.appendChild(link);
}

lib.init.loadLine = (src) => {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function() {
      resolve();
    });
    script.addEventListener('error', function(e) {
      reject(e);
    });
    document.body.appendChild(script);
  });
}

document.addEventListener('load', lib.init.getFavicon());
// document.addEventListener('load', lib.init.loadLine("https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js"));

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
	// console.log('lib getQueryString')
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

lib.func.getParameter = ( sourceUrl , target ) => {
	let url = new URL(sourceUrl);
	let parameter = url.searchParams.get(target);
	return parameter;
}

export default lib;
