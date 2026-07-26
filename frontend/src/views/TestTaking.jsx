import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  ChevronLeft, ChevronRight, Bookmark, AlertCircle, CheckCircle, 
  HelpCircle, Clock, Award, CornerDownLeft, XCircle
} from 'lucide-react';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { tests, submitTestResult } = useApp();

  const activeTest = tests.find(t => t.id === testId);

  // If no test found, redirect
  useEffect(() => {
    if (!activeTest) {
      navigate('/dashboard');
    }
  }, [activeTest, navigate]);

  if (!activeTest) return null;

  const totalQs = activeTest.questions.length;

  // Answers State: maps index of question to index of selected choice
  const [answers, setAnswers] = useState(Array(totalQs).fill(null));
  
  // Flags State: tracks if question is flagged for review
  const [flags, setFlags] = useState(Array(totalQs).fill(false));

  // Current active question index
  const [currentIdx, setCurrentIdx] = useState(0);

  // Timer: Duration * 60 seconds
  const [secondsLeft, setSecondsLeft] = useState(activeTest.duration * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Modal / Results View States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultsView, setShowResultsView] = useState(false);
  
  // Saved score after submitting
  const [testScore, setTestScore] = useState(0);

  // Start real-time countdown
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Handle Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && !showResultsView) {
      handleFinalSubmit();
    }
  }, [isTimeUp]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Answer choice selector
  const handleSelectOption = (optIdx) => {
    setAnswers(prev => {
      const nextAnswers = [...prev];
      nextAnswers[currentIdx] = optIdx;
      return nextAnswers;
    });
  };

  // Flag toggler
  const handleToggleFlag = () => {
    setFlags(prev => {
      const nextFlags = [...prev];
      nextFlags[currentIdx] = !nextFlags[currentIdx];
      return nextFlags;
    });
  };

  // Question navigation
  const handleNext = () => {
    if (currentIdx < totalQs - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Submission
  const handleFinalSubmit = () => {
    clearInterval(timerRef.current);
    setShowConfirmModal(false);

    // Compute score
    let calculatedScore = 0;
    activeTest.questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== null && selected === q.correctAnswer) {
        calculatedScore++;
      }
    });

    setTestScore(calculatedScore);

    // Save to AppContext state
    submitTestResult(testId, answers, calculatedScore, totalQs);
    
    // Toggle results page
    setShowResultsView(true);
  };

  const handleAbort = () => {
    if (confirm("Are you sure you want to leave this test? Your progress will be lost!")) {
      navigate('/dashboard');
    }
  };

  const countAnswered = answers.filter(a => a !== null).length;
  const countFlagged = flags.filter(f => f).length;
  const percentProgress = Math.round((countAnswered / totalQs) * 100);

  // If showing Results dashboard post-submission
  if (showResultsView) {
    const pct = Math.round((testScore / totalQs) * 100);
    let rating = 'Poor';
    let ratingColor = 'text-red-500';
    if (pct >= 80) {
      rating = 'Excellent';
      ratingColor = 'text-green-500';
    } else if (pct >= 60) {
      rating = 'Good';
      ratingColor = 'text-blue-500';
    } else if (pct >= 40) {
      rating = 'Average';
      ratingColor = 'text-yellow-500';
    }

    return (
      <div className="min-h-screen bg-[#cebfe2] flex items-center justify-center p-6 font-sans antialiased animate-fade-in">
        <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl p-10 flex flex-col items-center">
          
          {/* Trophy Header */}
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-yellow-500" />
          </div>
          
          <h2 className="font-display font-extrabold text-2xl text-gray-800 mb-1">Test Submitted Successfully!</h2>
          <p className="text-xs text-gray-400 font-semibold mb-8 uppercase">Assessment Review: {activeTest.title}</p>

          {/* Core Score Ring */}
          <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 border border-gray-100 p-8 rounded-3xl w-full mb-8">
            <div className="w-32 h-32 rounded-full border-8 border-purple-100 bg-white flex flex-col items-center justify-center shrink-0 shadow-inner">
              <span className="font-display font-extrabold text-3xl text-purple-900 leading-none">{pct}%</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{testScore} / {totalQs} Correct</span>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className={`font-display font-extrabold text-xl ${ratingColor} mb-2`}>{rating} Performance</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                You completed this assessment. Your score has been logged to your learning dashboard and shared with the Course Creator. You can view the question breakdown below.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="py-2.5 px-6 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-100 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Question Breakdown Details */}
          <div className="w-full border-t border-gray-150 pt-6">
            <h3 className="font-display font-extrabold text-sm text-gray-800 uppercase tracking-wide mb-4">Questions Answer Sheet</h3>
            <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2">
              {activeTest.questions.map((q, idx) => {
                const userChoice = answers[idx];
                const isCorrect = userChoice === q.correctAnswer;
                return (
                  <div key={q.id || idx} className={`p-4 rounded-xl border ${
                    isCorrect ? 'bg-green-50/50 border-green-150' : 'bg-red-50/50 border-red-150'
                  }`}>
                    <h4 className="font-bold text-xs text-gray-800 mb-2 flex items-start gap-1.5">
                      <span className="font-display font-extrabold text-purple-600 shrink-0">{idx + 1}.</span>
                      <span>{q.text}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        const isAnsCorrect = q.correctAnswer === optIdx;

                        return (
                          <div 
                            key={optIdx}
                            className={`p-2 rounded-lg text-[10px] font-semibold border ${
                              isAnsCorrect 
                                ? 'bg-green-100 border-green-300 text-green-800 flex items-center justify-between' 
                                : isSelected 
                                ? 'bg-red-100 border-red-300 text-red-800' 
                                : 'bg-white border-gray-200 text-gray-500'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isAnsCorrect && <CheckCircle className="w-3.5 h-3.5 text-green-700 shrink-0" />}
                            {isSelected && !isAnsCorrect && <XCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Active testing environment Layout
  const currentQuestion = activeTest.questions[currentIdx];

  return (
    <div className="min-h-screen bg-[#cebfe2] flex flex-col font-sans animate-fade-in">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="h-20 bg-white flex items-center justify-between px-10 border-b border-gray-150 shadow-md shrink-0">
        <button 
          onClick={handleAbort}
          className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Abort Test
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-display font-extrabold text-base text-gray-800 tracking-wide select-none">
            {activeTest.title}
          </h1>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
            Assessment Engine
          </span>
        </div>

        {/* Live Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-mono text-sm font-bold shadow-xs select-none ${
          secondsLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{formatTime(secondsLeft)}</span>
        </div>
      </header>

      {/* Progress Bar under header */}
      <div className="w-full bg-gray-200 h-1.5 shrink-0">
        <div 
          className="bg-[#e54e73] h-full transition-all duration-300"
          style={{ width: `${percentProgress}%` }}
        ></div>
      </div>

      {/* 2. BODY CONTENT SECTION */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-8 items-start max-w-7xl w-full mx-auto overflow-hidden">
        
        {/* Left 8 Columns: Question Stem & Options */}
        <main className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col justify-between h-[65vh]">
          <div>
            {/* Header info */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 py-1 px-3 rounded-full">
                Question {currentIdx + 1} of {totalQs}
              </span>
              <button 
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 text-xs font-bold transition-all py-1 px-3 rounded-lg border cursor-pointer ${
                  flags[currentIdx] 
                    ? 'bg-amber-50 border-amber-200 text-amber-600' 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${flags[currentIdx] ? 'fill-current' : ''}`} />
                {flags[currentIdx] ? 'Flagged for Review' : 'Flag Question'}
              </button>
            </div>

            {/* Question Text */}
            <h2 className="font-display font-extrabold text-lg text-gray-800 mb-8 leading-snug">
              {currentQuestion.text}
            </h2>

            {/* Multiple Choice Options List */}
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full py-4 px-6 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between cursor-pointer group ${
                      isSelected 
                        ? 'bg-purple-900 border-purple-900 text-white shadow-md shadow-purple-100' 
                        : 'bg-white hover:bg-purple-50/50 border-gray-200 text-gray-700 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-white/80 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Control Buttons */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-4">
            <button 
              disabled={currentIdx === 0}
              onClick={handlePrev}
              className="flex items-center gap-1 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button 
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold shadow-md shadow-pink-100 transition-all cursor-pointer"
            >
              {currentIdx === totalQs - 1 ? 'Review & Submit' : 'Next'}
              {currentIdx < totalQs - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

        </main>

        {/* Right 4 Columns: Timer, Statistics & Question Grid Navigation */}
        <aside className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6 h-[65vh] justify-between">
          <div>
            <h3 className="font-display font-extrabold text-sm text-gray-800 uppercase tracking-wide mb-4">Question Grid</h3>
            
            {/* Grid display */}
            <div className="grid grid-cols-5 gap-3.5 mb-6">
              {[...Array(totalQs)].map((_, idx) => {
                const isCurrent = currentIdx === idx;
                const isAnswered = answers[idx] !== null;
                const isFlagged = flags[idx];
                
                let cellClass = 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200';
                if (isAnswered) cellClass = 'bg-purple-900 text-white shadow-xs';
                if (isFlagged) cellClass = 'bg-amber-400 text-white';
                
                return (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-11 rounded-xl text-xs font-black transition-all cursor-pointer ${cellClass} ${
                      isCurrent ? 'ring-4 ring-[#e54e73] scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            {/* Grid legend help */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-400 font-bold border-t border-gray-50 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-purple-900 rounded-xs"></span>
                <span>Answered ({countAnswered})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs"></span>
                <span>Flagged ({countFlagged})</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 bg-gray-150 border border-gray-200 rounded-xs"></span>
                <span>Unvisited ({totalQs - countAnswered})</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 border-2 border-[#e54e73] rounded-xs"></span>
                <span>Current</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <button 
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-4 bg-[#e54e73] hover:bg-[#d03b60] active:bg-[#b82d51] text-white rounded-2xl font-bold text-sm shadow-md shadow-pink-100 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            Submit Test
          </button>
        </aside>

      </div>

      {/* 3. CONFIRM SUBMIT MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display font-extrabold text-xl text-gray-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-[#e54e73]" />
              Confirm Test Submission
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              You are about to submit your test for grading. Please make sure you have answered all questions. You will not be able to change your answers after submitting.
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col gap-2.5 text-xs text-gray-600 mb-6 font-semibold">
              <div className="flex justify-between items-center">
                <span>Total Questions:</span>
                <span className="font-bold text-gray-800">{totalQs}</span>
              </div>
              <div className="flex justify-between items-center text-purple-700">
                <span>Answered:</span>
                <span className="font-bold">{countAnswered} / {totalQs}</span>
              </div>
              <div className="flex justify-between items-center text-amber-600">
                <span>Flagged for Review:</span>
                <span className="font-bold">{countFlagged}</span>
              </div>
              {totalQs - countAnswered > 0 && (
                <div className="flex justify-between items-center text-red-500 font-bold bg-red-50 py-1.5 px-3 rounded-lg border border-red-100 mt-1">
                  <span>⚠️ Unanswered Questions:</span>
                  <span>{totalQs - countAnswered}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Test
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-[#e54e73] hover:bg-[#d03b60] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-pink-100 cursor-pointer"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TestTaking;
