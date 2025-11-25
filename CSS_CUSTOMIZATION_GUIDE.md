# 🎨 CSS Customization Guide

This guide explains how to customize the CSS interface of your Nova Developer Tools website.

## 📋 Overview

Your project uses **Tailwind CSS** for styling, which means you can customize the interface in several ways:

1. **Tailwind Config** - Customize colors, fonts, spacing, and more
2. **Custom CSS** - Add your own styles in `src/index.css`
3. **Component-Level** - Modify Tailwind classes directly in component files

---

## 🎨 Method 1: Customize via Tailwind Config

The easiest way to change the overall theme is through `tailwind.config.js`.

### Current Color Scheme

Your site currently uses:
- **Primary**: Blue (`blue-600`, `blue-500`)
- **Secondary**: Indigo (`indigo-600`)
- **Background**: Gray (`gray-50`, `gray-100`)
- **Text**: Gray (`gray-900`, `gray-600`)

### How to Change Colors

Edit `tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Customize your primary color
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Main primary color
          600: '#2563eb',  // Darker primary
          700: '#1d4ed8',
        },
        // Add custom colors
        brand: {
          light: '#your-color',
          DEFAULT: '#your-color',
          dark: '#your-color',
        },
      },
      // Customize fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      // Customize spacing, border radius, etc.
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
```

### Example: Change to Purple Theme

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        500: '#a855f7',  // Purple
        600: '#9333ea',  // Darker purple
      },
    },
  },
}
```

Then replace `blue-600` with `primary-600` in components.

---

## 🖌️ Method 2: Add Custom CSS

You can add custom CSS rules in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer base {
  body {
    @apply antialiased;
  }
}

@layer components {
  /* Custom button style */
  .btn-primary {
    @apply bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all;
  }
  
  /* Custom card style */
  .card {
    @apply bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow;
  }
}

@layer utilities {
  /* Custom utility classes */
  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent;
  }
}
```

---

## 🔧 Method 3: Modify Component Styles

Edit Tailwind classes directly in component files.

### Common Style Locations

1. **Landing Page**: `src/components/Landing/LandingPage.tsx`
   - Hero section colors (line 10, 20)
   - Button styles (line 32, 143)
   - Feature cards (line 81-109)

2. **Header**: `src/components/Layout/Header.tsx`
   - Navigation bar (line 20)
   - Logo colors (line 24)
   - Button styles (line 68)

3. **Dashboard**: `src/components/Dashboard/Dashboard.tsx`
   - Background color (line 104)
   - Tool cards (line 122)

4. **Modals**: `src/components/Auth/LoginModal.tsx`
   - Modal background (line 62)
   - Form inputs (line 92, 109)
   - Buttons (line 119)

### Example: Change Button Colors

Find this in components:
```tsx
className="bg-gradient-to-r from-blue-600 to-indigo-600"
```

Change to:
```tsx
className="bg-gradient-to-r from-purple-600 to-pink-600"
```

---

## 🎯 Quick Customization Examples

### Change Background Color

**Landing Page** (`LandingPage.tsx` line 9):
```tsx
// From:
<div className="min-h-screen bg-white">

// To:
<div className="min-h-screen bg-gray-900">  // Dark theme
// Or:
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
```

### Change Primary Button Style

**Any component with buttons**:
```tsx
// From:
className="bg-gradient-to-r from-blue-600 to-indigo-600"

// To solid color:
className="bg-purple-600"

// To different gradient:
className="bg-gradient-to-r from-green-500 to-emerald-600"

// To outlined:
className="border-2 border-blue-600 text-blue-600 bg-transparent"
```

### Change Card Styles

**Dashboard cards** (`Dashboard.tsx` line 122):
```tsx
// From:
className="group p-6 bg-white rounded-2xl border border-gray-200"

// To:
className="group p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-blue-200 shadow-md"
```

### Change Typography

**Headings**:
```tsx
// From:
className="text-4xl font-bold text-gray-900"

// To:
className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
```

---

## 🌈 Popular Color Schemes

### Dark Theme
```css
/* In index.css */
@layer base {
  body {
    @apply bg-gray-900 text-gray-100;
  }
}
```

### Purple Theme
Replace `blue-600` → `purple-600`, `indigo-600` → `pink-600`

### Green Theme
Replace `blue-600` → `green-600`, `indigo-600` → `emerald-600`

### Red/Orange Theme
Replace `blue-600` → `red-600`, `indigo-600` → `orange-600`

---

## 📝 Step-by-Step: Change to Dark Theme

1. **Update `tailwind.config.js`**:
```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
      },
    },
  },
}
```

2. **Update `src/index.css`**:
```css
@layer base {
  body {
    @apply bg-gray-900 text-gray-100;
  }
}
```

3. **Update components** - Replace:
   - `bg-white` → `bg-gray-800`
   - `bg-gray-50` → `bg-gray-900`
   - `text-gray-900` → `text-gray-100`
   - `text-gray-600` → `text-gray-300`
   - `border-gray-200` → `border-gray-700`

---

## 🔍 Finding Styles to Change

### Search for Common Patterns

Use your editor's search to find:
- `bg-blue-600` - Primary background colors
- `text-gray-900` - Text colors
- `border-gray-200` - Border colors
- `rounded-2xl` - Border radius
- `shadow-lg` - Shadow styles

### Component Files to Check

- `src/components/Landing/LandingPage.tsx` - Landing page
- `src/components/Layout/Header.tsx` - Navigation
- `src/components/Dashboard/Dashboard.tsx` - Main dashboard
- `src/components/Auth/LoginModal.tsx` - Login modal
- `src/components/Auth/SignupModal.tsx` - Signup modal
- `src/components/Tools/*.tsx` - Individual tools

---

## 💡 Tips

1. **Use Tailwind's IntelliSense** - Install the Tailwind CSS IntelliSense extension in VS Code for autocomplete
2. **Test Changes** - Run `npm run dev` to see changes in real-time
3. **Consistent Colors** - Use the same color palette throughout for consistency
4. **Responsive Design** - Tailwind classes like `sm:`, `md:`, `lg:` handle responsive design
5. **Hover States** - Add `hover:` prefix for interactive states

---

## 🚀 Quick Start: Change Primary Color

1. Open `tailwind.config.js`
2. Add to `theme.extend.colors`:
```javascript
primary: '#your-color-here',
```
3. Search and replace in components:
   - `blue-600` → `primary`
   - `indigo-600` → `primary` (or create a secondary color)

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind Config Reference](https://tailwindcss.com/docs/configuration)

---

**Need help?** Check the component files mentioned above or search for specific Tailwind classes you want to change!

