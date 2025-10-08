/**
 * FormanPacific Admin Data Schema and Utilities
 * Standardized data structures and validation for admin pages
 */

// ===== STANDARD DATA SCHEMA =====
const FP_DATA_SCHEMA = {
  // Job data structure
  jobs: {
    id: { 
      type: 'number', 
      required: true, 
      displayName: 'Job ID',
      validation: { min: 1 }
    },
    title: { 
      type: 'string', 
      required: true, 
      displayName: 'Job Title',
      validation: { minLength: 1, maxLength: 255 }
    },
    status: { 
      type: 'choice', 
      required: true, 
      displayName: 'Status',
      values: ['Open', 'In Progress', 'Completed', 'Cancelled', 'Blocked'],
      default: 'Open'
    },
    priority: { 
      type: 'choice', 
      required: false, 
      displayName: 'Priority',
      values: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    },
    customer: { 
      type: 'string', 
      required: true, 
      displayName: 'Customer',
      validation: { minLength: 1, maxLength: 255 }
    },
    customerPhone: { 
      type: 'string', 
      required: false, 
      displayName: 'Customer Phone',
      validation: { pattern: /^[\d\s\-\(\)\+]+$/ }
    },
    customerEmail: { 
      type: 'string', 
      required: false, 
      displayName: 'Customer Email',
      validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    },
    supplier: { 
      type: 'string', 
      required: false, 
      displayName: 'Supplier',
      validation: { maxLength: 255 }
    },
    supplierPhone: { 
      type: 'string', 
      required: false, 
      displayName: 'Supplier Phone',
      validation: { pattern: /^[\d\s\-\(\)\+]+$/ }
    },
    location: { 
      type: 'string', 
      required: false, 
      displayName: 'Location',
      validation: { maxLength: 500 }
    },
    vehicleRego: { 
      type: 'string', 
      required: false, 
      displayName: 'Vehicle Registration',
      validation: { maxLength: 20 }
    },
    jobType: { 
      type: 'choice', 
      required: false, 
      displayName: 'Job Type',
      values: ['Jump Start', 'Tyre Change', 'Locksmith', 'Mechanic', 'Fuel Delivery', 'Fuel Extraction', 'Truck Tyre', 'Pre-Purchase Inspection', 'Trailer Inspection', 'Non Emergency', 'Follow-Up', 'DNC']
    },
    createdDate: { 
      type: 'datetime', 
      required: true, 
      displayName: 'Created Date',
      default: () => new Date().toISOString()
    },
    modifiedDate: { 
      type: 'datetime', 
      required: false, 
      displayName: 'Modified Date'
    },
    createdBy: { 
      type: 'string', 
      required: true, 
      displayName: 'Created By'
    },
    modifiedBy: { 
      type: 'string', 
      required: false, 
      displayName: 'Modified By'
    },
    cost: { 
      type: 'currency', 
      required: false, 
      displayName: 'Cost',
      validation: { min: 0 }
    },
    description: { 
      type: 'text', 
      required: false, 
      displayName: 'Description',
      validation: { maxLength: 2000 }
    },
    notes: { 
      type: 'text', 
      required: false, 
      displayName: 'Notes',
      validation: { maxLength: 2000 }
    }
  },

  // Activity data structure
  activities: {
    id: { 
      type: 'number', 
      required: true, 
      displayName: 'Activity ID',
      validation: { min: 1 }
    },
    jobId: { 
      type: 'number', 
      required: true, 
      displayName: 'Job ID',
      validation: { min: 1 }
    },
    type: { 
      type: 'choice', 
      required: true, 
      displayName: 'Activity Type',
      values: ['Update', 'Call', 'Email', 'Assignment', 'Follow-up', 'Onsite', 'Resolution'],
      default: 'Update'
    },
    status: { 
      type: 'choice', 
      required: true, 
      displayName: 'Status',
      values: ['Open', 'In Progress', 'Completed', 'Blocked', 'Cancelled'],
      default: 'Open'
    },
    performedBy: { 
      type: 'string', 
      required: true, 
      displayName: 'Performed By',
      validation: { minLength: 1, maxLength: 255 }
    },
    performedDate: { 
      type: 'datetime', 
      required: true, 
      displayName: 'Performed Date',
      default: () => new Date().toISOString()
    },
    duration: { 
      type: 'number', 
      required: false, 
      displayName: 'Duration (minutes)',
      validation: { min: 0 }
    },
    cost: { 
      type: 'currency', 
      required: false, 
      displayName: 'Cost',
      validation: { min: 0 }
    },
    notes: { 
      type: 'text', 
      required: false, 
      displayName: 'Notes',
      validation: { maxLength: 2000 }
    },
    createdDate: { 
      type: 'datetime', 
      required: true, 
      displayName: 'Created Date',
      default: () => new Date().toISOString()
    },
    modifiedDate: { 
      type: 'datetime', 
      required: false, 
      displayName: 'Modified Date'
    }
  },

  // Triage form data structure
  triage: {
    emergencyType: { 
      type: 'choice', 
      required: true, 
      displayName: 'Emergency Type',
      values: ['Jump Start', 'Tyre Change', 'Locksmith', 'Mechanic', 'Fuel Delivery', 'Fuel Extraction', 'Truck Tyre', 'Pre-Purchase Inspection', 'Trailer Inspection', 'Non Emergency', 'Follow-Up', 'DNC']
    },
    callerName: { 
      type: 'string', 
      required: true, 
      displayName: 'Caller Name',
      validation: { minLength: 1, maxLength: 255 }
    },
    mobileNumber: { 
      type: 'string', 
      required: true, 
      displayName: 'Mobile Number',
      validation: { pattern: /^[\d\s\-\(\)\+]+$/, minLength: 7 }
    },
    connectionType: { 
      type: 'choice', 
      required: false, 
      displayName: 'Connection Type',
      values: ['Client Job in Progress Team', 'Client Post Job Support', 'Supplier Job in Progress Team', 'Supplier Post Job Support', 'Blacklist Caller']
    },
    vehicleRego: { 
      type: 'string', 
      required: false, 
      displayName: 'Vehicle Registration',
      validation: { maxLength: 20 }
    },
    emailAddress: { 
      type: 'string', 
      required: false, 
      displayName: 'Email Address',
      validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    },
    contactNumber: { 
      type: 'string', 
      required: false, 
      displayName: 'Contact Number',
      validation: { pattern: /^[\d\s\-\(\)\+]+$/ }
    },
    consent: { 
      type: 'choice', 
      required: false, 
      displayName: 'Consent',
      values: ['Yes', 'No', 'Does Not Apply']
    },
    dncPhone: { 
      type: 'string', 
      required: false, 
      displayName: 'DNC Phone',
      validation: { pattern: /^[\d\s\-\(\)\+]+$/ }
    },
    dncReason: { 
      type: 'choice', 
      required: false, 
      displayName: 'DNC Reason',
      values: ['Incorrect Phone Number', 'Membership/Subscription/Wrong Number', 'Out of Scope', 'Resolved themselves', 'Only have cash', 'Too expensive', 'Not an emergency', 'Wait time is too long', 'Hang up no explanation', 'Hang up annoyed/frustrated', 'Hang up rude/abusive', 'No response/silent call', 'Did not consent to further contact']
    },
    submittedBy: { 
      type: 'string', 
      required: true, 
      displayName: 'Submitted By'
    },
    submittedAt: { 
      type: 'datetime', 
      required: true, 
      displayName: 'Submitted At',
      default: () => new Date().toISOString()
    }
  }
};

// ===== FIELD MAPPING UTILITIES =====
const FP_FIELD_MAPPINGS = {
  // Map SharePoint field names to standard field names
  sharepoint: {
    jobs: {
      'ID': 'id',
      'Title': 'title',
      'Status': 'status',
      'Priority': 'priority',
      'Customer': 'customer',
      'CustomerPhone': 'customerPhone',
      'CustomerEmail': 'customerEmail',
      'Supplier': 'supplier',
      'SupplierPhone': 'supplierPhone',
      'Location': 'location',
      'VehicleRego': 'vehicleRego',
      'JobType': 'jobType',
      'Created': 'createdDate',
      'Modified': 'modifiedDate',
      'Author': 'createdBy',
      'Editor': 'modifiedBy',
      'Cost': 'cost',
      'Description': 'description',
      'Notes': 'notes'
    },
    activities: {
      'ID': 'id',
      'JobID': 'jobId',
      'JobReference': 'jobId',
      'ActivityType': 'type',
      'Status': 'status',
      'PerformedBy': 'performedBy',
      'When': 'performedDate',
      'Duration': 'duration',
      'Cost': 'cost',
      'Notes': 'notes',
      'Created': 'createdDate',
      'Modified': 'modifiedDate'
    }
  }
};

// ===== DATA VALIDATION =====
const FP_VALIDATION = {
  // Validate a single field value
  validateField: function(fieldName, value, schema) {
    const field = schema[fieldName];
    if (!field) return { valid: true, message: '' };

    // Check required
    if (field.required && (value === null || value === undefined || value === '')) {
      return { valid: false, message: `${field.displayName} is required` };
    }

    // Skip validation for empty optional fields
    if (!field.required && (value === null || value === undefined || value === '')) {
      return { valid: true, message: '' };
    }

    // Type-specific validation
    switch (field.type) {
      case 'string':
      case 'text':
        if (typeof value !== 'string') {
          return { valid: false, message: `${field.displayName} must be text` };
        }
        if (field.validation) {
          if (field.validation.minLength && value.length < field.validation.minLength) {
            return { valid: false, message: `${field.displayName} must be at least ${field.validation.minLength} characters` };
          }
          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            return { valid: false, message: `${field.displayName} must be no more than ${field.validation.maxLength} characters` };
          }
          if (field.validation.pattern && !field.validation.pattern.test(value)) {
            return { valid: false, message: `${field.displayName} format is invalid` };
          }
        }
        break;

      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return { valid: false, message: `${field.displayName} must be a number` };
        }
        if (field.validation) {
          if (field.validation.min !== undefined && numValue < field.validation.min) {
            return { valid: false, message: `${field.displayName} must be at least ${field.validation.min}` };
          }
          if (field.validation.max !== undefined && numValue > field.validation.max) {
            return { valid: false, message: `${field.displayName} must be no more than ${field.validation.max}` };
          }
        }
        break;

      case 'currency':
        const currencyValue = Number(value);
        if (isNaN(currencyValue)) {
          return { valid: false, message: `${field.displayName} must be a valid amount` };
        }
        if (field.validation) {
          if (field.validation.min !== undefined && currencyValue < field.validation.min) {
            return { valid: false, message: `${field.displayName} must be at least ${field.validation.min}` };
          }
        }
        break;

      case 'datetime':
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          return { valid: false, message: `${field.displayName} must be a valid date` };
        }
        break;

      case 'choice':
        if (field.values && !field.values.includes(value)) {
          return { valid: false, message: `${field.displayName} must be one of: ${field.values.join(', ')}` };
        }
        break;
    }

    return { valid: true, message: '' };
  },

  // Validate an entire object
  validateObject: function(obj, schema) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, value] of Object.entries(obj)) {
      const validation = this.validateField(fieldName, value, schema);
      if (!validation.valid) {
        errors[fieldName] = validation.message;
        isValid = false;
      }
    }

    return { valid: isValid, errors };
  }
};

// ===== DATA FORMATTING =====
const FP_FORMATTERS = {
  // Format currency values
  currency: function(value) {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(num);
  },

  // Format date values
  date: function(value) {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-NZ');
  },

  // Format datetime values
  datetime: function(value) {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString('en-NZ');
  },

  // Format phone numbers
  phone: function(value) {
    if (!value) return '';
    // Basic phone formatting - can be enhanced
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  },

  // Format status badges
  statusBadge: function(value, type = 'default') {
    const statusClasses = {
      'Open': 'status-open',
      'In Progress': 'status-in-progress',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled',
      'Blocked': 'status-blocked',
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
      'Emergency': 'priority-emergency'
    };
    
    const className = statusClasses[value] || 'status-default';
    return `<span class="status-badge ${className}">${value}</span>`;
  }
};

// ===== DATA TRANSFORMATION =====
const FP_TRANSFORMERS = {
  // Transform SharePoint data to standard format
  fromSharePoint: function(data, entityType) {
    const mapping = FP_FIELD_MAPPINGS.sharepoint[entityType];
    if (!mapping) return data;

    const transformed = {};
    for (const [sharepointField, standardField] of Object.entries(mapping)) {
      if (data[sharepointField] !== undefined) {
        transformed[standardField] = data[sharepointField];
      }
    }
    
    // Copy unmapped fields
    for (const [key, value] of Object.entries(data)) {
      if (!mapping[key] && !transformed[key]) {
        transformed[key] = value;
      }
    }
    
    return transformed;
  },

  // Transform standard data to SharePoint format
  toSharePoint: function(data, entityType) {
    const mapping = FP_FIELD_MAPPINGS.sharepoint[entityType];
    if (!mapping) return data;

    const transformed = {};
    for (const [sharepointField, standardField] of Object.entries(mapping)) {
      if (data[standardField] !== undefined) {
        transformed[sharepointField] = data[standardField];
      }
    }
    
    // Copy unmapped fields
    for (const [key, value] of Object.entries(data)) {
      const mappedField = Object.keys(mapping).find(sp => mapping[sp] === key);
      if (!mappedField && !transformed[key]) {
        transformed[key] = value;
      }
    }
    
    return transformed;
  },

  // Apply default values
  applyDefaults: function(data, schema) {
    const result = { ...data };
    for (const [fieldName, field] of Object.entries(schema)) {
      if (result[fieldName] === undefined && field.default !== undefined) {
        result[fieldName] = typeof field.default === 'function' ? field.default() : field.default;
      }
    }
    return result;
  }
};

// ===== UTILITY FUNCTIONS =====
const FP_UTILS = {
  // Get field display name
  getDisplayName: function(fieldName, schema) {
    return schema[fieldName]?.displayName || fieldName;
  },

  // Get field type
  getFieldType: function(fieldName, schema) {
    return schema[fieldName]?.type || 'string';
  },

  // Check if field is required
  isRequired: function(fieldName, schema) {
    return schema[fieldName]?.required || false;
  },

  // Get field choices
  getChoices: function(fieldName, schema) {
    return schema[fieldName]?.values || [];
  },

  // Humanize field names (convert camelCase to Title Case)
  humanizeFieldName: function(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },

  // Generate internal field name from display name
  generateInternalName: function(displayName) {
    return displayName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/^[a-z]/, str => str.toUpperCase());
  }
};

// ===== EXPORT FOR USE IN PAGES =====
window.FP_DATA = {
  SCHEMA: FP_DATA_SCHEMA,
  MAPPINGS: FP_FIELD_MAPPINGS,
  VALIDATION: FP_VALIDATION,
  FORMATTERS: FP_FORMATTERS,
  TRANSFORMERS: FP_TRANSFORMERS,
  UTILS: FP_UTILS
};
