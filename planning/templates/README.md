# Code Templates

This directory contains code templates and snippets for consistent development patterns.

## Directory Structure

```
templates/
├── README.md              # This file
├── components/           # React component templates
└── styles/              # CSS/SCSS templates
```

## Component Templates

### Basic Component Template
```jsx
// src/components/[Category]/[ComponentName].js
import React from 'react';
import PropTypes from 'prop-types';
import './[ComponentName].css';

const ComponentName = ({ 
  prop1, 
  prop2, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`component-name ${className}`} {...props}>
      {/* Component content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  className: PropTypes.string
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

### Component with State Template
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const StatefulComponent = ({ initialValue, onValueChange }) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Effect logic here
  }, [value]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stateful-component">
      {/* Component content */}
    </div>
  );
};

export default StatefulComponent;
```

## Style Templates

### Component CSS Template
```css
/* Component: ComponentName */
.component-name {
  /* Base styles */
  display: block;
  position: relative;
}

.component-name__element {
  /* Element styles */
}

.component-name__element--modifier {
  /* Modifier styles */
}

.component-name:hover {
  /* Hover states */
}

.component-name:focus {
  /* Focus states */
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Responsive styles */
@media (min-width: 768px) {
  .component-name {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component-name {
    /* Desktop styles */
  }
}
```

## Usage Guidelines

1. **Copy template** to appropriate location
2. **Replace placeholders** with actual names
3. **Customize** for specific requirements
4. **Follow naming conventions** established in the project
5. **Add tests** using the testing templates

## Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard`)
- **Files**: PascalCase for components (e.g., `ProductCard.js`)
- **CSS Classes**: kebab-case with BEM methodology
- **Props**: camelCase
- **Constants**: UPPER_SNAKE_CASE
