import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { validateEventDescription, sanitizeInput } from '../../../utils/validation';


const EventPromptForm = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [eventType, setEventType] = useState('');
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const eventTypes = [
    'Corporate Conference',
    'Wedding Celebration',
    'Birthday Party',
    'Product Launch',
    'Academic Seminar',
    'Networking Event',
    'Charity Fundraiser',
    'Music Concert',
    'Art Exhibition',
    'Sports Tournament'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Validate event description
    const descriptionValidation = validateEventDescription(prompt, eventType);
    if (!descriptionValidation.isValid) {
      newErrors.prompt = descriptionValidation.errors[0]; // Show first error
    }
    
    if (!eventType) {
      newErrors.eventType = 'Please select an event type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onGenerate({
        prompt: prompt?.trim(),
        eventType,
        timestamp: new Date()?.toISOString()
      });
    }
  };

  const handlePromptChange = (e) => {
    const sanitizedValue = sanitizeInput(e?.target?.value);
    setPrompt(sanitizedValue);
    
    if (errors?.prompt) {
      setErrors(prev => ({ ...prev, prompt: '' }));
    }
    
    // Real-time validation for better UX
    if (sanitizedValue.length > 20 && eventType) {
      setIsValidating(true);
      setTimeout(() => {
        const validation = validateEventDescription(sanitizedValue, eventType);
        if (!validation.isValid) {
          setErrors(prev => ({ ...prev, prompt: validation.errors[0] }));
        }
        setIsValidating(false);
      }, 500);
    }
  };

  const handleEventTypeChange = (e) => {
    setEventType(e?.target?.value);
    if (errors?.eventType) {
      setErrors(prev => ({ ...prev, eventType: '' }));
    }
  };

  const examplePrompts = [
    "Plan a tech startup product launch for 200 attendees with networking sessions and live demos",
    "Organize a sustainable wedding celebration for 150 guests with outdoor ceremony and eco-friendly catering",
    "Create a corporate annual conference with keynote speakers, breakout sessions, and team building activities"
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Icon name="Sparkles" size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Event Planner</h3>
          <p className="text-sm text-gray-600">Describe your vision and let AI create your perfect event plan</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Type
          </label>
          <select
            value={eventType}
            onChange={handleEventTypeChange}
            className={`w-full px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors?.eventType ? 'border-error' : 'border-border'
            }`}
          >
            <option value="">Select event type...</option>
            {eventTypes?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors?.eventType && (
            <p className="mt-1 text-sm text-error">{errors?.eventType}</p>
          )}
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Description
            {isValidating && (
              <span className="ml-2 text-xs text-primary">
                <Icon name="Loader2" size={12} className="inline animate-spin mr-1" />
                Validating...
              </span>
            )}
          </label>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder={`Describe your ${eventType || 'event'} vision in detail... Include audience size, venue preferences, key activities, budget range, and any special requirements. Be specific and detailed for better AI-generated plans.

You can write in English or Hindi, and use multiple lines to describe your event in detail.`}
            rows={8}
            className={`w-full px-4 py-3 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-vertical ${
              errors?.prompt ? 'border-error' : 'border-border'
            } leading-relaxed whitespace-pre-wrap`}
            style={{ minHeight: '150px', lineHeight: '1.6' }}
          />
          <div className="flex justify-between items-center mt-1">
            {errors?.prompt ? (
              <div className="flex items-center text-sm text-error">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors?.prompt}
              </div>
            ) : (
              <p className={`text-xs ${
                prompt?.length < 20 ? 'text-warning' : 
                prompt?.length > 1500 ? 'text-error' : 'text-muted-foreground'
              }`}>
                {prompt?.length}/2000 characters
                {prompt?.length < 20 && ' (minimum 20 required)'}
                {prompt?.length > 1500 && ' (approaching limit)'}
              </p>
            )}
          </div>
        </div>

        {/* Example Prompts */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Need inspiration? Try these examples:</p>
          <div className="space-y-2">
            {examplePrompts?.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="w-full text-left p-3 bg-muted hover:bg-muted/80 rounded-md text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="Lightbulb" size={14} className="inline mr-2" />
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isGenerating || isValidating}
          iconName="Sparkles"
          iconPosition="left"
          disabled={isGenerating || isValidating}
        >
          {isGenerating ? 'Generating Your Event Plan...' : 
           isValidating ? 'Validating Description...' : 
           'Generate Event Plan'}
        </Button>
      </form>
      {/* AI Features Info */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Timeline Generation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Task Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Budget Estimation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPromptForm;