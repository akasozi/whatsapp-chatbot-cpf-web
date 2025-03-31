import { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * ConversationFilter - Advanced filter component for conversations
 * 
 * @param {Object} props
 * @param {Object} props.filters - Current active filters
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Function} props.onSaveFilter - Callback to save a filter preset
 * @param {Array} props.savedFilters - List of saved filter presets
 */
const ConversationFilter = ({ 
  filters, 
  onFilterChange,
  onSaveFilter,
  savedFilters = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  
  // Filter categories
  const statuses = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'TRANSFERRED', label: 'Pending' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
  ];
  
  const priorities = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];
  
  const dateRanges = [
    { value: 'ALL', label: 'Any Time' },
    { value: 'TODAY', label: 'Today' },
    { value: 'YESTERDAY', label: 'Yesterday' },
    { value: 'WEEK', label: 'This Week' },
    { value: 'MONTH', label: 'This Month' },
  ];
  
  // Handle filter change
  const handleChange = (category, value) => {
    onFilterChange({
      ...filters,
      [category]: value
    });
  };
  
  // Handle saving a filter preset
  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    
    onSaveFilter({
      name: newPresetName.trim(),
      filters: { ...filters }
    });
    
    setNewPresetName('');
  };
  
  // Handle loading a saved preset
  const handleLoadPreset = (preset) => {
    onFilterChange(preset.filters);
  };
  
  // Reset all filters
  const handleReset = () => {
    onFilterChange({
      status: 'ALL',
      priority: 'ALL',
      dateRange: 'ALL',
    });
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Advanced Filters</span>
          <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 ml-1">
            {Object.values(filters).filter(v => v !== 'ALL').length}
          </span>
        </Button>
        
        {Object.values(filters).some(v => v !== 'ALL') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
          >
            Clear Filters
          </Button>
        )}
      </div>
      
      {isOpen && (
        <div className="bg-card border rounded-lg p-4 space-y-4 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <div className="space-y-1">
                {statuses.map((status) => (
                  <label key={status.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      className="text-primary"
                      checked={filters.status === status.value}
                      onChange={() => handleChange('status', status.value)}
                    />
                    <span className="text-sm">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Priority filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <div className="space-y-1">
                {priorities.map((priority) => (
                  <label key={priority.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      className="text-primary"
                      checked={filters.priority === priority.value}
                      onChange={() => handleChange('priority', priority.value)}
                    />
                    <span className="text-sm">{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Date Range filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <div className="space-y-1">
                {dateRanges.map((range) => (
                  <label key={range.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      className="text-primary"
                      checked={filters.dateRange === range.value}
                      onChange={() => handleChange('dateRange', range.value)}
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Saved Filters</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {savedFilters.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleLoadPreset(preset)}
                    className="px-3 py-1 bg-muted text-sm rounded-full hover:bg-muted/80"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Save Filter Option */}
          <div className="flex items-center space-x-2 pt-2 border-t">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Name this filter set..."
              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button 
              size="sm" 
              onClick={handleSavePreset}
              disabled={!newPresetName.trim()}
            >
              Save Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationFilter;