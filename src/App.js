import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import { PersonForm, Person } from './components/PersonForm'
import personServer from './services/persons'


const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className={message[0]}>
            {message[1]}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        personServer
            .getAll()
            .then(data => setPersons(data))
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        const trimName = newName.trim();
        const trimNumber = newNumber.trim();
        if (trimName === '' || trimNumber === '') {
            alert('name or number input is empty')
            return
        }
        const personObj = {
            name: trimName,
            number: trimNumber
        }
        const filterP = persons.filter(p => p.name === trimName)
        if (filterP.length !== 0) {
            const result = window.confirm(`${filterP[0].name} is already added to phonebook, replace the old number with a new one?`)
            if (result) {
                personServer
                    .update(filterP[0].id, personObj)
                    .then(data => {
                        setPersons(persons.map(p => p.name === trimName ? data : p))
                        setNewName('')
                        setNewNumber('')
                        setMessage(['message',`Updated ${data.name}`])
                        setTimeout(() => setMessage(null), 3000)
                    })
                    .catch(error => {
                        setPersons(persons.filter(p=>p.name !== trimName))
                        setMessage(["error",`Information of ${trimName} has already been removed from server`])
                        setTimeout(() => setMessage(null), 3000)
                    })
            }
            return
        }
        personServer
            .create(personObj)
            .then(data => {
                setPersons(persons.concat(data))
                setNewName('')
                setNewNumber('')
                setMessage(['message',`Added ${data.name}`])
                setTimeout(() => setMessage(null), 3000)
            })
    }

    const deletePerson = id => {
        const delPerson = persons.filter(p => p.id === id)[0]
        const result = window.confirm(`Delete ${delPerson.name}?`)
        if (!result) return;
        personServer
            .del(id)
            .then(data => {
                setPersons(persons.filter(p => p.id !== id))
                setMessage(`Deleted ${delPerson.name}`)
                setTimeout(() => setMessage(''), 2000)
            })
    }

    const handleNameChange = (evt) => {
        setNewName(evt.target.value)
    }

    const handleNumberChange = (evt) => {
        setNewNumber(evt.target.value)
    }

    const handleFilterChange = (evt) => {
        setFilter(evt.target.value)
    }

    const filterPersons = filter === '' ? persons :
        persons.filter(
            p => p.name.toLowerCase().indexOf(filter) !== -1)

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} />
            <Filter val={filter} evt={handleFilterChange} />
            <h2>Add a new</h2>
            <PersonForm submitEvt={addPerson} name={newName}
                nameChange={handleNameChange} number={newNumber}
                numberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <ul>
                {filterPersons.map((p, i) =>
                    <Person p={p} key={i} deleteHandler={() => deletePerson(p.id)} />)}
            </ul>
        </div>
    )
}

export default App