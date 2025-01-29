import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const questions = [
  {
    question: 'What is 2 + 2?',
    answers: [
      { text: '3', correct: false },
      { text: '4', correct: true },
      { text: '5', correct: false },
      { text: '6', correct: false },
    ],
  },
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'Berlin', correct: false },
      { text: 'Paris', correct: true },
      { text: 'Madrid', correct: false },
      { text: 'Rome', correct: false },
    ],
  },
];

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [animations, setAnimations] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(3); // Default speed

  useEffect(() => {
    if (gameStarted) {
      const newAnimations = questions[currentQuestion].answers.map(
        () => new Animated.Value(height) // Ensure initialization here
      );
      setAnimations(newAnimations);
      startAnimations(newAnimations);
    }
  }, [currentQuestion, gameStarted]);

  const startAnimations = (animations) => {
    animations.forEach((animation, index) => {
      if (animation) {
        Animated.timing(animation, {
          toValue: -50,
          duration: (speed + index) * 1000,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  const handleStartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setGameStarted(true);
  };

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <View style={styles.startScreen}>
          <Text style={styles.title}>Welcome to the Quiz Game!</Text>
          <Text style={styles.label}>Set Speed (seconds):</Text>
          <View style={styles.speedControls}>
            <TouchableOpacity onPress={() => setSpeed((prev) => Math.max(1, prev - 1))} style={styles.speedButton}>
              <Text style={styles.speedText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.speedDisplay}>{speed}</Text>
            <TouchableOpacity onPress={() => setSpeed((prev) => prev + 1)} style={styles.speedButton}>
              <Text style={styles.speedText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>
          {questions[currentQuestion].answers.map((answer, index) => (
            <Animated.View
              key={index}
              style={[styles.answer, { transform: [{ translateY: animations[index] || height }] }]}
            >
              <TouchableOpacity
                style={styles.answerButton}
                onPress={() => handleAnswer(answer.correct)}
              >
                <Text style={styles.answerText}>{answer.text}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          <Text style={styles.score}>Score: {score}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    padding: 20,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  speedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  speedButton: {
    backgroundColor: '#61dafb',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  speedText: {
    fontSize: 18,
    color: '#282c34',
  },
  speedDisplay: {
    fontSize: 18,
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#61dafb',
    padding: 15,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 18,
    color: '#282c34',
  },
  question: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  answer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  answerButton: {
    backgroundColor: '#61dafb',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  answerText: {
    fontSize: 18,
    color: '#282c34',
  },
  score: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
