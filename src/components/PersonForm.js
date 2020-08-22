import React from 'react'

const PersonForm = ({ submitEvt, name, nameChange,
    number, numberChange }) => (
        <form onSubmit={submitEvt}>
            <div>
                name: <input value={name} onChange={nameChange} />
            </div>
            <div>
                number: <input value={number} onChange={numberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )

const Person = ({ p, deleteHandler }) => (
    <li>
        {p.name} {p.number}
        <button onClick={deleteHandler}>delete</button>
    </li>

)

export { PersonForm, Person }