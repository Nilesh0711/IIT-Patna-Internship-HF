const fs = require('fs');

function calculateAverage(numbers) {
  const validNumbers = numbers.filter(number => !isNaN(number));

  if (validNumbers.length === 0) {
    return 0;
  }

  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return sum / validNumbers.length;
}

fs.readFile('attach/attach_dqn_500.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  console.log('Data from file:', data);

  const numbers = data
    .trim()
    .split('\n')
    .map(Number);

  const average = calculateAverage(numbers);
  fs.appendFileSync("avg_dqn.txt", "\nattach_dqn_500: " + average)
});

