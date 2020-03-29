import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Title = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, count, text }) => (
  <button onClick={() => handleClick(count + 1)}>{text}</button>
)

const Statistic = ({ text, value }) => {
  if (text === "percentage") {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const average = (good - bad) / (good + neutral + bad)

  if (good + neutral + bad === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <table>
      <tbody>
        <Statistic text="good" value={good}/>
        <Statistic text="neutral" value={neutral}/>
        <Statistic text="bad" value={bad}/>
        <Statistic text="all" value={good + neutral + bad}/>
        <Statistic text="average" value={average}/>
        <Statistic text="percentage" value={good / (good + neutral + bad) * 100}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <Title text="give feedback"/>
      <Button handleClick={setGood} count={good} text="good"/>
      <Button handleClick={setNeutral} count={neutral} text="neutral"/>
      <Button handleClick={setBad} count={bad} text="bad"/>
      <Title text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)