export const DefaultDataFetching = {
	data: () => ({
		totalSize: 0,
		tableData: [],
		isFrist: true,
		currentPage: 1,
		perPage: 20,
		perPageOptions: [10, 20, 30, 40, 50],
		sortDesc: false,
		items: [],
		totalItems: [],
		originalItems: [],
		sortBy: '',
		isBusy: false,
		// row 정보
		clickedRowInfo: {},
		clickedIndex: 0,

		// modal Options
		modalRowInfo: {},
		openModalMode: '',
		openModalTitle: '',
		openModalType: '',

		//alertModal -- 보류중
		alertMessage: '',
		//이미지 path
		images: [],
		//변경
		selected: [],
		fields: [],
		excel: {
			fields: {},
			data: [],
			meta: [{key: 'charset', value: 'utf-8'}],
		},
		selectMode: 'multi',
	}),
	created() {
		console.log('mixxxxxxxxxxxxxxxx');
	},
	method: {},
};
export default DefaultDataFetching;
