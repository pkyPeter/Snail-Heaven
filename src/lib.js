
const lib = {
	func: {},
}

lib.func.get = (selector) => {
	return document.querySelector(selector);
};
lib.func.getAll = (selector) => {
	return document.querySelectorAll(selector);
};

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




export default lib;
