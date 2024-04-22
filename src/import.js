export const getData = async function (store,param) {
	const dataRequest = await fetch("data/"+param+".json")
	const data = await dataRequest.json()
	store.commit('initializeData',{data:data,param:param})
	store.commit("endImport",1)
	return true
}