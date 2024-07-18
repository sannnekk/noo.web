const data = [
  '123-123-2-2',
  '12-123-2-1',
  '1234-123-2-1',
  '321-123-2-2',
  '312-123-2-2',
  '213-123-2-2',
  '231-123-2-2',
  '13-123-2-1',
  '31-123-2-1',
  '21-123-2-1',
  '214-123-2-1',
  '2143-123-2-1',
  '456-123-2-0',
  '12345-123-2-0',
  '12346-123-2-0',
  '123456-123-2-0',
  '1-123-2-0',
  '2-123-2-0',
  '3-123-2-0',
  '12-12-2-2',
  '1-12-2-1',
  '2-12-2-1',
  '21-12-2-2',
  '123-12-2-1',
  '1234-12-2-0',
  '25-12-2-1',
  '121-123-2-1',
  '122-123-2-1',
  '11-12-2-1',
  '31-12-2-1',
  '124-123-2-1',
  '126-123-2-1',
  '145-123-2-0',
  '12-345-2-0',
  '1212-123-2-0',
  '111-123-2-0',
  '1111-123-2-0',
  '11111-123-2-0'
]

for (const item of data) {
  const items = item.split('-')

  const exact = items[1]
  const word = items[0]
  const maxScore = parseInt(items[2])
  const rightScore = parseInt(items[3])

  const result = checkType3(word, exact, maxScore)

  if (result === rightScore) {
    console.log('Correct: ' + item)
  } else {
    console.log('Wrong: ' + item + `[schould: ${rightScore}, is: ${result}]`)
  }
}

function checkType3(word, exact, maxScore) {
  exact = exact.trim().toLowerCase()
  word = word.trim().toLowerCase()
  let score = maxScore

  for (let i = 0; i < exact.length; i++) {
    if (!word.includes(exact[i])) {
      score--
    }
  }

  let missingLetters = 0

  if (exact.length < word.length) {
    for (let i = 0; i < word.length; i++) {
      if (!exact.includes(word[i])) {
        missingLetters++
      }
    }

    if (word.length - exact.length !== missingLetters) {
      return 0
    }
  }

  score = score - missingLetters

  return score < 0 ? 0 : score
}
