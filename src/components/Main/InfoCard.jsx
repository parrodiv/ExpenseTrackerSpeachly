import React from 'react'

const isIncome = Math.round(Math.random())
// 50% it will be 0 and 50% it will be 1 --> false/true

const InfoCard = () => {
  return (
    <div style={{ textAlign: 'center', padding: '0 10%' }}>
      Try sayng: <br />
      Add {isIncome ? 'Income ' : 'Expense '}
      for {isIncome ? '€100 ' : '€50 '}
      in Category {isIncome ? 'Salary ' : 'House '}
      for {isIncome ? 'Monday ' : 'Tuesday '}
    </div>
  )
}

export default InfoCard
