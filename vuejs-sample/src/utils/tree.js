const $tree = {};

$tree.init = (data, props) => {
	let output = [];

	let defaultProps = {
		opened: false,
		selected: false,
		disabled: false,
	};

	if (props === undefined) {
		props = defaultProps;
	} else {
		props = Object.assign(defaultProps, props);
	}

	if (Array.isArray(data)) {
		data.forEach((obj) => {
			obj.opened = obj.isLeaf ? true : props.opened;
			obj.selected = obj.selected ? obj.selected : props.selected;
			obj.disabled = obj.disabled ? obj.disabled : props.disabled;

			if (obj.children && obj.children.length > 0) {
				obj.icon = '';
				$tree.init(obj.children, props);
			} else {
				obj.icon = 'ion ion-ios-settings';
			}

			output.push(obj);
		});

		return output;
	} else {
		data.opened = data.isLeaf !== null ? true : props.opened;
		data.selected = data.selected ? data.selected : props.selected;
		data.disabled = data.disabled ? data.disabled : props.disabled;
		data.icon = 'ion ion-ios-settings';

		return data;
	}
};

$tree.addChildNode = (clickedNode, object) => {
	clickedNode.model.icon = '';
	clickedNode.model.selected = false;

	clickedNode.model.children = clickedNode.model.children || [];
	clickedNode.model.addChild($tree.init(object, true));
};

export default $tree;
