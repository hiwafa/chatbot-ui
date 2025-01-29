import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';

import { useNavigation } from 'expo-router';

const { height } = Dimensions.get('window');

const questions = [
    {
        question: 'What is 2 + 2?',
        answers: ['3', '4', '5', '6'],
        correctAnswer: '4',
    },
    {
        question: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctAnswer: 'Paris',
    },
    {
        question: 'Which planet is closest to the Sun?',
        answers: ['Earth', 'Mars', 'Venus', 'Mercury'],
        correctAnswer: 'Mercury',
    },
    {
        question: 'What is the capital of Germany?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctAnswer: 'Berlin',
    },
];

const App = () => {

    const navigation = useNavigation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [speed, setSpeed] = useState(1); // Speed multiplier (1x, 2x, etc.)

    const currentQuestion = questions[currentQuestionIndex];

    useLayoutEffect(() => {
        navigation.setOptions({
            
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 10, marginRight: 10, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.speedButton} onPress={decreaseSpeed}>
                        <Text style={{ color: '#141e3a', fontSize: 21, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#48ffa4', width: 30 }}>{speed}x</Text>
                    <TouchableOpacity style={styles.speedButton} onPress={increaseSpeed}>
                        <Text style={{ color: '#141e3a', fontSize: 21, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#48ffa4' }}>{score}/{questions.length}</Text>
                    <TouchableOpacity onPress={startGame}>
                        <Text style={{ color: '#48ffa4', fontWeight: 'bold' }}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, score, speed]);

    // Animated values for each answer
    const answer1Y = useSharedValue(height);
    const answer2Y = useSharedValue(height);
    const answer3Y = useSharedValue(height);
    const answer4Y = useSharedValue(height);

    // Start animations for the current question
    useEffect(() => {
        if (!isGameStarted || isGameOver) return;

        // Reset animated values
        answer1Y.value = height;
        answer2Y.value = height;
        answer3Y.value = height;
        answer4Y.value = height;

        // Animate answers to the top of the screen
        answer1Y.value = withTiming(-height, { duration: 7000 / speed, easing: Easing.linear });
        answer2Y.value = withTiming(-height, { duration: 9000 / speed, easing: Easing.linear });
        answer3Y.value = withTiming(-height, { duration: 11000 / speed, easing: Easing.linear });
        answer4Y.value = withTiming(-height, { duration: 12000 / speed, easing: Easing.linear });

        // Move to the next question after the longest animation
        const timeout = setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setIsGameOver(true);
            }
        }, 12000 / speed);

        return () => clearTimeout(timeout);
    }, [currentQuestionIndex, isGameStarted, isGameOver, speed]);

    // Handle answer tap
    const handleAnswerTap = (answer) => {
        if (answer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    // Reset the game
    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsGameOver(false);
        setIsGameStarted(true);
    };

    // Start the game
    const startGame = () => {
        setIsGameStarted(true);
        setIsGameOver(false);
        setCurrentQuestionIndex(0);
        setScore(0);
    };

    // Increase speed
    const increaseSpeed = () => {
        if (speed < 5)
            setSpeed((prevSpeed) => prevSpeed + 0.5);
    };

    // Decrease speed
    const decreaseSpeed = () => {
        if (speed > 0.5) {
            setSpeed((prevSpeed) => prevSpeed - 0.5);
        }
    };

    // Animated styles for each answer
    const animatedStyle1 = useAnimatedStyle(() => ({
        transform: [{ translateY: answer1Y.value }],
    }));
    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateY: answer2Y.value }],
    }));
    const animatedStyle3 = useAnimatedStyle(() => ({
        transform: [{ translateY: answer3Y.value }],
    }));
    const animatedStyle4 = useAnimatedStyle(() => ({
        transform: [{ translateY: answer4Y.value }],
    }));

    return (
        <LinearGradient style={styles.container} colors={['#141e3a', '#07426f', '#141e3a']}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {/* Answer 1 */}
            <Animated.View style={[styles.answerContainer, animatedStyle1]}>
                <TouchableOpacity
                    style={styles.answerBox}
                    onPress={() => handleAnswerTap(currentQuestion.answers[0])}
                >
                    <Text style={styles.answerText}>{currentQuestion.answers[0]}</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Answer 2 */}
            <Animated.View style={[styles.answerContainer, animatedStyle2]}>
                <TouchableOpacity
                    style={styles.answerBox}
                    onPress={() => handleAnswerTap(currentQuestion.answers[1])}
                >
                    <Text style={styles.answerText}>{currentQuestion.answers[1]}</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Answer 3 */}
            <Animated.View style={[styles.answerContainer, animatedStyle3]}>
                <TouchableOpacity
                    style={styles.answerBox}
                    onPress={() => handleAnswerTap(currentQuestion.answers[2])}
                >
                    <Text style={styles.answerText}>{currentQuestion.answers[2]}</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Answer 4 */}
            <Animated.View style={[styles.answerContainer, animatedStyle4]}>
                <TouchableOpacity
                    style={styles.answerBox}
                    onPress={() => handleAnswerTap(currentQuestion.answers[3])}
                >
                    <Text style={styles.answerText}>{currentQuestion.answers[3]}</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    speedButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#48ffa4',
        borderRadius: 15,
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#48ffa4',
        zIndex: 1000,
        position: 'absolute',
        top: 20
    },
    answerContainer: {
        marginVertical: 10
    },
    answerBox: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#07426f'
    },
    answerText: {
        fontSize: 18,
        color: '#48ffa4',
    },
});

export default App;