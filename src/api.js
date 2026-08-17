const PROD_API_URL = 'https://car-wale-x3ml.onrender.com/api'
const LOCAL_API_URL = 'http://localhost:5000/api'

export const API_URL = import.meta.env.VITE_API_URL ||
	(typeof window !== 'undefined' && window.location.hostname === 'localhost'
		? LOCAL_API_URL
		: PROD_API_URL)
