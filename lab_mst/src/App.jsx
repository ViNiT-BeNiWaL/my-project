import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Rajat', age: 20 },
    { id: 2, name: 'Manav', age: 19 }
  ])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const handleAddStudent = (e) => {
    e.preventDefault()
    if (!name || !age) return
    const newStudent = {
      id: students.length + 1,
      name,
      age: Number(age)
    }
    setStudents([...students, newStudent])
    setName('')
    setAge('')
  }

  return (
    <>
      <div className="container">
      <h1>Student Form</h1>
      <form className="student-form" onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
        <button type="submit">Add Student</button>
      </form>
      <div className="tiles">
        {students.map(student => (
          <div className="tile" key={student.id}>
            <h2>{student.name}</h2>
            <p>Age: {student.age}</p>
            <span>ID: {student.id}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default App
