import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ onChange }) => {
  return (
    <p>
      filter shown with <input onChange={onChange}/>
    </p>
  )
}

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

const Persons = ({ persons, filter, handleDelete }) => {
  return (
    <>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <Person key={person.name} person={person} handleDelete={handleDelete}/> )}
    </>
  )
}

const Person = ({ person, handleDelete }) => (
  <div>
    {person.name}
    {person.number}
    <button onClick={() => handleDelete(person)}>delete</button>
  </div>
)

const Notification = ({ success, message }) => {
  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const green = {
    color: 'green'
  }

  const red = {
    color: 'red'
  }

  console.log("notification = ", message)

  if (message === "") {
    return null
  } else {
    if (success) {
      return (
        <div style={Object.assign(notificationStyle, green)}>
          <p>{message}</p>
        </div>
      )
    } else {
      return (
        <div style={Object.assign(notificationStyle, red)}>
          <p>{message}</p>
        </div>
      )
    }
  }
}

const App = () => {

  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification ] = useState('')
  const [ success, setSuccess ] = useState(0)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('response', response)
        setPersons(response)  
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
      personService
        .create(nameObject)
        .then(response => {
          console.log("response to post request", response)
          setPersons(persons.concat(response))
          setNotification(`Added ${response.name}`)
          setSuccess(1)
          setTimeout(() => {
            setNotification("")
          }, 5000)
          setNewName("")
          setNewNumber("")
        })

    } else {
      if (window.confirm(`${nameObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(person => person.name === nameObject.name)
        const newPerson = {...oldPerson, number: nameObject.number}
        console.log("oldPerson =", oldPerson)
        console.log("newPerson =", newPerson)
        personService
          .replace(newPerson)
          .then(response => {
            console.log("response to update =", response)
            setPersons(persons.map(person => person.id !== newPerson.id ? person : newPerson))
            setNotification(`Updated the number of ${response.name}`)
            setSuccess(1)
            setTimeout(() => {
              setNotification("")
            }, 5000)
          })
          .catch(error => {
              console.log("error is", error)
              setNotification(`Information of ${newPerson.name} has already been removed from server`)
              setSuccess(0)
              setPersons(persons.filter(person => person.id !== newPerson.id))
            }
          )
      }
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
  }

  const deletePerson = (person) => {
    console.log(person)
    if (window.confirm(`Delete ${person.name}?`)) {
      return (
        personService
          .deletePerson(person)
          .then(setPersons(persons.filter(remain => remain.id !== person.id)))
      )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification success={success} message={notification}/>
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
      <Persons
        persons={persons} 
        filter={filter}
        handleDelete={deletePerson}/>
    </div>
  )
}

export default App