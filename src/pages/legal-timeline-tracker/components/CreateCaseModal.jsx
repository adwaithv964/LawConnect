import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateCaseModal = ({ isOpen, onClose, onCreateCase, caseToEdit, onUpdateCase }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "Medium",
    startDate: new Date().toISOString().split('T')[0],
    isManualProgress: false,
    completionPercentage: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (caseToEdit) {
      // Parse date from "15 Nov 2025" back to YYYY-MM-DD for input
      const parseDate = (dateStr) => {
        try {
          if (!dateStr) return new Date().toISOString().split('T')[0];
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];

          const offset = date.getTimezoneOffset();
          const localDate = new Date(date.getTime() - (offset * 60 * 1000));
          return localDate.toISOString().split('T')[0];
        } catch (e) {
          console.error("Date parsing error:", e);
          return new Date().toISOString().split('T')[0];
        }
      };

      setFormData({
        title: caseToEdit.title || "",
        category: caseToEdit.category || "",
        description: caseToEdit.description || "",
        priority: caseToEdit.priority || "Medium",
        startDate: parseDate(caseToEdit.startDate),
        isManualProgress: caseToEdit.isManualProgress || false,
        completionPercentage: caseToEdit.completionPercentage || 0
      });
    } else {
      setFormData({
        title: "",
        category: "",
        description: "",
        priority: "Medium",
        startDate: new Date().toISOString().split('T')[0],
        isManualProgress: false,
        completionPercentage: 0
      });
    }
  }, [caseToEdit, isOpen]);

  const categoryOptions = [
    { value: "Property Dispute", label: "Property Dispute" },
    { value: "Consumer Rights", label: "Consumer Rights" },
    { value: "Family Law", label: "Family Law" },
    { value: "Employment", label: "Employment" },
    { value: "Criminal", label: "Criminal" },
    { value: "Civil", label: "Civil" },
    { value: "Other", label: "Other" }
  ];

  const priorityOptions = [
    { value: "High", label: "High Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "Low", label: "Low Priority" }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.title?.trim()) newErrors.title = "Case title is required";
    if (!formData?.category) newErrors.category = "Please select a category";
    // Description validation optional if editing and description not present in case object? 
    // Let's keep it required for new cases, maybe optional for edit if we don't store it?
    // For now, keeping it same.
    if (!formData?.description?.trim()) newErrors.description = "Case description is required";

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        if (caseToEdit) {
          await onUpdateCase({
            ...caseToEdit,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority,
            startDate: formData.startDate,
            isManualProgress: formData.isManualProgress,
            completionPercentage: formData.isManualProgress ? formData.completionPercentage : caseToEdit.completionPercentage
          });
        } else {
          await onCreateCase(formData);
        }
        onClose();
      } catch (err) {
        console.error('Submit error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-elevation-5 overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            {caseToEdit ? 'Edit Case' : 'Create New Case'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <Input
              label="Case Title"
              type="text"
              placeholder="Enter case title"
              value={formData?.title}
              onChange={(e) => handleChange('title', e?.target?.value)}
              error={errors?.title}
              required
            />

            <Select
              label="Case Category"
              placeholder="Select category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleChange('category', value)}
              error={errors?.category}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Case Description <span className="text-accent">*</span>
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleChange('description', e?.target?.value)}
                placeholder="Provide detailed description of the case..."
                className={`
                  w-full min-h-[120px] p-3 bg-background border rounded-lg text-sm text-foreground resize-none
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${errors?.description ? 'border-accent' : 'border-border'}
                `}
              />
              {errors?.description && (
                <p className="text-xs text-accent mt-1">{errors?.description}</p>
              )}
            </div>

            <Select
              label="Priority Level"
              options={priorityOptions}
              value={formData?.priority}
              onChange={(value) => handleChange('priority', value)}
            />

            <Input
              label="Start Date"
              type="date"
              value={formData?.startDate}
              onChange={(e) => handleChange('startDate', e?.target?.value)}
            />

            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manual-progress"
                  checked={formData.isManualProgress}
                  onCheckedChange={(checked) => handleChange('isManualProgress', checked)}
                  label="Manual Progress Override"
                  description="Manually set the completion percentage instead of auto-calculating from milestones."
                />
              </div>

              {formData.isManualProgress && (
                <div className="space-y-2 pl-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Completion Progress</span>
                    <span className="text-primary font-bold">{formData.completionPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.completionPercentage}
                    onChange={(e) => handleChange('completionPercentage', parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Initial Milestones
                  </p>
                  <p className="text-xs text-muted-foreground">
                    After creating the case, you'll be able to add milestones and track progress through the timeline view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName={isSubmitting ? 'Loader' : 'Plus'}
            iconPosition="left"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : caseToEdit ? 'Save Changes' : 'Create Case'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCaseModal;