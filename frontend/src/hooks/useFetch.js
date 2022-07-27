import {useState, useEffect, useRef} from "react"

function useFetch(url, options) {
   
    const optionsRef = useRef(options)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {

            try {
                const res = await fetch(url, optionsRef.current)
                const data = await res.json()
                // console.log(data)
                setData(data)
                setLoading(false)
            } catch (error) {
                setData(null)
                setError(error)
                setLoading(false)
            }
        }

        fetchData()

    }, [url, optionsRef])

    return {loading, error, data}
}

export default useFetch