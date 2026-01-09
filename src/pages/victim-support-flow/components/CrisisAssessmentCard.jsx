import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrisisAssessmentCard = ({ category, questions, resources }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    
    if (currentQuestion < questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
            <Icon name="CheckCircle" size={24} color="var(--color-success)" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
              Assessment Complete
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Based on your responses, here are the recommended next steps:
            </p>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          {resources?.map((resource, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Icon name="ArrowRight" size={18} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-foreground">{resource}</p>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={resetAssessment}
          iconName="RotateCcw"
          iconPosition="left"
          fullWidth
        >
          Start New Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          {category} Assessment
        </h3>
        <span className="text-sm text-muted-foreground">
          {currentQuestion + 1} / {questions?.length}
        </span>
      </div>
      <div className="mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-smooth"
            style={{ width: `${((currentQuestion + 1) / questions?.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="mb-6">
        <p className="text-base md:text-lg text-foreground font-medium mb-4">
          {questions?.[currentQuestion]}
        </p>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => handleAnswer('yes')}
            fullWidth
            className="justify-start"
          >
            Yes
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAnswer('no')}
            fullWidth
            className="justify-start"
          >
            No
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleAnswer('unsure')}
            fullWidth
            className="justify-start"
          >
            Not Sure
          </Button>
        </div>
      </div>
      {currentQuestion > 0 && (
        <Button
          variant="ghost"
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          iconName="ChevronLeft"
          iconPosition="left"
          size="sm"
        >
          Previous Question
        </Button>
      )}
    </div>
  );
};

export default CrisisAssessmentCard;