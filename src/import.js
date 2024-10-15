//var baseurl = "https://raw.githubusercontent.com/nicolasboeuf/decarbonization-observatory-data/master/"
var baseurl = "https://raw.githubusercontent.com/nicolasboeuf/decarbonization-observatory-data-preprod/master/"

export const getConfig = async function (store) {
	try{
		// const dataRequest = await fetch("data/config.json")
		const dataRequest = await fetch(baseurl+"config.json")
		if(dataRequest.ok){
			const data = await dataRequest.json()	
			store.commit('initializeConfig',{data:data})
			store.commit("configEndImport")
		}
	}
	catch(error){
		console.log(error)
	}
}

export const getCurrentEmissionsData = async function (store,param) {
	try{
		const dataRequest = await fetch(baseurl+"current_emissions/"+param+".json")
		if(dataRequest.ok){
			const data = await dataRequest.json()	
			store.commit('initializeCurrentEmissionsData',{data:data,param:param})
			store.commit("currentEmissionsDataEndImport",1)
		}
	}
	catch(error){
		console.log(error)
	}
}

export const getGlobalTempData = async function (store) {
	try{
		const dataRequest = await fetch(baseurl+"global_temp/global_temp.json")
		if(dataRequest.ok){
			const data = await dataRequest.json()	
			store.commit('initializeglobalTempData',data)
			store.commit("globalTempDataEndImport",1)
		}
	}
	catch(error){
		console.log(error)
	}
}

export const getImpactScenariosData = async function (store,param) {
	try{
		const dataRequest = await fetch(baseurl+"impact_scenarios/"+param+".json")
		if(dataRequest.ok){
			const data = await dataRequest.json()	
			store.commit('initializeImpactScenariosData',{data:data,param:param})
			store.commit("impactScenariosDataEndImport",1)
		}
	}
	catch(error){
		console.log(error)
	}
}


export const getCombinedImpactData = async function (store,param) {
	try{
		const dataRequest = await fetch(baseurl+"combined_impact/"+param+".json")
		if(dataRequest.ok){
			const data = await dataRequest.json()	
			store.commit('initializeCombinedImpactData',{data:data,param:param})
			store.commit("combinedImpactDataEndImport",1)
		}
	}
	catch(error){
		console.log(error)
	}
}
