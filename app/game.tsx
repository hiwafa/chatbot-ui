import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
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
        question: 'What is 3 + 5?',
        answers: ['6', '7', '8', '9'],
        correctAnswer: '8',
    },
    {
        question: 'What is the capital of Italy?',
        answers: ['Rome', 'Venice', 'Milan', 'Florence'],
        correctAnswer: 'Rome',
    },
    {
        question: 'What is the capital of Germany?',
        answers: ['Rome', 'Venice', 'Berlin', 'Florence'],
        correctAnswer: 'Berlin',
    },
    {
        question: 'Which planet is known as the Red Planet?',
        answers: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        correctAnswer: 'Mars',
    },
    {
        question: 'What is the chemical symbol for water?',
        answers: ['H2O', 'O2', 'CO2', 'H2'],
        correctAnswer: 'H2O',
    },
    {
        question: 'What is the capital of Japan?',
        answers: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'],
        correctAnswer: 'Tokyo',
    },
    {
        question: 'What is the square root of 64?',
        answers: ['6', '7', '8', '9'],
        correctAnswer: '8',
    },
    {
        question: 'Who wrote "Romeo and Juliet"?',
        answers: ['Shakespeare', 'Dickens', 'Hemingway', 'Austen'],
        correctAnswer: 'Shakespeare',
    },
    {
        question: 'Which element has the atomic number 1?',
        answers: ['Oxygen', 'Hydrogen', 'Helium', 'Carbon'],
        correctAnswer: 'Hydrogen',
    },
    {
        question: 'What is the largest ocean on Earth?',
        answers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 'Pacific Ocean',
    },
    {
        question: 'Who painted the Mona Lisa?',
        answers: ['Van Gogh', 'Picasso', 'Da Vinci', 'Dali'],
        correctAnswer: 'Da Vinci',
    },
    {
        question: 'What is the largest planet in our solar system?',
        answers: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
        correctAnswer: 'Jupiter',
    },
    {
        question: 'What is the capital of Canada?',
        answers: ['Vancouver', 'Toronto', 'Ottawa', 'Montreal'],
        correctAnswer: 'Ottawa',
    }
];

const App = () => {

    const navigation = useNavigation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [currentAnswer, setCurrentAnswer] = useState("");

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        navigation.setOptions({

            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 10, marginRight: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <TouchableOpacity style={styles.speedButton} onPress={decreaseSpeed}>
                            <Text style={{ color: '#141e3a', fontSize: 21, fontWeight: 'bold' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#48ffa4', width: 30, textAlign: 'center' }}>{speed}x</Text>
                        <TouchableOpacity style={styles.speedButton} onPress={increaseSpeed}>
                            <Text style={{ color: '#141e3a', fontSize: 21, fontWeight: 'bold' }}>+</Text>
                        </TouchableOpacity>
                    </View>
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
        if (currentAnswer !== answer)
            if (answer === currentQuestion.correctAnswer) {
                setScore(score + 1);
                setCurrentAnswer(answer)
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
        <LinearGradient style={styles.container} colors={['#141e3a', '#07426f', '#07426f', '#141e3a']}>

            {
                isGameStarted && !isGameOver? <Text style={styles.questionText}>{currentQuestion.question}</Text>
                    : <Text style={styles.questionText}>Let's Play to gether!</Text>
            }

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
        top: 20,
        margin: 10
    },
    answerContainer: {
        marginVertical: 10
    },
    answerBox: {
        width: 120,
        height: 120,
        borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#141e3a'
    },
    answerText: {
        // fontSize: 18,
        padding: 3,
        color: '#48ffa4',
    },
});

export default App;