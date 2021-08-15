const $utils = {};

$utils.clone = (object) => {
	return Object.assign({}, object);
};

$utils.cloneProp = (object) => {
	let output;

	if (typeof object === 'object') {
		output = {};

		Object.keys(object).forEach((key) => {
			if (typeof object[key] === 'object') {
				if (
					object[key] === null ||
					object[key] === undefined ||
					object[key] === true ||
					object[key] === false
				)
					output[key] = object[key];
				else {
					output[key] = $utils.cloneProp(object[key]);
				}
				// } else if (typeof object[key] === 'array') {
			} else if (Array.isArray(object[key])) {
			} else {
				output[key] = object[key];
			}
		});
		// } else if (typeof object === 'array') {
	} else if (Array.isArray(object)) {
		output = [];

		object.forEach((object) => {
			output.push($utils.cloneProp(object));
		});
	}

	return output;
};

$utils.copyObject = (object1, object2) => {
	for (let key in object2) {
		if (object2[key]) {
			object1[key] = object2[key];
		}
	}
};

$utils.copyTreeNode = (_treeData, _compareData) => {
	_treeData.forEach((data) => {
		if (data.nodeNo === _compareData.nodeNo) {
			$utils.copyObject(data, _compareData);
		} else if (data.children) {
			if (data.children.length > 0) {
				data.icon = '';
			} else {
				data.icon = 'ion ion-ios-settings';
			}

			$utils.copyTreeNode(data.children, _compareData);
		}
	});
};

$utils.getYyyymmdd = (value) => {
	return value !== null ? value.split(' ')[0] : '';
};

$utils.getSaleStateString = (value) => {
	switch (value) {
		case 0:
			return '미수정 광고중';
		case 3:
			return '광고중';
		case 5:
			return '계약중';
		case 9:
			return '판매완료';
	}
};
// 날짜 하이픈 삽입 ex) 20200101 -> 2020-01-01
$utils.strDayChange = (value) => {
	let strDayChangeHyphen = '';
	if (value) {
		strDayChangeHyphen = value;
		if (value.length === 8) {
			strDayChangeHyphen = value.replace(
				/(\d{4})(\d{2})(\d{2})/,
				'$1-$2-$3',
			);
		}
		return strDayChangeHyphen;
	}
};
export default $utils;
