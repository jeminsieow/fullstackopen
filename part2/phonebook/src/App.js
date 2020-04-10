import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PersonForm = ({ handleSubmit, handleNameChange, handleNumberChange, newName, newNumber }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ onChange }) => {
  return (
    <p>
      filter shown with <input onChange={onChange}/>
    </p>
  )
}

const Person = ({ person }) => (
  <p>{person.name} {person.number}</p>
)

const Persons = ({ persons, filter }) => {
  return (
    <>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <Person key={person.name} person={person}/> )}
    </>
  )
}

const App = () => {

  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('response', response)
        setPersons(response.data)  
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if (persons.filter(person => person.name === newName).length === 0) {
      setPersons(persons.concat(nameObject))
      setNewName("")
      setNewNumber("")
    } else {
      console.log("this name already exists")
      window.alert(`${newName} is already added to phonebook`)
      setNewName("")
      setNewNumber("")
    }
  }

  const handleNameChange = (event) => {
    return (setNewName(event.target.value))
  }

  const handleNumberChange = (event) => {
    return (setNewNumber(event.target.value))
  }

  const handleFilterChange = (event) => {
    return setFilter(event.target.value)
    // return (setPersons(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        handleSubmit={addName} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App