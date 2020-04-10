import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Finder = ({ title, onChange }) => {
  return (
    <p>
      {title} <input onChange={onChange}/>
    </p>
  )
}

const DetailedCountry = ({ country }) => {
  console.log("DETAILED VIEW")
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h4>languages</h4>
      <ul>
        {country.languages.map(language => <li key={language.iso639_1}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={`Flag of ${country.name}`} height="100" width="100"></img>
    </div>
  )
}
 
const Countries = ( {countries, finder }) => {
  const queriedCountries = countries.filter(country => country.name.toLowerCase().includes(finder))
  const [show, setShow] = useState([])

  const handleShowClick = (e) => {
    console.log("HANDLESHOWCLICK")
    console.log("show=", show)
    return setShow(e)
  }

  if(queriedCountries.length === 250) {
    return null
  } else if(queriedCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if(queriedCountries.length === 1) {
    return <DetailedCountry country={queriedCountries[0]}/>
  } else {
    return (
      queriedCountries.map(country => <Country key={country.name} country={country} handleClick={handleShowClick} />)
    )
  }
}

const Country = ({ country }) => {
  return (
    <div>
      {country.name}
      <button>show</button>
    </div>
  )
}

const App = () => {
  const [ finder, setFinder ] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    console.log("effect")
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  console.log("countries length", countries.length)

  const handleFinderChange = (event) => {
    return (
      setFinder(event.target.value.toLowerCase())
    )
  }

  return (
    <>
      <Finder title="find countries " onChange={handleFinderChange} />
      <Countries countries={countries} finder={finder}/>
    </>
  )
  
}

export default App