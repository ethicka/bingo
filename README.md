# Bingo Caller

A modern, responsive Bingo caller web app built with SvelteKit and Tailwind CSS, perfect for classrooms and PTA events with support for 4K displays and mobile devices.

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

## Support

If you find this tool useful, you can:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ethicka)

## License

MIT
