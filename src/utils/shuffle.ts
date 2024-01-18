export function shuffle<T>(arr: T[]): T[] {
  const shuffledArray = [...arr]; // Create a shallow copy of the original array

  let i: number = shuffledArray.length;
  let j: number;
  let temp: T;

  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = shuffledArray[j];
    shuffledArray[j] = shuffledArray[i];
    shuffledArray[i] = temp;
  }

  return shuffledArray;
}
