import axios from "axios"

const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
  return (
    axios
      .get(baseUrl)
      .then(response => response.data)
  )
}

const create = (nameObject) => {
  return (
    axios
      .post(baseUrl, nameObject)
      .then(response => response.data)
  )
}

const deletePerson = (person) => {
  return (
    axios
      .delete(`${baseUrl}/${person.id}`)
  )
}

const replace = (person) => {
  return (
    axios
      .put(`${baseUrl}/${person.id}`, person)
      .then(response => response.data)
  )
}

export default {
  getAll,
  create,
  deletePerson,
  replace
}