# Notification Sounds

This directory contains notification sound files for the application.

## Notification Sound

The primary notification sound `notification.mp3` should be placed in this directory. If you don't have a sound file, you can download a free notification sound from sites like:

- [Mixkit](https://mixkit.co/free-sound-effects/notification/)
- [Freesound](https://freesound.org/)
- [SoundBible](https://soundbible.com/)

## Usage

The notification sounds are loaded via the `NotificationSound.jsx` component. 

You can also use the Web Audio API in the component to generate simple beep sounds programmatically without needing external sound files.

## Testing

You can test notifications and sounds by using the global test functions in the browser console:

```javascript
// Test with default message
window.testNotification();

// Test with custom message
window.testNotification("Your custom notification message");

// Test message-specific notification
window.testMessageNotification("12345", "John Doe");
```