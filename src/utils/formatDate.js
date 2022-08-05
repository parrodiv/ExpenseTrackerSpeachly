

const formatDate = (date) => {
  const d = new Date(date)
  let month = `${d.getMonth() + 1}` //because months begin from 0 (array based)
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if(month.length < 2){
    month = `0${month}`  // 9 (september)  --> 09
  }
  if(day.length < 2){
    day = `0${day}`  
  }

  return [year, month, day].join('-')  //array -> string with - separator
}

export default formatDate
