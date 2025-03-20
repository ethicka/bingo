# Bingo Caller

A modern, responsive web application for calling Bingo numbers in a classroom or PTA setting. Built with SvelteKit and designed for display on large screens (4K TVs, projectors).

## Features

- **Split-Screen Layout**
  - Left: Grid showing called numbers organized by B-I-N-G-O columns
  - Right: Large number display with controls

- **Number Calling**
  - Random number generation
  - Manual number entry
  - Large, clear display of current number with column letter
  - Progress tracking (called numbers / total)

- **Game Management**
  - Click any called number to remove it (with confirmation)
  - Reset game functionality
  - Auto-saves game state (persists through page refresh)
  - Progress bar showing game completion

- **Design**
  - Clean, minimal interface
  - Optimized for 4K displays
  - Last called number highlighted in red
  - Called numbers shown with blue borders
  - Fully responsive layout

## Usage

1. **Starting a Game**
   - Press "Random" for random number selection
   - Or type a number (1-75) and press Enter or "Call"

2. **Managing Numbers**
   - Click any called number to remove it (useful for corrections)
   - Use Reset button to start a new game
   - Game state automatically saves in browser

3. **Number Ranges**
   - B: 1-15
   - I: 16-30
   - N: 31-45
   - G: 46-60
   - O: 61-75

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technical Stack

- SvelteKit
- Tailwind CSS v4
- TypeScript
- Local Storage for state persistence

## Browser Support

Works in all modern browsers with localStorage support. Not intended for mobile use (designed for large displays).

## License

MIT
