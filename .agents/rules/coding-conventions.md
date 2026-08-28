# Coding Conventions

## React Components
- Use **functional components** with hooks — never class components.
- One component per file. File name must match the exported component name in **PascalCase**.
- Use **default export** for components, **named exports** for hooks and contexts.
- Destructure props in function parameters.

## File Organization
- **Pages** (`src/pages/`): Route-level components — each maps to a single route.
- **Components** (`src/components/`): Reusable, composable UI building blocks.
- **Context** (`src/context/`): React Context providers with associated hooks.
- **Data** (`src/data/`): Static data files exporting arrays/objects.

## Styling
- Use **Tailwind CSS utility classes** exclusively — no CSS modules, no styled-components, no inline `style` attributes.
- Use the project's custom design tokens (`cinnamon-*`, `forest-*`, `cream-*`, `gold-*`) defined in `tailwind.config.js`.
- Use the project's custom font families: `font-serif`, `font-sans`, `font-accent`.
- Use the project's custom animations and shadows from `tailwind.config.js`.

## Animations
- Use **Framer Motion** for component-level animations (enter/exit, gestures, layout).
- All page-level components must be wrapped in the `<PageWrapper>` component for route transitions.
- Use Tailwind animation classes for simple CSS animations (float, fade-in, slide-up).

## Images
- **ALWAYS** reference images through the `IMAGES` object in `src/data/images.js`.
- Never hardcode image URLs in component files.
- When adding new images, add them to the `IMAGES` object first.

## State Management
- Use **React Context + useReducer** for global state (cart, wishlist, auth).
- Use **useState** for local component state.
- Persist important state to `localStorage` when appropriate.
- Provider hierarchy must be maintained: `BrowserRouter → CartProvider → WishlistProvider → ToastProvider`.

## Naming
- Components: `PascalCase.jsx` (e.g., `ProductCard.jsx`)
- Data files: `camelCase.js` (e.g., `products.js`)
- Context files: `PascalCase.jsx` with `Context` suffix (e.g., `CartContext.jsx`)
- Custom hooks: `camelCase` with `use` prefix (e.g., `useCart`)
- CSS classes: Tailwind utilities only

## Imports
- Group imports in order: React/library imports → local components → data/utils → styles.
- Use relative paths for local imports.
