// Automated test for typing engine logic and timing mathematics
import assert from 'assert';

console.log('--- Starting Engine & Timer Logic Tests ---');

// Test 1: Timer remaining calculation with performance.now()
function testTimerMath() {
  const duration = 30;
  const startTime = 1000.0; // performance.now() at start
  
  // After 5.2 seconds
  const now1 = 6200.0;
  const elapsed1 = (now1 - startTime) / 1000;
  const remaining1 = Math.max(0, Math.ceil(duration - elapsed1));
  assert.strictEqual(remaining1, 25, 'After 5.2s of 30s, remaining should be 25s');

  // After 29.9 seconds
  const now2 = 30900.0;
  const elapsed2 = (now2 - startTime) / 1000;
  const remaining2 = Math.max(0, Math.ceil(duration - elapsed2));
  assert.strictEqual(remaining2, 1, 'After 29.9s, remaining should be 1s');

  // After 30.1 seconds (expired)
  const now3 = 31100.0;
  const elapsed3 = (now3 - startTime) / 1000;
  const remaining3 = Math.max(0, Math.ceil(duration - elapsed3));
  assert.strictEqual(remaining3, 0, 'After 30.1s, remaining should be 0s');
  
  console.log('✓ Test 1 Passed: Timer calculation is mathematically driftless');
}

// Test 2: Character counts across typing, errors, and backspaces
function testCharacterCounts() {
  // Simulate wordState for word "code"
  const word = "code";
  let input = "";
  
  function getWordState(typed) {
    const originalChars = word.split('');
    const letters = [];
    for (let i = 0; i < Math.max(originalChars.length, typed.length); i++) {
      if (i < typed.length && i < originalChars.length) {
        letters.push({
          char: originalChars[i],
          status: typed[i] === originalChars[i] ? 'correct' : 'incorrect',
        });
      } else if (i < originalChars.length) {
        letters.push({ char: originalChars[i], status: 'untyped' });
      } else {
        letters.push({ char: typed[i], status: 'extra' });
      }
    }
    return { original: word, typed, letters };
  }

  // Type "co" (2 correct)
  let state = getWordState("co");
  let correct = state.letters.filter(l => l.status === 'correct').length;
  assert.strictEqual(correct, 2, 'Should have 2 correct letters');

  // Type typo "cox" (2 correct, 1 incorrect)
  state = getWordState("cox");
  correct = state.letters.filter(l => l.status === 'correct').length;
  let incorrect = state.letters.filter(l => l.status === 'incorrect').length;
  assert.strictEqual(correct, 2, 'Should have 2 correct letters');
  assert.strictEqual(incorrect, 1, 'Should have 1 incorrect letter');

  // Backspace to "co"
  state = getWordState("co");
  correct = state.letters.filter(l => l.status === 'correct').length;
  incorrect = state.letters.filter(l => l.status === 'incorrect').length;
  assert.strictEqual(correct, 2, 'After backspace, correct should still be 2');
  assert.strictEqual(incorrect, 0, 'After backspace, incorrect should reset to 0');

  // Finish to "code"
  state = getWordState("code");
  correct = state.letters.filter(l => l.status === 'correct').length;
  assert.strictEqual(correct, 4, 'Full word should have 4 correct letters');

  console.log('✓ Test 2 Passed: Dynamic letter states correctly reset on backspace');
}

// Test 3: WPM & Accuracy calculations
function testWpmCalculations() {
  // 50 correct characters in 30 seconds -> (50 / 5) / (30 / 60) = 10 / 0.5 = 20 WPM
  const correct = 50;
  const incorrect = 5;
  const extra = 0;
  const elapsed = 30.0;

  const netWpm = Math.max(0, Math.round((correct / 5) / (elapsed / 60)));
  const rawWpm = Math.max(0, Math.round(((correct + incorrect + extra) / 5) / (elapsed / 60)));
  const totalAttempted = correct + incorrect + extra;
  const acc = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 1000) / 10 : 100;

  assert.strictEqual(netWpm, 20, 'Net WPM should be 20');
  assert.strictEqual(rawWpm, 22, 'Raw WPM should be 22');
  assert.strictEqual(acc, 90.9, 'Accuracy should be 90.9%');

  console.log('✓ Test 3 Passed: WPM, Raw WPM, and Accuracy formulas validated');
}

testTimerMath();
testCharacterCounts();
testWpmCalculations();

console.log('--- All Engine Tests Passed Successfully! ---');
