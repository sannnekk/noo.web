import type { Task } from '@/core/data/entities/Task'

export function automatedCheck(task: Task, answer: string): number {
  if (task.rightAnswer?.includes('|')) {
    const rightAnswers = task.rightAnswer.split('|')

    const scores = rightAnswers.map((rightAnswer) => {
      switch (task.type) {
        case 'word':
          return checkWord(
            answer,
            rightAnswer,
            task.highestScore,
            task.checkingStrategy
          )
        default:
          return 0
      }
    })

    return Math.max(...scores)
  }

  switch (task.type) {
    case 'word':
      return checkWord(
        answer,
        task.rightAnswer ?? undefined,
        task.highestScore,
        task.checkingStrategy
      )
    default:
      throw new Error(`Unsupported task type: ${task.type}`)
  }
}

function checkWord(
  word: string | undefined,
  rightAnswer: string | undefined,
  maxScore: number,
  checkingStrategy: Task['checkingStrategy']
): number {
  if (!word || !rightAnswer) {
    return 0
  }

  word = word.toLowerCase().replaceAll(' ', '')
  rightAnswer = rightAnswer.toLowerCase().replaceAll(' ', '')

  switch (checkingStrategy) {
    case 'type1':
      return checkType1(word, rightAnswer, maxScore)
    case 'type2':
      return checkType2(word, rightAnswer, maxScore)
    case 'type3':
      return checkType3(word, rightAnswer, maxScore)
    case 'type4':
    default:
      return checkType4(word, rightAnswer, maxScore)
  }
}

/**
 * First type (exact match or 0):
 *  - 1 symbol difference: 0
 */
function checkType1(word: string, exact: string, maxScore: number): number {
  return word.trim().toLowerCase() === exact.trim().toLowerCase() ? maxScore : 0
}

/**
 * Second type (for everu wrong character -1):
 *  - 1 symbol difference: -1
 */
function checkType2(word: string, exact: string, maxScore: number): number {
  exact = exact.trim().toLowerCase()
  word = word.trim().toLowerCase().padEnd(exact.length, ' ')
  let score = maxScore

  for (let i = 0; i < word.length; i++) {
    if (word[i] !== exact[i]) {
      score--
    }
  }

  return score < 0 ? 0 : score
}

/**
 * Third type (for every wrong character -1, for every extra character -1, for every missing character -1):
 *  - 1 symbol difference: -1
 */
function checkType3(word: string, exact: string, maxScore: number): number {
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

/**
 * Fourth type:
 *  - 2 or less symbol difference: -1
 *  - for every extra character -1
 *  - else 0
 */
function checkType4(word: string, exact: string, maxScore: number): number {
  exact = exact.trim().toLowerCase()
  word = word.trim().toLowerCase()

  maxScore -= Math.abs(word.length - exact.length)

  word = word.padEnd(exact.length, ' ')

  let errorCount = 0

  for (let i = 0; i < word.length; i++) {
    if (word[i] !== exact[i]) {
      errorCount++
    }
  }

  return errorCount === 0 ? maxScore : errorCount <= 2 ? maxScore - 1 : 0
}
