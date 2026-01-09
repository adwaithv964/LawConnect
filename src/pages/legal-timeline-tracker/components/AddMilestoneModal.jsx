import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddMilestoneModal = ({ isOpen, onClose, onAddMilestone }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors?.[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData?.title?.trim()) newErrors.title = "Milestone title is required";
        if (!formData?.dueDate) newErrors.dueDate = "Due date is required";

        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Format date for display
            const formattedDate = new Date(formData.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            onAddMilestone({
                title: formData.title,
                description: formData.description,
                dueDate: formattedDate
            });

            // Reset form
            setFormData({
                title: "",
                description: "",
                dueDate: new Date().toISOString().split('T')[0]
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md bg-card rounded-xl shadow-elevation-5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                        Add New Milestone
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-smooth"
                        aria-label="Close modal"
                    >
                        <Icon name="X" size={20} color="var(--color-foreground)" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <Input
                        label="Milestone Title"
                        type="text"
                        placeholder="e.g. Follow-up Meeting"
                        value={formData?.title}
                        onChange={(e) => handleChange('title', e?.target?.value)}
                        error={errors?.title}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Description <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={formData?.description}
                            onChange={(e) => handleChange('description', e?.target?.value)}
                            placeholder="Brief details about this milestone..."
                            className="w-full min-h-[80px] p-3 bg-background border border-border rounded-lg text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <Input
                        label="Due Date"
                        type="date"
                        value={formData?.dueDate}
                        onChange={(e) => handleChange('dueDate', e?.target?.value)}
                        error={errors?.dueDate}
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-muted/30">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                    >
                        Add Milestone
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddMilestoneModal;
