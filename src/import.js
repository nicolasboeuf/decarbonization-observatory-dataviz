export const getcurrentEmissionsData = async function (store,param) {
	const dataRequest = await fetch("data/current_emissions/"+param+".json")
	const data = await dataRequest.json()
	store.commit('initializeCurrentEmissionsData',{data:data,param:param})
	store.commit("currentEmissionsDataEndImport",1)
	return true
}

export const getGlobalTempData = async function (store) {
	const dataRequest = await fetch("data/global_temp/global_temp.json")
	const data = await dataRequest.json()
	store.commit('initializeglobalTempData',data)
	store.commit("globalTempDataEndImport",1)
	return true
}