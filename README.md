# Vibify - Your Spotify Virtual Room 🎵

An immersive web application that transforms your Spotify listening experience into a virtual music sanctuary. Build your vinyl collection, customize your personal space, and discover new music in style.

## Features ✨

### 🏠 Virtual Room Experience
- Beautiful 3D perspective virtual room with customizable aesthetics
- Ambient lighting effects (warm, cool, neon, natural)
- Decorative elements including plants, lamps, and furniture
- Multiple wall colors and floor types to personalize your space

### 💿 Animated Record Player
- Realistic vinyl record player with spinning animation
- Syncs perfectly with Spotify playback
- Displays current album artwork on the spinning vinyl
- Animated tonearm that moves with play/pause

### 📚 Vinyl Collection
- Automatically tracks all albums you listen to
- Displays your collection as beautiful vinyl records on wall shelves
- Hover to see album details and listen count
- Click any record to play that album instantly

### 🎵 Music Discovery
- Personalized recommendations based on your listening history
- Adjustable popularity slider: from mainstream hits to hidden gems
- Add recommended songs directly to your playlists
- Create new playlists on the fly

### 🎮 Playback Controls
- Full playback control (play, pause, skip, seek)
- Volume control
- Real-time progress tracking
- Displays current track information

### 🎨 Room Customization
- 6 preset wall colors
- 4 lighting modes
- 3 floor types (wood, carpet, tile)
- Toggle decorative plants on/off
- All preferences saved locally

## Prerequisites 📋

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Spotify Premium account** (required for playback features)
- **Spotify Developer account** (to create an app and get credentials)

## Getting Started 🚀

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Vibify3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - **App Name**: Vibify (or your preferred name)
   - **App Description**: Personal music sanctuary app
5. After creating the app, click "Edit Settings"
6. Add Redirect URI: `http://127.0.0.1:5173/callback` (Note: Use IP address, not localhost, due to Spotify API requirements)
7. Save your settings
8. Copy your **Client ID** from the app dashboard

### 4. Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and add your Spotify Client ID:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Building for Production 🏗️

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Usage Guide 📖

### First Time Setup

1. **Login**: Click "Connect with Spotify" and authorize the application
2. **Premium Check**: The app will verify you have Spotify Premium
3. **Player Initialization**: Wait a few seconds for the player to initialize

### Playing Music

- **From Your Collection**: Click any vinyl record on your wall to play that album
- **From Recommendations**: Use the "Discover" tab to find new music
- **Playback Controls**: Use the bottom control bar to manage playback

### Customizing Your Room

1. Click your profile icon in the top-right corner
2. Select "Room Settings"
3. Adjust:
   - Wall color
   - Lighting mode
   - Floor type
   - Plants visibility
4. Changes are saved automatically

### Building Your Collection

- Simply play any music through the app
- Albums are automatically added to your collection
- Each play increases the listen count
- Your collection persists in browser storage

### Discovering New Music

1. Navigate to the "Discover" tab
2. Adjust the popularity slider:
   - **Left**: Hidden gems and obscure tracks
   - **Middle**: Balanced mix
   - **Right**: Mainstream hits
3. Click "Refresh" to get new recommendations
4. Add songs to playlists or play them instantly

## Project Structure 📁

```
Vibify3/
├── src/
│   ├── auth/                 # Authentication logic
│   ├── components/           # React components
│   │   ├── Room/            # Virtual room components
│   │   ├── RecordPlayer/    # Record player components
│   │   ├── RecordCollection/# Collection display
│   │   ├── Recommendations/ # Music discovery
│   │   ├── Customization/   # Room settings
│   │   └── Playlists/       # Playlist management
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API and storage services
│   ├── styles/              # CSS files
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                   # Static assets
├── index.html               # HTML template
└── package.json             # Dependencies
```

## Technologies Used 🛠️

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Spotify Web API** - Music data and control
- **Spotify Web Playback SDK** - In-browser playback

## API Scopes 🔐

The app requests the following Spotify permissions:

- `streaming` - Play music through Web Playback SDK
- `user-read-playback-state` - Read current playback state
- `user-modify-playback-state` - Control playback
- `user-read-email` - User identification
- `user-read-private` - User profile access
- `playlist-modify-public` - Modify public playlists
- `playlist-modify-private` - Modify private playlists
- `user-top-read` - Access top artists/tracks
- `user-library-read` - Read saved content
- `user-library-modify` - Save tracks

## Browser Compatibility 🌐

Vibify works best on modern browsers:

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (recent versions)
- ❌ Internet Explorer (not supported)

**Note**: The Spotify Web Playback SDK requires a modern browser with Web Audio API support.

## Troubleshooting 🔧

### Player Not Initializing

- Ensure you have Spotify Premium
- Check that your browser supports the Web Playback SDK
- Try refreshing the page
- Check browser console for errors

### Authentication Fails

- Verify your Client ID is correct in `.env`
- Ensure redirect URI matches in Spotify Dashboard and `.env`
- Clear browser cache and cookies
- Try logging out and back in

### Music Won't Play

- Make sure no other Spotify clients are active
- Check your internet connection
- Verify Spotify Premium is active
- Look for error messages in the player

### Collection Not Saving

- Check browser's local storage is enabled
- Ensure you're not in private/incognito mode
- Try a different browser

## Limitations ⚠️

- **Spotify Premium Required**: Free accounts cannot use playback features
- **Browser-Based**: Only works in web browsers (no mobile app)
- **Single Device**: One active Spotify session at a time
- **Local Storage**: Collection data stored locally (cleared if you clear browser data)

## Future Enhancements 🚀

Potential features for future versions:

- [ ] Backend storage for collections across devices
- [ ] Social features (share your room, see friends' rooms)
- [ ] More room themes and decorations
- [ ] Music visualizer integration
- [ ] Achievement system for listening milestones
- [ ] Lyrics display
- [ ] Mobile-responsive design
- [ ] Queue management
- [ ] Search functionality

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is for educational and personal use. Spotify and related marks are trademarks of Spotify AB.

## Acknowledgments 🙏

- Spotify for their amazing API and Web Playback SDK
- The open-source community for the excellent tools and libraries
- All music lovers who inspired this project

## Support 💬

If you encounter issues or have questions:

1. Check the Troubleshooting section
2. Review [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
3. Check [Spotify Web Playback SDK Docs](https://developer.spotify.com/documentation/web-playback-sdk)

---

**Enjoy your personalized music sanctuary! 🎵✨**