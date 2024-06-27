export const getConfig = async function (store) {
	//const dataRequest = await fetch("data/config.json")
	const dataRequest = await fetch("https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/config.json")
	const data = await dataRequest.json()
	store.commit('initializeConfig',{data:data})
	store.commit("configEndImport")
	return true
}

export const getCurrentEmissionsData = async function (store,param) {
	const dataRequest = await fetch("https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/current_emissions/"+param+".json")
	const data = await dataRequest.json()
	store.commit('initializeCurrentEmissionsData',{data:data,param:param})
	store.commit("currentEmissionsDataEndImport",1)
	return true
}

export const getGlobalTempData = async function (store) {
	const dataRequest = await fetch("https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/global_temp/global_temp.json")
	const data = await dataRequest.json()
	store.commit('initializeglobalTempData',data)
	store.commit("globalTempDataEndImport",1)
	return true
}

export const getImpactScenariosData = async function (store,param) {
	const dataRequest = await fetch("https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/impact_scenarios/"+param+".json")
	const data = await dataRequest.json()
	store.commit('initializeImpactScenariosData',{data:data,param:param})
	store.commit("impactScenariosDataEndImport",1)
	return true
}

export const getCombinedImpactData = async function (store,param) {
	const dataRequest = await fetch("https://raw.githubusercontent.com/nicolasboeuf/carbon-pledges/master/public/data/combined_impact/"+param+".json")
	const data = await dataRequest.json()
	store.commit('initializeCombinedImpactData',{data:data,param:param})
	store.commit("combinedImpactDataEndImport",1)
	return true
}
