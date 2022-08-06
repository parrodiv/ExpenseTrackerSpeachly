import { useContext } from 'react'
import { ExpenseTrackerContext } from './context/context'

import {
  incomeCategories,
  expenseCategories,
  resetCategories,
} from './constants/categories'

//*********transactionsPerType (income)
// [
//   {
//     amount: 40
//     category: "Investments"
//     date: "2022-08-06"
//     id: "d81a2cef-b0b4-4f19-a008-b5e2ad2e208a"
//     type: "Income"
//   },
//   {
//     amount: 80
//     category: "Lottery"
//     date: "2022-08-06"
//     id: "d81a2cef-b0b4-4f19-a008-b5e2ad2e208a"
//     type: "Income"
//   },
//  {
//     amount: 50
//     category: "Investments"
//     date: "2022-08-06"
//     id: "d81a2cef-b0b4-4f19-a008-b5e2ad2e208a"
//     type: "Income"
//   },
// ]

//*********incomeCategories */
// [
//   { type: 'Business', amount: 0, color: incomeColors[0] },
//   { type: 'Investments', amount: 90 (40+50), color: incomeColors[1] },
//   { type: 'Lottery', amount: 80, color: incomeColors[2] },
// ]

const useTransactions = (title) => {
  resetCategories() //reset the amount of each specific category to 0
  const { transactions } = useContext(ExpenseTrackerContext)
  const transactionsPerType = transactions.filter((t) => t.type === title) //select only 'Income' or 'Expense' trans
  const total = transactionsPerType.reduce(
    (acc, currVal) => (acc += currVal.amount),
    0
  ) //total amount of selected transactions
  const categories = title === 'Income' ? incomeCategories : expenseCategories //categories in the file categories.js


  console.log({ transactionsPerType, total, categories })

  transactionsPerType.forEach((t) => {
    const category = categories.find((c) => c.type === t.category)

    if(category) category.amount += t.amount
    // 1 transaction contains category = Investments of 100 than find category Investment in incomeCategories 
    // and append the amount of transaction on the amount in that specific category (SEE EXAMPLE ABOVE)
  })

  const filteredCategories = categories.filter(c => c.amount > 0)
  // we need to do this because we don't want to display categories that don't have any amount on the chart

  const chartData = {
     labels: filteredCategories.map(c => c.type),
    datasets: [
      {
        data: filteredCategories.map(c => c.amount),
        backgroundColor: filteredCategories.map(c => c.color)
      }
    ],
   
  }

  return { total, chartData }
}

export default useTransactions
