import React from 'react'

const Filter = ({ value, evt }) => (
    <p>
        filter shown with <input value={value} onChange={evt} />
    </p>
)

export default Filter