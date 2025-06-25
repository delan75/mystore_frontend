# MyStore Frontend

Ecommerce Store Project with React 19 - Fresh Farm Products

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and upgraded to React 19.

## Key Features

- **React 19 Native Metadata Support**: Uses React 19's built-in `<title>`, `<meta>`, and `<link>` tags instead of react-helmet-async
- **Modern SEO Implementation**: Dynamic meta tags, Open Graph, Twitter Cards, and structured data
- **Mobile-First Design**: Responsive components with touch-friendly interactions
- **Performance Optimized**: Lazy loading, caching, and optimized images
- **Accessibility First**: WCAG 2.1 AA compliance with proper ARIA labels

## SEO and Metadata

This project uses **React 19's native metadata support** instead of third-party libraries like react-helmet-async. This provides:

- ✅ No dependency conflicts with React 19
- ✅ Better performance (native browser support)
- ✅ Automatic deduplication and streaming SSR
- ✅ Future-proof implementation

### Example Usage:

```jsx
// React 19 Native Metadata (Current Approach)
function Page() {
  return (
    <>
      <title>My Page Title</title>
      <meta name="description" content="Page description" />
      <meta property="og:title" content="My Page Title" />
      {/* page content */}
    </>
  );
}
```

**Note**: We previously used react-helmet-async but migrated to React 19's native support for better compatibility and performance.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Structure

```
src/
├── components/
│   ├── SEO/                    # SEO components using React 19 native metadata
│   ├── UI/                     # Reusable UI components
│   ├── Layout/                 # Layout components (Header, Footer, etc.)
│   └── Landing/                # Landing page sections
├── context/                    # React context providers
├── hooks/                      # Custom React hooks
├── services/                   # API services
├── styles/                     # Global styles and design tokens
└── utils/                      # Utility functions
```

## Dependencies

This project uses modern React 19 features and avoids legacy dependencies:

- **React 19**: Latest React with native metadata support
- **No react-helmet-async**: Uses React 19 native `<title>` and `<meta>` tags
- **React Router v5**: Client-side routing
- **Axios**: HTTP client for API calls
- **FontAwesome**: Icon library
